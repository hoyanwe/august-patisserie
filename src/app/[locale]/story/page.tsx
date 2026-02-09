import { getTranslations } from 'next-intl/server';
import { query } from '@/lib/db';


interface StoryData {
    en: {
        title: string;
        content: string;
    };
    zh: {
        title: string;
        content: string;
    };
}

export default async function StoryPage({ params }: { params: Promise<{ locale: string }> }) {
    const t = await getTranslations('Index');
    const { locale } = await params;
    const currentLocale = (locale === 'zh' ? 'zh' : 'en') as 'en' | 'zh';

    // Read story content from D1
    let storyData = { title: '', content: '' };
    try {
        const results = await query<{ value: string }>('SELECT value FROM site_settings WHERE key = ?', ['story']);
        if (results.length > 0) {
            const allStoryData = JSON.parse(results[0].value) as StoryData;
            // Get story for current locale, fallback to English
            storyData = allStoryData[currentLocale] || allStoryData['en'];
        }
    } catch (error) {
        console.error('Error fetching story data from D1:', error);
    }

    return (
        <div className="story-page" style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6rem 2rem',
            overflow: 'hidden'
        }}>
            {/* Full Background Image */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'url(/images/story-bg.png)',
                backgroundRepeat: 'repeat',
                backgroundSize: '50%',
                filter: 'blur(8px) brightness(1.1) opacity(0.4)',
                transform: 'scale(1.1)', // Prevent blur edge artifacts
                zIndex: -1,
            }} />

            {/* Content Card with Glassmorphism */}
            <div className="story-content-wrapper" style={{
                maxWidth: '900px',
                width: '100%',
            }}>
                <h1 className="story-title" style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '3.5rem',
                    textAlign: 'center',
                    marginBottom: '3rem',
                    color: '#2c1810',
                    textShadow: '0 2px 10px rgba(255,255,255,0.8)'
                }}>
                    {storyData.title || "Our Story"}
                </h1>

                <div className="story-content" style={{
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(20px)',
                    padding: '4rem',
                    borderRadius: '24px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    lineHeight: '2',
                    fontSize: '1.1rem',
                    color: '#555',
                    whiteSpace: 'pre-wrap',
                    border: '1px solid rgba(255,255,255,0.5)'
                }}>
                    {storyData.content || "Coming soon..."}
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .story-page {
                        padding: 3rem 1rem !important;
                        min-height: 100vh !important;
                    }
                    .story-title {
                        font-size: 2.5rem !important;
                        margin-bottom: 2rem !important;
                    }
                    .story-content {
                        padding: 2rem 1.5rem !important;
                        font-size: 1rem !important;
                        line-height: 1.8 !important;
                        border-radius: 20px !important;
                    }
                }
            `}</style>
        </div>
    );
}
