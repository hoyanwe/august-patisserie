import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { query, batch } from '@/lib/db';


interface AnnouncementDB {
    id: string;
    text_en: string;
    text_zh: string;
    active: number;
    sort_order: number;
}

// Public: the announcement bar renders this on every page.
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

interface AnnouncementInput {
    id?: string;
    text?: { en?: string; zh?: string };
    active?: boolean;
}

export async function PUT(request: Request) {
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json() as AnnouncementInput[];

        if (!Array.isArray(body)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        // Server-side validation before touching the DB. A deterministic,
        // collision-free id is assigned per row (index-suffixed with a separator
        // so "1"+"0" cannot collide with "10").
        const rows = body.map((ann, i) => ({
            id: String(ann.id ?? `${Date.now()}-${i}`),
            text_en: String(ann.text?.en ?? ''),
            text_zh: String(ann.text?.zh ?? ''),
            active: ann.active ? 1 : 0,
            sort_order: i,
        }));

        const ids = new Set(rows.map(r => r.id));
        if (ids.size !== rows.length) {
            return NextResponse.json({ error: 'Duplicate announcement id' }, { status: 400 });
        }

        // Atomic: DELETE + all INSERTs commit or roll back together.
        await batch(db => [
            db.prepare('DELETE FROM announcements'),
            ...rows.map(r =>
                db.prepare(
                    'INSERT INTO announcements (id, text_en, text_zh, active, sort_order) VALUES (?, ?, ?, ?, ?)',
                ).bind(r.id, r.text_en, r.text_zh, r.active, r.sort_order),
            ),
        ]);

        return NextResponse.json(body);
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to update announcements' }, { status: 500 });
    }
}
