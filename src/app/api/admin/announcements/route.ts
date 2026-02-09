import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { query, execute } from '@/lib/db';

export const runtime = 'edge';

interface AnnouncementDB {
    id: string;
    text_en: string;
    text_zh: string;
    active: number;
    sort_order: number;
}

export async function GET() {
    try {
        const results = await query<AnnouncementDB>('SELECT * FROM announcements ORDER BY sort_order');
        const announcements = results.map(row => ({
            id: row.id,
            text: { en: row.text_en, zh: row.text_zh },
            active: row.active === 1
        }));
        return NextResponse.json(announcements);
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

        // Delete existing and re-insert
        await execute('DELETE FROM announcements');
        for (let i = 0; i < body.length; i++) {
            const ann = body[i];
            await execute(
                `INSERT INTO announcements (id, text_en, text_zh, active, sort_order)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    ann.id || Date.now().toString() + i,
                    ann.text.en,
                    ann.text.zh,
                    ann.active ? 1 : 0,
                    i
                ]
            );
        }

        return NextResponse.json(body);
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to update announcements' }, { status: 500 });
    }
}
