'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from "next-auth/react";
import { useTranslations } from 'next-intl';

interface Review {
    id: string;
    user: string;
    image?: string;
    rating: number;
    comment: string;
    date: string;
}

export default function ReviewSection() {
    const t = useTranslations('Reviews');
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/reviews');
            const data = await res.json() as Review[];
            setReviews(data);
        } catch (error) {
            console.error('Failed to load reviews');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;
        setSubmitting(true);

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, comment }),
            });
            if (res.ok) {
                setSubmitted(true);
                setComment('');
                setRating(5);
            }
        } catch (error) {
            alert('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc: number, r: Review) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    return (
        <section style={{ padding: '4rem 1rem', background: 'white' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '1rem',
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '2.5rem'
                }}>
                    {t('title')}
                </h2>

                {averageRating && (
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-pink)' }}>{averageRating}</div>
                        <div style={{ fontSize: '1.2rem', color: '#ffcc00' }}>
                            {'★'.repeat(Math.round(Number(averageRating)))}{'☆'.repeat(5 - Math.round(Number(averageRating)))}
                        </div>
                        <div style={{ color: '#888', marginTop: '0.5rem' }}>{t('averageRating', { count: reviews.length })}</div>
                    </div>
                )}

                {/* Submit Review Form */}
                <div style={{
                    background: '#fdf8ff',
                    padding: '2rem',
                    borderRadius: '20px',
                    marginBottom: '4rem',
                    border: '1px solid #eee'
                }}>
                    <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-playfair)' }}>{t('leaveReview')}</h3>

                    {!session ? (
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ marginBottom: '1.5rem', color: '#666' }}>{t('signInToReview')}</p>
                            <button
                                onClick={() => signIn('google')}
                                style={{
                                    background: 'white',
                                    color: '#333',
                                    border: '1px solid #ddd',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    margin: '0 auto'
                                }}
                            >
                                <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '18px' }} />
                                {t('signInBtn')}
                            </button>
                        </div>
                    ) : submitted ? (
                        <div style={{ textAlign: 'center', color: '#4CAF50' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✓</div>
                            <p>{t('thankYou')}</p>
                            <button
                                onClick={() => setSubmitted(false)}
                                style={{ marginTop: '1rem', color: 'var(--color-pink)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                            >
                                {t('writeAnother')}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('ratingLabel')}</label>
                                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '1.5rem' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            onClick={() => setRating(star)}
                                            style={{ cursor: 'pointer', color: star <= rating ? '#ffcc00' : '#ddd' }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('thoughtsLabel')}</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder={t('placeholder')}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: '1px solid #ddd',
                                        minHeight: '100px',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#888' }}>
                                    {session.user?.image && <img src={session.user.image} style={{ width: '24px', borderRadius: '50%' }} />}
                                    {t('postingAs', { name: session.user?.name || '' })}
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    style={{
                                        background: 'var(--color-pink)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.75rem 2rem',
                                        borderRadius: '50px',
                                        cursor: submitting ? 'not-allowed' : 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    {submitting ? t('submittingBtn') : t('submitBtn')}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Reviews List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {reviews.map((r) => (
                        <div key={r.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    {r.image && <img src={r.image} style={{ width: '40px', borderRadius: '50%' }} />}
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{r.user}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{new Date(r.date).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div style={{ color: '#ffcc00' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                            </div>
                            <p style={{ color: '#555', lineHeight: '1.6' }}>{r.comment}</p>
                        </div>
                    ))}

                    {reviews.length === 0 && (
                        <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>{t('noReviews')}</p>
                    )}
                </div>
            </div>
        </section>
    );
}
