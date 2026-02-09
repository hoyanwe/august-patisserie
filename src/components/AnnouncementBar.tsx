'use client';

import { useState, useEffect } from 'react';
import { usePathname } from '@/navigation';
import { useParams } from 'next/navigation';

interface Announcement {
    id: string;
    text: {
        en: string;
        zh: string;
    };
    active: boolean;
}

export default function AnnouncementBar() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const pathname = usePathname();
    const params = useParams();
    const locale = (params?.locale as 'en' | 'zh') || 'en';

    // Hide on admin routes
    if (pathname?.startsWith('/admin')) return null;

    useEffect(() => {
        fetch('/api/admin/announcements')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Filter active items and ensure they have text for the current locale or en
                    const activeItems = data.filter((item: any) => {
                        const hasText = typeof item.text === 'object'
                            ? (item.text[locale] || item.text.en)
                            : (item.text && item.text.trim().length > 0);
                        return item.active && hasText;
                    }).map((item: any) => ({
                        ...item,
                        text: typeof item.text === 'string' ? { en: item.text, zh: '' } : item.text
                    }));
                    setAnnouncements(activeItems);
                }
            })
            .catch(err => console.error('Failed to load announcements', err));
    }, [locale]);

    useEffect(() => {
        if (announcements.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex(current => (current + 1) % announcements.length);
        }, 5000); // Rotate every 5 seconds

        return () => clearInterval(interval);
    }, [announcements.length]);

    if (announcements.length === 0) return null;

    const currentText = announcements[currentIndex].text[locale] || announcements[currentIndex].text.en;

    return (
        <div style={{
            background: '#2c1810',
            color: '#f8f4e6',
            textAlign: 'center',
            padding: '0.6rem 1rem',
            fontSize: '0.9rem',
            fontWeight: '500',
            letterSpacing: '0.5px',
            position: 'relative',
            zIndex: 1001, // High z-index to stay above other elements
        }}>
            <div style={{
                transition: 'opacity 0.5s ease-in-out',
                opacity: 1
            }}>
                {currentText}
            </div>

            {/* Simple Dots for multiple items */}
            {announcements.length > 1 && (
                <div style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    gap: '4px'
                }}>
                    {announcements.map((_, idx) => (
                        <div
                            key={idx}
                            style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: idx === currentIndex ? 'white' : 'rgba(255,255,255,0.3)',
                                transition: 'background 0.3s'
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
