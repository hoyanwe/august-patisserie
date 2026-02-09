import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { query, execute } from '@/lib/db';


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
    images_list?: string; // Comma separated from GROUP_CONCAT
}

// GET all products
export async function GET() {
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const results = await query<ProductDB>(`
            SELECT p.*, GROUP_CONCAT(pi.url) as images_list
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id
            GROUP BY p.id
        `);

        const products = results.map(row => ({
            id: row.id,
            name: { en: row.name_en, zh: row.name_zh },
            price: row.price,
            category: row.category_id,
            description: { en: row.description_en, zh: row.description_zh },
            isBestSeller: row.is_best_seller === 1,
            image: row.main_image,
            images: row.images_list ? row.images_list.split(',') : []
        }));

        return NextResponse.json({ products });
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ products: [] });
    }
}

// POST new product
export async function POST(request: Request) {
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json() as {
            name: { en: string; zh: string };
            price: number;
            category: string;
            description: { en: string; zh: string };
            isBestSeller: boolean;
            image: string;
            images: string[];
        };
        const id = Date.now().toString();

        await execute(
            `INSERT INTO products (id, name_en, name_zh, price, category_id, description_en, description_zh, is_best_seller, main_image)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                body.name.en,
                body.name.zh,
                body.price,
                body.category,
                body.description.en,
                body.description.zh,
                body.isBestSeller ? 1 : 0,
                body.image
            ]
        );

        // Insert additional images if any
        if (body.images && body.images.length > 0) {
            for (let i = 0; i < body.images.length; i++) {
                await execute(
                    'INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)',
                    [id, body.images[i], i]
                );
            }
        }

        const newProduct = { ...body, id };
        return NextResponse.json(newProduct);
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
