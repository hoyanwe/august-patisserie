'use client';

import { Link } from '@/navigation';
import Navigation from './Navigation';
import { useEffect, useState } from 'react';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header style={{
            padding: '0.55rem 0',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            // At the top: blends into the hero (#efe9e1). On scroll: a slightly
            // darker, translucent frosted bar that floats over the content.
            background: scrolled ? 'rgba(228,221,211,0.82)' : '#efe9e1',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
            boxShadow: scrolled ? '0 2px 16px rgba(80,60,40,0.08)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(58,47,40,0.07)' : '1px solid transparent',
            transition: 'background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
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
