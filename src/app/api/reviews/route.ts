import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query, execute } from '@/lib/db';

export const runtime = 'edge';

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
    try {
        const results = await query<ReviewDB>("SELECT * FROM reviews WHERE status = 'approved' ORDER BY created_at DESC");
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

export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { rating, comment } = await request.json() as { rating: number; comment: string };

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
        }

        const id = Date.now().toString();
        const newReview = {
            id,
            user_name: session.user.name || 'Anonymous',
            user_email: session.user.email || 'anonymous@example.com',
            rating,
            comment,
            status: 'pending' // Moderate by default
        };

        await execute(
            "INSERT INTO reviews (id, user_name, user_email, rating, comment, status) VALUES (?, ?, ?, ?, ?, ?)",
            [id, newReview.user_name, newReview.user_email, rating, comment, 'pending']
        );

        return NextResponse.json({
            success: true,
            review: {
                ...newReview,
                user: newReview.user_name,
                email: newReview.user_email,
                date: new Date().toISOString(),
                approved: false
            }
        });
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }
}
