'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { ChangeEvent, useTransition } from 'react';

export default function LanguageSwitcher() {
    const t = useTranslations('Navigation'); // Potentially use general strings
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const onToggle = () => {
        const nextLocale = locale === 'en' ? 'zh' : 'en';
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <button
            onClick={onToggle}
            disabled={isPending}
            className="lang-switcher-btn"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: '1px solid rgba(0,0,0,0.1)',
                backgroundColor: 'white',
                color: '#333',
                cursor: 'pointer',
                fontFamily: 'var(--font-lato)',
                fontWeight: '600',
                fontSize: '0.9rem',
                transition: 'all 0.2s',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <span style={{ opacity: locale === 'en' ? 1 : 0.5, fontWeight: locale === 'en' ? 'bold' : 'normal' }}>EN</span>
            <span style={{ color: '#ddd' }}>|</span>
            <span style={{ opacity: locale === 'zh' ? 1 : 0.5, fontWeight: locale === 'zh' ? 'bold' : 'normal' }}>中</span>
        </button>
    );
}
