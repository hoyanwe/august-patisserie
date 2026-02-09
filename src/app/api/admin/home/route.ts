import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { query, execute } from '@/lib/db';


export async function GET() {
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const results = await query<{ data: string }>('SELECT data FROM home_content WHERE id = ?', ['main']);
        if (results.length > 0) {
            return NextResponse.json(JSON.parse(results[0].data));
        }

        // Return default structure if not found in DB
        return NextResponse.json({
            hero: {
                en: { title: '', subtitle: '', buttonText: '' },
                zh: { title: '', subtitle: '', buttonText: '' }
            },
            heroImage: ''
        });
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to fetch home content' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await request.json() as any;
        await execute(
            "INSERT INTO home_content (id, data) VALUES ('main', ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data",
            [JSON.stringify(data)]
        );
        return NextResponse.json(data);
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to update home content' }, { status: 500 });
    }
}
