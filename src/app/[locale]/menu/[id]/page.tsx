import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import ProductDetail from '@/components/ProductDetail';


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

interface Props {
    params: Promise<{ id: string; locale: string }>;
}

export default async function ProductPage({ params }: Props) {
    const { id, locale } = await params;

    // Fetch product data from D1
    let product = null;
    try {
        const results = await query<ProductDB>(`
            SELECT p.*, GROUP_CONCAT(pi.url) as images_list
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id
            WHERE p.id = ?
            GROUP BY p.id
        `, [id]);

        if (results.length > 0) {
            const row = results[0];
            product = {
                id: row.id,
                name: { en: row.name_en, zh: row.name_zh },
                price: row.price,
                description: { en: row.description_en, zh: row.description_zh },
                image: row.main_image,
                images: row.images_list ? row.images_list.split(',') : []
            };
        }
    } catch (error) {
        console.error('Error fetching product from D1:', error);
    }

    if (!product) {
        notFound();
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8f9fa',
            padding: '4rem 2rem'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <ProductDetail product={product} locale={locale} />
            </div>
        </div>
    );
}
