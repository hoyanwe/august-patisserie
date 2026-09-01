// Global fallback 404. Rendered outside the [locale] layout, so it stays
// locale-neutral (bilingual) and links to the site root, which the middleware
// redirects to the visitor's locale — never hardcoding /en.
export default function NotFound() {
    return (
        <html lang="en">
            <body style={{ margin: 0 }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    fontFamily: 'system-ui, sans-serif',
                    padding: '2rem',
                    textAlign: 'center',
                    background: '#fffdf9',
                    color: '#241f1b',
                }}>
                    <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
                    <p style={{ fontSize: '1.4rem', marginTop: '1rem' }}>
                        Page not found · 页面不存在
                    </p>
                    {/* Full document navigation is intentional on the global error page. */}
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a href="/" style={{
                        marginTop: '2rem',
                        padding: '0.75rem 1.5rem',
                        background: '#E0BBE4',
                        color: '#333',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                    }}>
                        Homepage · 返回首页
                    </a>
                </div>
            </body>
        </html>
    );
}
