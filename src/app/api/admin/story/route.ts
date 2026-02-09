import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { query, execute } from '@/lib/db';


export async function GET() {
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const results = await query<{ value: string }>('SELECT value FROM site_settings WHERE key = ?', ['story']);
        if (results.length > 0) {
            return NextResponse.json(JSON.parse(results[0].value));
        }
        return NextResponse.json({ title: '', content: '' });
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to fetch story' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const storyData = await request.json() as any;
        await execute(
            "INSERT INTO site_settings (key, value) VALUES ('story', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
            [JSON.stringify(storyData)]
        );
        return NextResponse.json(storyData);
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to update story' }, { status: 500 });
    }
}
