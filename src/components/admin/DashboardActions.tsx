'use client';

export default function DashboardActions() {
    return (
        <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
            <h2 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Quick Actions</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="/admin/products" style={{
                    padding: '0.75rem 1.5rem',
                    background: '#E0BBE4', // pastel-purple
                    color: '#333333',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '500',
                    transition: 'transform 0.2s',
                    display: 'inline-block',
                }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    ➕ Add New Product
                </a>
                <a href="/admin/categories" style={{
                    padding: '0.75rem 1.5rem',
                    background: '#FFB7B2', // pastel-pink
                    color: '#333333',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '500',
                    transition: 'transform 0.2s',
                    display: 'inline-block',
                }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    ➕ Add New Category
                </a>
                <a href="/admin/story" style={{
                    padding: '0.75rem 1.5rem',
                    background: '#C7CEEA', // pastel-blue (was pastel-blue but making it distinct)
                    color: '#333333',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '500',
                    transition: 'transform 0.2s',
                    display: 'inline-block',
                }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    ✏️ Edit Story
                </a>
            </div>
        </div>
    );
}
