import { getTranslations } from 'next-intl/server';
import FilterableProductGrid from '@/components/FilterableProductGrid';
import { query } from '@/lib/db';


interface Product {
    id: string;
    name: {
        en: string;
        zh: string;
    };
    price: number;
    category: string;
    image: string;
    description: {
        en: string;
        zh: string;
    };
    images?: string[];
}

interface CategoryDB {
    id: string;
    name_en: string;
    name_zh: string;
}

interface ProductDB {
    id: string;
    name_en: string;
    name_zh: string;
    price: number;
    category_id: string;
    description_en: string;
    description_zh: string;
    is_best_seller: number;
    main_image: string;
    images_list?: string;
}

export default async function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
    const t = await getTranslations('Menu');
    const { locale } = await params;

    // Fetch products from D1
    let products: Product[] = [];
    try {
        const results = await query<ProductDB>(`
            SELECT p.*, GROUP_CONCAT(pi.url) as images_list
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id
            GROUP BY p.id
        `);

        products = results.map(row => ({
            id: row.id,
            name: { en: row.name_en, zh: row.name_zh },
            price: row.price,
            category: row.category_id,
            description: { en: row.description_en, zh: row.description_zh },
            image: row.main_image,
            images: row.images_list ? row.images_list.split(',') : []
        }));
    } catch (error) {
        console.error('Failed to fetch products from D1:', error);
    }

    // Fetch categories from D1
    interface Category {
        id: string;
        name: {
            en: string;
            zh: string;
        };
        slug: string;
    }
    let categories: Category[] = [];
    try {
        const results = await query<CategoryDB>('SELECT * FROM categories');
        categories = results.map(row => ({
            id: row.id,
            name: { en: row.name_en, zh: row.name_zh },
            slug: row.id
        }));
    } catch (error) {
        console.error('Failed to fetch categories from D1:', error);
    }

    const translations = {
        all: t('all'),
        bestSeller: t('bestSeller')
    };

    return (
        <div className="menu-container" style={{ padding: '4rem 2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 className="menu-title" style={{
                    fontSize: '3rem',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-playfair)',
                }}>
                    {t('title')}
                </h1>
                <p style={{
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    marginBottom: '3rem',
                    fontSize: '1.125rem',
                }}>
                    {t('subtitle')}
                </p>

                {products.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        color: 'var(--text-secondary)',
                    }}>
                        No products available yet. Check back soon!
                    </div>
                ) : (
                    <FilterableProductGrid
                        products={products}
                        categories={categories}
                        locale={locale}
                        translations={translations}
                    />
                )}
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .menu-container {
                        padding: 2rem 1rem !important;
                    }
                    .menu-title {
                        fontSize: 2.2rem !important;
                    }
                    .products-grid {
                         grid-template-columns: 1fr !important; /* Single column on mobile */
                         gap: 1.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
}
