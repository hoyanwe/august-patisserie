'use client';

import Link from 'next/link';

export default function AdminSidebar() {
    return (
        <aside style={{
            width: '250px',
            background: 'linear-gradient(180deg, #E0BBE4 0%, #FFB7B2 100%)', // Hardcoded hex for reliability
            backgroundColor: '#E0BBE4', // Fallback
            color: '#333333', // Dark text for readability
            padding: '2rem 0',
            boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
        }}>
            <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '1.5rem',
                    fontFamily: 'var(--font-playfair)',
                    margin: 0,
                }}>
                    August Patisserie
                </h1>
                <p style={{ margin: '0.5rem 0 0', opacity: 0.9, fontSize: '0.875rem' }}>
                    Admin Dashboard
                </p>
            </div>

            <nav>
                <Link href="/admin" style={{
                    display: 'block',
                    padding: '0.875rem 1.5rem',
                    color: '#333333',
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    📊 Dashboard
                </Link>
                <Link href="/admin/products" style={{
                    display: 'block',
                    padding: '0.875rem 1.5rem',
                    color: '#333333',
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    🧁 Products
                </Link>
                <Link href="/admin/categories" style={{
                    display: 'block',
                    padding: '0.875rem 1.5rem',
                    color: '#333333',
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    📁 Categories
                </Link>
                <Link href="/admin/story" style={{
                    display: 'block',
                    padding: '0.875rem 1.5rem',
                    color: '#333333',
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    📝 Story
                </Link>
                <Link href="/admin/home" style={{
                    display: 'block',
                    padding: '0.875rem 1.5rem',
                    color: '#333333',
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    🏠 Home Page
                </Link>
                <Link href="/admin/contact" style={{
                    display: 'block',
                    padding: '0.875rem 1.5rem',
                    color: '#333333',
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    📞 Contact Page
                </Link>

                <Link href="/admin/announcements" style={{
                    display: 'block',
                    padding: '0.875rem 1.5rem',
                    color: '#333333',
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    📢 Announcements
                </Link>
                <Link href="/admin/ingredients" style={{
                    display: 'block',
                    padding: '0.875rem 1.5rem',
                    color: '#333333',
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    🥣 Ingredients
                </Link>
                <Link href="/admin/reviews" style={{
                    display: 'block',
                    padding: '0.875rem 1.5rem',
                    color: '#333333',
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    ⭐ Reviews
                </Link>

                <div style={{ margin: '2rem 1.5rem 0', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                    <form action="/api/admin/logout" method="POST">
                        <button type="submit" style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'white',
                            color: '#333333',
                            border: '1px solid rgba(0,0,0,0.05)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            transition: 'background 0.2s',
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.6)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}>
                            🚪 Logout
                        </button>
                    </form>
                </div>
            </nav>
        </aside>
    );
}
