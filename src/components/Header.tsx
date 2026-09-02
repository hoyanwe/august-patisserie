import { Link } from '@/navigation';
import Navigation from './Navigation';

export default function Header() {
    return (
        <header style={{
            padding: '0.5rem 0',
            backgroundColor: '#DAD4CD',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            borderBottom: '1px solid rgba(58,47,40,0.08)'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {/* Logo */}
                <Link href="/" style={{
                    fontSize: '1.2rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    color: '#3a2f28'
                }}>
                    August Patisserie
                </Link>

                {/* Responsive Navigation */}
                <Navigation />
            </div>
        </header>
    );
}
