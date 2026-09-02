import { query } from '@/lib/db';
import Reveal from '@/components/Reveal';

export const dynamic = 'force-dynamic';


interface StoryData {
    en: { title: string; content: string };
    zh: { title: string; content: string };
}

export default async function StoryPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const currentLocale = (locale === 'zh' ? 'zh' : 'en') as 'en' | 'zh';

    let storyData = { title: '', content: '' };
    try {
        const results = await query<{ value: string }>('SELECT value FROM site_settings WHERE key = ?', ['story']);
        if (results.length > 0) {
            const allStoryData = JSON.parse(results[0].value) as StoryData;
            storyData = allStoryData[currentLocale] || allStoryData['en'];
        }
    } catch (error) {
        console.error('Error fetching story data from D1:', error);
    }

    const kicker = currentLocale === 'zh' ? '手工烘焙甜點' : 'Handcrafted Pâtisserie';
    const fallbackTitle = currentLocale === 'zh' ? '我们的故事' : 'Our Story';

    return (
        <div className="ed-page story2">
            <Reveal className="story2-inner" step={110} y={22}>
                <span className="ed-eyebrow">{kicker}</span>
                <div className="story2-arch">
                    <img src="/images/hero/pexels-29445730.jpg" alt="" />
                </div>
                <h1 className="ed-title story2-title">{storyData.title || fallbackTitle}</h1>
                <div className="ed-divider" />
                <div className="story2-body">{storyData.content || 'Coming soon...'}</div>
            </Reveal>

            <style>{`
                .story2 { display: flex; justify-content: center; padding: 5rem 1.5rem 6rem; }
                .story2-inner {
                    max-width: 680px; width: 100%;
                    display: flex; flex-direction: column; align-items: center; text-align: center;
                }
                .story2 .ed-eyebrow { order: -1; }
                .story2-arch {
                    width: min(66%, 300px); aspect-ratio: 4 / 5;
                    border-radius: 50% 50% 16px 16px / 34% 34% 16px 16px;
                    overflow: hidden; margin: 1.6rem 0 0.4rem;
                    box-shadow: 0 30px 55px -30px rgba(80,60,40,0.42);
                }
                .story2-arch img { width: 100%; height: 100%; object-fit: cover; display: block; }
                .story2-title { font-size: clamp(2.3rem, 5.4vw, 3.5rem); margin: 1.1rem 0 0; }
                .story2-body {
                    color: var(--warm-ink); opacity: 0.88;
                    font-size: 1.08rem; line-height: 2; white-space: pre-wrap;
                    max-width: 60ch; margin-top: 0.4rem;
                }
                @media (max-width: 768px) {
                    .story2 { padding: 3rem 1.2rem 4rem; }
                    .story2-arch { width: 82%; }
                    .story2-body { font-size: 1rem; line-height: 1.9; }
                }
            `}</style>
        </div>
    );
}
