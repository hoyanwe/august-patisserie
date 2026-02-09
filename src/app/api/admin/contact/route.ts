import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { query, execute } from '@/lib/db';


export async function GET() {
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const results = await query<{ value: string }>('SELECT value FROM site_settings WHERE key = ?', ['contact']);
        if (results.length > 0) {
            return NextResponse.json(JSON.parse(results[0].value));
        }
        // Return default structure if not found
        return NextResponse.json({
            en: { title: '', intro: '', whatsappTitle: '', instagramTitle: '' },
            zh: { title: '', intro: '', whatsappTitle: '', instagramTitle: '' }
        });
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to fetch contact content' }, { status: 500 });
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
            "INSERT INTO site_settings (key, value) VALUES ('contact', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
            [JSON.stringify(data)]
        );
        return NextResponse.json(data);
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to update contact content' }, { status: 500 });
    }
}
