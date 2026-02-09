import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { query, execute } from '@/lib/db';


interface ReviewDB {
    id: string;
    user_name: string;
    user_email: string;
    rating: number;
    comment: string;
    status: string;
    created_at: string;
}

export async function GET() {
    const isAuth = await checkAuth();
    if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const results = await query<ReviewDB>('SELECT * FROM reviews ORDER BY created_at DESC');
        const reviews = results.map(row => ({
            id: row.id,
            user: row.user_name,
            email: row.user_email,
            rating: row.rating,
            comment: row.comment,
            date: row.created_at,
            approved: row.status === 'approved'
        }));
        return NextResponse.json(reviews);
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json([]);
    }
}

export async function PUT(request: Request) {
    const isAuth = await checkAuth();
    if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id, approved, remove } = await request.json() as { id: string; approved?: boolean; remove?: boolean };

        if (remove) {
            await execute('DELETE FROM reviews WHERE id = ?', [id]);
        } else {
            const status = approved ? 'approved' : 'pending';
            await execute('UPDATE reviews SET status = ? WHERE id = ?', [status, id]);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
    }
}
