'use client';

import { useState, useEffect } from 'react';

interface Review {
    id: string;
    user: string;
    email: string;
    rating: number;
    comment: string;
    date: string;
    approved: boolean;
    image?: string;
}

export default function ReviewModerationPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/admin/reviews');
            const data = await res.json() as Review[];
            setReviews(data);
        } catch (error) {
            console.error('Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleModeration = async (id: string, approved: boolean, remove = false) => {
        try {
            const res = await fetch('/api/admin/reviews', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, approved, remove }),
            });
            if (res.ok) {
                fetchReviews();
            }
        } catch (error) {
            alert('Action failed');
        }
    };

    if (loading) return <div>Loading...</div>;

    const pending = reviews.filter(r => !r.approved);
    const approved = reviews.filter(r => r.approved);

    return (
        <div style={{ maxWidth: '1000px' }}>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '2rem', marginBottom: '2rem' }}>Review Moderation</h1>

            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Pending Approval ({pending.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                {pending.map(r => (
                    <ReviewCard key={r.id} review={r} onAction={handleModeration} />
                ))}
                {pending.length === 0 && <p style={{ color: '#888' }}>No pending reviews.</p>}
            </div>

            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Approved Reviews ({approved.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {approved.map(r => (
                    <ReviewCard key={r.id} review={r} onAction={handleModeration} />
                ))}
                {approved.length === 0 && <p style={{ color: '#888' }}>No approved reviews yet.</p>}
            </div>
        </div>
    );
}

function ReviewCard({ review, onAction }: { review: Review, onAction: any }) {
    return (
        <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            gap: '1.5rem'
        }}>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    {review.image && <img src={review.image} style={{ width: '30px', borderRadius: '50%' }} />}
                    <div>
                        <strong>{review.user}</strong> ({review.email})
                        <div style={{ fontSize: '0.75rem', color: '#aaa' }}>{new Date(review.date).toLocaleString()}</div>
                    </div>
                </div>
                <div style={{ color: '#ffcc00', marginBottom: '0.5rem' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                <p style={{ margin: 0, color: '#444' }}>{review.comment}</p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
                {!review.approved && (
                    <button
                        onClick={() => onAction(review.id, true)}
                        style={{ padding: '0.5rem 1rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        Approve
                    </button>
                )}
                {review.approved && (
                    <button
                        onClick={() => onAction(review.id, false)}
                        style={{ padding: '0.5rem 1rem', background: '#FF9800', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        Unapprove
                    </button>
                )}
                <button
                    onClick={() => onAction(review.id, false, true)}
                    style={{ padding: '0.5rem 1rem', background: '#f44336', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
