import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { query, execute } from '@/lib/db';


interface CategoryDB {
    id: string;
    name_en: string;
    name_zh: string;
}

// Public: the menu filter renders categories.
export async function GET() {
    try {
        const results = await query<CategoryDB>('SELECT * FROM categories');
        const categories = results.map(row => ({
            id: row.id,
            name: {
                en: row.name_en,
                zh: row.name_zh
            },
            slug: row.id // Using ID as slug if not explicitly stored
        }));
        return NextResponse.json({ categories });
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ categories: [] });
    }
}

export async function POST(request: Request) {
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json() as { name?: { en?: string; zh?: string } };
        if (!body?.name || typeof body.name.en !== 'string' || body.name.en.trim() === '') {
            return NextResponse.json({ error: 'Category name (en) is required' }, { status: 400 });
        }
        const id = Date.now().toString();

        await execute(
            'INSERT INTO categories (id, name_en, name_zh) VALUES (?, ?, ?)',
            [id, body.name.en, body.name.zh ?? '']
        );

        return NextResponse.json({
            id,
            name: { en: body.name.en, zh: body.name.zh ?? '' },
            slug: id
        });
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to add category' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await request.json() as { id: string };
        if (!id) {
            return NextResponse.json({ error: 'Category id is required' }, { status: 400 });
        }

        // Refuse to orphan products: a category in use cannot be deleted until
        // its products are reassigned. This avoids silent FK failures / orphans.
        const inUse = await query<{ n: number }>(
            'SELECT COUNT(*) AS n FROM products WHERE category_id = ?',
            [id],
        );
        if ((inUse[0]?.n ?? 0) > 0) {
            return NextResponse.json(
                { error: `Cannot delete: ${inUse[0].n} product(s) still use this category. Reassign them first.` },
                { status: 409 },
            );
        }

        await execute('DELETE FROM categories WHERE id = ?', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
