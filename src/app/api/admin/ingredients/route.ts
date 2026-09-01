import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { query, batch } from '@/lib/db';


interface IngredientDB {
    id: string;
    name_en: string;
    name_zh: string;
    description_en: string;
    description_zh: string;
    image: string;
    sort_order: number;
}

// Public: the ingredient spotlight renders this.
export async function GET() {
    try {
        const results = await query<IngredientDB>('SELECT * FROM ingredients ORDER BY sort_order');
        const ingredients = results.map(row => ({
            id: row.id,
            name: { en: row.name_en, zh: row.name_zh },
            description: { en: row.description_en, zh: row.description_zh },
            image: row.image
        }));
        return NextResponse.json(ingredients);
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json([]);
    }
}

interface IngredientInput {
    id?: string;
    name?: { en?: string; zh?: string };
    description?: { en?: string; zh?: string };
    image?: string;
}

export async function PUT(request: Request) {
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json() as IngredientInput[];

        if (!Array.isArray(body)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        const rows = body.map((ing, i) => ({
            id: String(ing.id ?? `${Date.now()}-${i}`),
            name_en: String(ing.name?.en ?? ''),
            name_zh: String(ing.name?.zh ?? ''),
            description_en: String(ing.description?.en ?? ''),
            description_zh: String(ing.description?.zh ?? ''),
            image: String(ing.image ?? ''),
            sort_order: i,
        }));

        const ids = new Set(rows.map(r => r.id));
        if (ids.size !== rows.length) {
            return NextResponse.json({ error: 'Duplicate ingredient id' }, { status: 400 });
        }

        // Atomic delete + re-insert.
        await batch(db => [
            db.prepare('DELETE FROM ingredients'),
            ...rows.map(r =>
                db.prepare(
                    'INSERT INTO ingredients (id, name_en, name_zh, description_en, description_zh, image, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
                ).bind(r.id, r.name_en, r.name_zh, r.description_en, r.description_zh, r.image, r.sort_order),
            ),
        ]);

        return NextResponse.json(body);
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to update ingredients' }, { status: 500 });
    }
}
