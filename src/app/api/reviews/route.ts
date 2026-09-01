import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query, execute } from '@/lib/db';


interface ReviewDB {
    id: string;
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

const MAX_COMMENT_LENGTH = 1000;

export async function GET() {
    try {
        // Explicit columns only — never SELECT * on a table with PII (user_email)
        // destined for a public, unauthenticated response.
        const results = await query<ReviewDB>(
            "SELECT id, user_name, rating, comment, created_at FROM reviews WHERE status = 'approved' ORDER BY created_at DESC LIMIT 50",
        );
        const reviews = results.map(row => ({
            id: row.id,
            user: row.user_name,
            rating: row.rating,
            comment: row.comment,
            date: row.created_at,
            approved: true,
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
        const { rating, comment } = await request.json() as { rating: unknown; comment: unknown };

        if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
        }

        if (typeof comment !== 'string') {
            return NextResponse.json({ error: 'Invalid comment' }, { status: 400 });
        }
        const trimmed = comment.trim();
        if (trimmed.length === 0 || trimmed.length > MAX_COMMENT_LENGTH) {
            return NextResponse.json({ error: 'Comment must be 1–1000 characters' }, { status: 400 });
        }

        const id = Date.now().toString();
        const userName = session.user.name || 'Anonymous';
        const userEmail = session.user.email || 'anonymous@example.com';

        await execute(
            "INSERT INTO reviews (id, user_name, user_email, rating, comment, status) VALUES (?, ?, ?, ?, ?, ?)",
            [id, userName, userEmail, rating, trimmed, 'pending'],
        );

        // Never echo the reviewer's email back to the client.
        return NextResponse.json({
            success: true,
            review: {
                id,
                user: userName,
                rating,
                comment: trimmed,
                date: new Date().toISOString(),
                approved: false,
            },
        });
    } catch (error) {
        console.error('D1 error:', error);
        return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }
}
