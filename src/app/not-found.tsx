export default function NotFound() {
    return (
        <html>
            <body>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    fontFamily: 'system-ui, sans-serif',
                    padding: '2rem'
                }}>
                    <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
                    <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>Page Not Found</p>
                    <a href="/en" style={{
                        marginTop: '2rem',
                        padding: '0.75rem 1.5rem',
                        background: '#E0BBE4',
                        color: '#333',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontWeight: '600'
                    }}>
                        Go to Homepage
                    </a>
                </div>
            </body>
        </html>
    );
}
