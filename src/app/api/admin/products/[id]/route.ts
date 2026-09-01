import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { batch } from '@/lib/db';
import { getProductById } from '@/lib/products';


interface ProductInput {
    name: { en: string; zh: string };
    price: number;
    category: string;
    description: { en: string; zh: string };
    isBestSeller: boolean;
    isActive?: boolean;
    image: string;
    images: string[];
}

function validate(body: Partial<ProductInput>): string | null {
    if (!body || typeof body !== 'object') return 'Invalid body';
    if (!body.name || typeof body.name.en !== 'string' || body.name.en.trim() === '') return 'Name (en) is required';
    if (typeof body.price !== 'number' || !Number.isFinite(body.price) || body.price < 0) return 'Valid price is required';
    if (typeof body.category !== 'string' || body.category.trim() === '') return 'Category is required';
    return null;
}

// GET single product
export async function GET(
    _request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    try {
        const product = await getProductById(id);
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
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
        const body = await request.json() as ProductInput;
        const invalid = validate(body);
        if (invalid) {
            return NextResponse.json({ error: invalid }, { status: 400 });
        }

        const images = Array.isArray(body.images) ? body.images.filter((u): u is string => typeof u === 'string' && u.length > 0) : [];

        // Atomic: the product update, the image wipe and the image re-insert all
        // commit or roll back together.
        await batch(db => [
            db.prepare(
                `UPDATE products SET
                    name_en = ?, name_zh = ?, price = ?, category_id = ?,
                    description_en = ?, description_zh = ?, is_best_seller = ?, is_active = ?, main_image = ?
                 WHERE id = ?`,
            ).bind(
                body.name.en,
                body.name.zh ?? '',
                body.price,
                body.category,
                body.description?.en ?? '',
                body.description?.zh ?? '',
                body.isBestSeller ? 1 : 0,
                body.isActive === false ? 0 : 1, // default active
                body.image ?? '',
                id,
            ),
            db.prepare('DELETE FROM product_images WHERE product_id = ?').bind(id),
            ...images.map((url, i) =>
                db.prepare('INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)').bind(id, url, i),
            ),
        ]);

        return NextResponse.json({ ...body, id, images });
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

// DELETE product
export async function DELETE(
    _request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    try {
        await batch(db => [
            db.prepare('DELETE FROM product_images WHERE product_id = ?').bind(id),
            db.prepare('DELETE FROM products WHERE id = ?').bind(id),
        ]);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
