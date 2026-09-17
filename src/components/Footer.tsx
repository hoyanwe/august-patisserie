export default function Footer() {

    return (
        <footer style={{
            padding: '1rem 0',
            backgroundColor: '#e6ddce',
            borderTop: '1px solid var(--warm-line)',
            color: 'var(--warm-muted)',
            marginTop: 'auto'
        }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', letterSpacing: '0.02em' }}>
                    &copy; {new Date().getFullYear()} August Patisserie. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
