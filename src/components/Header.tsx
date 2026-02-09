import { Link } from '@/navigation';
import Navigation from './Navigation';

export default function Header() {
    return (
        <header style={{
            padding: '1.5rem 0',
            backgroundColor: 'var(--color-cream)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            borderBottom: '1px solid var(--color-border)'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {/* Logo */}
                <Link href="/" style={{
                    fontSize: '1.5rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 'bold',
                    color: 'var(--color-text-main)'
                }}>
                    August Patisserie
                </Link>

                {/* Responsive Navigation */}
                <Navigation />
            </div>
        </header>
    );
}
