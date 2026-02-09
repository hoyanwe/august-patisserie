import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { query, execute } from '@/lib/db';

export const runtime = 'edge';

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

// GET single product
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    try {
        const results = await query<ProductDB>(`
            SELECT p.*, GROUP_CONCAT(pi.url) as images_list
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id
            WHERE p.id = ?
            GROUP BY p.id
        `, [id]);

        if (results.length === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const row = results[0];
        const product = {
            id: row.id,
            name: { en: row.name_en, zh: row.name_zh },
            price: row.price,
            category: row.category_id,
            description: { en: row.description_en, zh: row.description_zh },
            isBestSeller: row.is_best_seller === 1,
            image: row.main_image,
            images: row.images_list ? row.images_list.split(',') : []
        };

        return NextResponse.json(product);
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

// PUT update product
export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

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

        // Update main product table
        await execute(
            `UPDATE products SET 
                name_en = ?, name_zh = ?, price = ?, category_id = ?, 
                description_en = ?, description_zh = ?, is_best_seller = ?, main_image = ?
             WHERE id = ?`,
            [
                body.name.en,
                body.name.zh,
                body.price,
                body.category,
                body.description.en,
                body.description.zh,
                body.isBestSeller ? 1 : 0,
                body.image,
                id
            ]
        );

        // Update images: simplest is to delete and re-insert
        await execute('DELETE FROM product_images WHERE product_id = ?', [id]);
        if (body.images && body.images.length > 0) {
            for (let i = 0; i < body.images.length; i++) {
                await execute(
                    'INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)',
                    [id, body.images[i], i]
                );
            }
        }

        return NextResponse.json({ ...body, id });
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

// DELETE product
export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    try {
        // FK constraint should handle this if configured, but let's be explicit
        await execute('DELETE FROM product_images WHERE product_id = ?', [id]);
        await execute('DELETE FROM products WHERE id = ?', [id]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
