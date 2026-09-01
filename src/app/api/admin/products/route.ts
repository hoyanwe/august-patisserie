import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { batch } from '@/lib/db';
import { getAllProducts } from '@/lib/products';


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

// GET all products (admin listing)
export async function GET() {
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const products = await getAllProducts();
        return NextResponse.json({ products });
    } catch (error) {
        // Honest failure: a DB outage must not look like an empty catalogue.
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
    }
}

// POST new product
export async function POST(request: Request) {
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json() as ProductInput;
        const invalid = validate(body);
        if (invalid) {
            return NextResponse.json({ error: invalid }, { status: 400 });
        }

        const id = Date.now().toString();
        const images = Array.isArray(body.images) ? body.images.filter((u): u is string => typeof u === 'string' && u.length > 0) : [];

        await batch(db => [
            db.prepare(
                `INSERT INTO products (id, name_en, name_zh, price, category_id, description_en, description_zh, is_best_seller, is_active, main_image)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ).bind(
                id,
                body.name.en,
                body.name.zh ?? '',
                body.price,
                body.category,
                body.description?.en ?? '',
                body.description?.zh ?? '',
                body.isBestSeller ? 1 : 0,
                body.isActive === false ? 0 : 1, // default active
                body.image ?? '',
            ),
            ...images.map((url, i) =>
                db.prepare('INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)').bind(id, url, i),
            ),
        ]);

        return NextResponse.json({ ...body, id, images });
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
