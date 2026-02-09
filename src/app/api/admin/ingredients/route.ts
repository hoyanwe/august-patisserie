import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { query, execute } from '@/lib/db';


interface IngredientDB {
    id: string;
    name_en: string;
    name_zh: string;
    description_en: string;
    description_zh: string;
    image: string;
    sort_order: number;
}

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

export async function PUT(request: Request) {
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json() as any[];

        if (!Array.isArray(body)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        // Simplest is to delete all and re-insert
        await execute('DELETE FROM ingredients');
        for (let i = 0; i < body.length; i++) {
            const ing = body[i];
            await execute(
                `INSERT INTO ingredients (id, name_en, name_zh, description_en, description_zh, image, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    ing.id || Date.now().toString() + i,
                    ing.name.en,
                    ing.name.zh,
                    ing.description.en,
                    ing.description.zh,
                    ing.image,
                    i
                ]
            );
        }

        return NextResponse.json(body);
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to update ingredients' }, { status: 500 });
    }
}
