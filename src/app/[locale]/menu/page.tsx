import { getTranslations } from 'next-intl/server';
import FilterableProductGrid from '@/components/FilterableProductGrid';
import { query } from '@/lib/db';
import { getMenuProducts, type Product } from '@/lib/products';

// Always reflect live D1 data (never a stale build-time snapshot).
export const dynamic = 'force-dynamic';

interface CategoryDB {
    id: string;
    name_en: string;
    name_zh: string;
}

export default async function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
    const t = await getTranslations('Menu');
    const { locale } = await params;

    // Fetch products from D1 (shared query/mapper keeps isBestSeller + image order correct).
    let products: Product[] = [];
    try {
        products = await getMenuProducts();
    } catch (error) {
        console.error('Failed to fetch products from D1:', error);
    }

    // Fetch categories from D1
    interface Category {
        id: string;
        name: { en: string; zh: string };
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

    const eyebrow = locale === 'zh' ? '手工烘焙甜點' : 'Handcrafted Pâtisserie';

    return (
        <div className="ed-page menu-container" style={{ padding: '4rem 2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <span className="ed-eyebrow">{eyebrow}</span>
                    <h1 className="ed-title menu-title" style={{
                        fontSize: 'clamp(2.4rem, 5.5vw, 3.6rem)',
                        marginTop: '0.8rem',
                        marginBottom: 0,
                    }}>
                        {t('title')}
                    </h1>
                    <div className="ed-divider" />
                    <p className="ed-lede" style={{ margin: 0 }}>
                        {t('subtitle')}
                    </p>
                </div>

                {products.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        color: 'var(--text-secondary)',
                    }}>
                        {t('empty')}
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
                        font-size: 2.2rem !important;
                    }
                    .products-grid {
                         grid-template-columns: 1fr !important;
                         gap: 1.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
}
