import { query } from '@/lib/db';
import Reveal from '@/components/Reveal';

export const dynamic = 'force-dynamic';

interface ContactData {
    en: { title: string; intro: string; whatsappTitle: string; instagramTitle: string };
    zh: { title: string; intro: string; whatsappTitle: string; instagramTitle: string };
}

interface Props {
    params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: Props) {
    const { locale } = await params;
    const currentLocale = (locale === 'zh' ? 'zh' : 'en') as 'en' | 'zh';

    let contactData: ContactData | null = null;
    try {
        const results = await query<{ value: string }>('SELECT value FROM site_settings WHERE key = ?', ['contact']);
        if (results.length > 0) {
            contactData = JSON.parse(results[0].value);
        }
    } catch (error) {
        console.error('Error fetching contact data from D1:', error);
    }

    const kicker = currentLocale === 'zh' ? '手工烘焙甜點' : 'Handcrafted Pâtisserie';
    const title = contactData?.[currentLocale]?.title || (currentLocale === 'zh' ? '联系我们' : 'Get in Touch');
    const intro = contactData?.[currentLocale]?.intro || (currentLocale === 'zh'
        ? '我们很乐意满足您对甜品的渴望。\n欢迎联系我们定制订单、咨询或打个招呼。'
        : 'We\'d love to satisfy your sweet cravings.\nReach out for custom orders, inquiries, or just to say hello.');
    const whatsappTitle = contactData?.[currentLocale]?.whatsappTitle || (currentLocale === 'zh' ? 'WhatsApp 与订单' : 'WhatsApp & Orders');
    const instagramTitle = contactData?.[currentLocale]?.instagramTitle || (currentLocale === 'zh' ? '关注我们的旅程' : 'Follow Our Journey');

    return (
        <div className="ed-page contact2">
            <Reveal className="contact2-inner" step={100} y={20}>
                <span className="ed-eyebrow">{kicker}</span>
                <h1 className="ed-title contact2-title">{title}</h1>
                <div className="ed-divider" />
                <p className="ed-lede contact2-intro">{intro}</p>

                <div className="contact2-cards">
                    <a className="contact2-card card-hover" href="https://wa.me/60168777483" target="_blank" rel="noopener noreferrer">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#25D366' }} aria-hidden="true">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        <span className="contact2-card-title">{whatsappTitle}</span>
                        <span className="contact2-card-value">+60 16-877 7483</span>
                    </a>

                    <a className="contact2-card card-hover" href="https://www.instagram.com/august_patisserie" target="_blank" rel="noopener noreferrer">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#E1306C' }} aria-hidden="true">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        <span className="contact2-card-title">{instagramTitle}</span>
                        <span className="contact2-card-value">@august_patisserie</span>
                    </a>
                </div>
            </Reveal>

            <style>{`
                .contact2 { display: flex; justify-content: center; padding: 5rem 1.5rem 6rem; }
                .contact2-inner { max-width: 720px; width: 100%; display: flex; flex-direction: column; align-items: center; text-align: center; }
                .contact2 .ed-eyebrow { order: -1; }
                .contact2-title { font-size: clamp(2.3rem, 5.4vw, 3.5rem); margin: 1.1rem 0 0; }
                .contact2-intro { white-space: pre-line; line-height: 1.9; max-width: 46ch; margin: 0.4rem 0 0; }
                .contact2-cards {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;
                    width: 100%; margin-top: 2.75rem;
                }
                .contact2-card {
                    display: flex; flex-direction: column; align-items: center; gap: 0.55rem;
                    padding: 2rem 1.5rem;
                    background: var(--color-white);
                    border: 1px solid var(--warm-line);
                    border-radius: 16px;
                    text-decoration: none;
                }
                .contact2-card-title { font-family: var(--font-playfair), serif; font-size: 1.15rem; color: var(--warm-ink); }
                .contact2-card-value { color: var(--warm-accent); font-weight: 600; letter-spacing: 0.02em; }
                @media (max-width: 640px) {
                    .contact2 { padding: 3rem 1.2rem 4rem; }
                    .contact2-cards { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
