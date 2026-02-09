'use client';

import { useState } from 'react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
    const t = useTranslations('Navigation');
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'none', // Hidden on desktop by default via CSS media query below
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    flexDirection: 'column',
                    gap: '5px',
                    zIndex: 102
                }}
                className="mobile-menu-btn"
                aria-label="Toggle Menu"
            >
                <div style={{ width: '25px', height: '3px', background: 'var(--color-text-main)', transition: 'all 0.3s', transform: isOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none' }}></div>
                <div style={{ width: '25px', height: '3px', background: 'var(--color-text-main)', opacity: isOpen ? 0 : 1, transition: 'all 0.3s' }}></div>
                <div style={{ width: '25px', height: '3px', background: 'var(--color-text-main)', transition: 'all 0.3s', transform: isOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none' }}></div>
            </button>

            {/* Desktop Nav */}
            <nav className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link href="/menu" className="nav-link">{t('menu')}</Link>
                <Link href="/story" className="nav-link">{t('story')}</Link>
                <Link href="/contact" className="nav-link">{t('contact')}</Link>
                <LanguageSwitcher />
            </nav>

            {/* Mobile Nav Overlay */}
            <div className={`mobile-nav ${isOpen ? 'open' : ''}`} style={{
                position: 'fixed',
                top: '0',
                right: isOpen ? '0' : '-100%',
                width: '70%',
                height: '100vh',
                background: 'var(--color-cream)',
                boxShadow: '-5px 0 15px rgba(0,0,0,0.1)',
                padding: '5rem 2rem',
                flexDirection: 'column',
                gap: '2rem',
                transition: 'right 0.3s ease',
                zIndex: 101,
                display: 'flex'
            }}>
                <Link href="/menu" onClick={() => setIsOpen(false)} style={{ fontSize: '1.2rem', fontWeight: 600 }}>{t('menu')}</Link>
                <Link href="/story" onClick={() => setIsOpen(false)} style={{ fontSize: '1.2rem', fontWeight: 600 }}>{t('story')}</Link>
                <Link href="/contact" onClick={() => setIsOpen(false)} style={{ fontSize: '1.2rem', fontWeight: 600 }}>{t('contact')}</Link>
                <div style={{ marginTop: '1rem' }}>
                    <LanguageSwitcher />
                </div>
            </div>

            {/* Backdrop */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.3)',
                        zIndex: 100
                    }}
                />
            )}

            <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
        </>
    );
}
