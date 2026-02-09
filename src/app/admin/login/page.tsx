'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                setError('Invalid password');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #FFB7B2 0%, #C7CEEA 100%)', // Fallback for vars
        }}>
            <div style={{
                background: 'white',
                padding: '3rem',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '400px',
            }}>
                <h1 style={{
                    fontSize: '2rem',
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-playfair)',
                }}>
                    Admin Login
                </h1>
                <p style={{
                    color: 'var(--text-secondary)',
                    marginBottom: '2rem',
                }}>
                    August Patisserie CMS
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: 'var(--text-primary)',
                            fontWeight: '500',
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #C7CEEA', // var(--pastel-blue) fallback
                                borderRadius: '8px',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                backgroundColor: '#fff',
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#E0BBE4'} // var(--pastel-purple) fallback
                            onBlur={(e) => e.target.style.borderColor = '#C7CEEA'} // var(--pastel-blue) fallback
                        />
                    </div>

                    {error && (
                        <div style={{
                            padding: '0.75rem',
                            background: '#fee',
                            color: '#c33',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            fontSize: '0.9rem',
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            background: loading ? '#ccc' : '#E0BBE4', // Fallback for var(--pastel-purple)
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
