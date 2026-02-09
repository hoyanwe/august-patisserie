import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { query, execute } from '@/lib/db';


interface CategoryDB {
    id: string;
    name_en: string;
    name_zh: string;
}

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
        const body = await request.json() as { name: { en: string; zh: string } };
        const id = Date.now().toString();

        await execute(
            'INSERT INTO categories (id, name_en, name_zh) VALUES (?, ?, ?)',
            [id, body.name.en, body.name.zh]
        );

        return NextResponse.json({
            id,
            name: body.name,
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
        await execute('DELETE FROM categories WHERE id = ?', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
