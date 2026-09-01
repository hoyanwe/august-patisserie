import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import InstagramGallery from '@/components/InstagramGallery';
import IngredientSpotlight from '@/components/IngredientSpotlight';
import BestSellers from '@/components/BestSellers';
import ReviewSection from '@/components/ReviewSection';
import { query } from '@/lib/db';
import { getBestSellers } from '@/lib/products';

// Always reflect live D1 data (never a stale build-time snapshot).
export const dynamic = 'force-dynamic';


// Define interface for Home Data
interface HomeData {
  hero: {
    en: {
      title: string;
      subtitle: string;
      buttonText: string;
    };
    zh: {
      title: string;
      subtitle: string;
      buttonText: string;
    };
  };
  heroImage: string;
}

// Define interface for Story Data
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

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const currentLocale = (locale === 'zh' ? 'zh' : 'en') as 'en' | 'zh';

  // Read home content from D1
  let homeData: HomeData | null = null;
  try {
    const results = await query<{ data: string }>('SELECT data FROM home_content WHERE id = ?', ['main']);
    if (results.length > 0) {
      homeData = JSON.parse(results[0].data);
    }
  } catch (error) {
    console.error('Error fetching home data from D1:', error);
  }

  // Read story content from D1
  let storyData: StoryData | null = null;
  try {
    const results = await query<{ value: string }>('SELECT value FROM site_settings WHERE key = ?', ['story']);
    if (results.length > 0) {
      storyData = JSON.parse(results[0].value);
    }
  } catch (error) {
    console.error('Error fetching story data from D1:', error);
  }

  // Fallback values
  const heroTitle = homeData?.hero?.[currentLocale]?.title || (currentLocale === 'zh' ? '手工糕点' : 'Artisan Pastries');
  const heroSubtitle = homeData?.hero?.[currentLocale]?.subtitle || (currentLocale === 'zh' ? '用心制作' : 'Crafted with Love');
  const heroButton = homeData?.hero?.[currentLocale]?.buttonText || (currentLocale === 'zh' ? '浏览菜单' : 'Browse Menu');
  const heroImage = homeData?.heroImage || '/images/hero-santorini-v5.png';

  const storyTitle = storyData?.[currentLocale]?.title || (currentLocale === 'zh' ? '我们的故事' : 'Our Story');
  const storyContent = storyData?.[currentLocale]?.content || "Coming soon...";

  // Fetch best sellers (products) from D1 via the shared query/mapper.
  let bestSellers: Awaited<ReturnType<typeof getBestSellers>> = [];
  try {
    bestSellers = await getBestSellers();
  } catch (error) {
    console.error('Failed to fetch best sellers from D1:', error);
  }

  const homeT = await getTranslations('Index'); // Fetched Index translations

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* Hero Section — editorial */}
      <section className="hl-hero">
        <span className="hl-vside hl-vside-l">AUGUST PATISSERIE · PÂTISSERIE</span>
        <span className="hl-vside hl-vside-r">HANDCRAFTED · BAKED FRESH DAILY</span>

        <div className="hl-hero-inner">
          <div className="hl-arch-wrap">
            <div className="hl-arch">
              <img src={heroImage} alt={heroTitle} />
              <span className="hl-arch-cap">/ {heroTitle} /</span>
            </div>
            <div className="hl-badge" aria-hidden="true">
              <svg viewBox="0 0 200 200" className="hl-badge-svg">
                <defs>
                  <path id="hlBadgePath" d="M100,100 m-70,0 a70,70 0 1,1 140,0 a70,70 0 1,1 -140,0" />
                </defs>
                <text className="hl-badge-text">
                  <textPath href="#hlBadgePath" startOffset="0">AUGUST PATISSERIE · PÂTISSERIE · AUGUST PATISSERIE · PÂTISSERIE · </textPath>
                </text>
              </svg>
              <span className="hl-badge-dot" />
            </div>
          </div>

          <h1 className="hl-headline">{heroSubtitle}</h1>

          <p className="hl-brand">August Patisserie&#8194;｜&#8194;{currentLocale === 'zh' ? '蛋糕 · 甜點 · 禮盒搭配' : 'Cakes · Pastries · Gift Boxes'}</p>
          <p className="hl-info">{currentLocale === 'zh' ? '手工烘焙 · 每日新鮮 · WhatsApp 訂購' : 'Handcrafted · Baked Fresh Daily · Order via WhatsApp'}</p>

          <Link href="/menu" className="hl-cta">{heroButton}</Link>
        </div>

        <style>{`
          .hl-hero {
            position: relative;
            background: #efe9e1;
            padding: 4.5rem 1.5rem 5rem;
            overflow: hidden;
            display: flex;
            justify-content: center;
          }
          .hl-hero-inner {
            width: 100%;
            max-width: 640px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .hl-vside {
            position: absolute;
            top: 46%;
            font-size: 0.62rem;
            letter-spacing: 0.34em;
            text-transform: uppercase;
            color: #b3a99b;
            white-space: nowrap;
            writing-mode: vertical-rl;
          }
          .hl-vside-l { left: 1.5rem; transform: translateY(-50%) rotate(180deg); }
          .hl-vside-r { right: 1.5rem; transform: translateY(-50%); }

          .hl-arch-wrap { position: relative; width: min(80%, 430px); }
          .hl-arch {
            position: relative;
            aspect-ratio: 3 / 4;
            border-radius: 50% 50% 14px 14px / 46% 46% 14px 14px;
            overflow: hidden;
            box-shadow: 0 34px 60px -30px rgba(80,60,40,0.4);
          }
          .hl-arch img { width: 100%; height: 100%; object-fit: cover; display: block; }
          .hl-arch-cap {
            position: absolute;
            left: 50%; bottom: 30%;
            transform: translateX(-50%);
            color: rgba(255,255,255,0.94);
            font-family: var(--font-playfair), serif;
            font-style: italic;
            font-size: 1.05rem;
            letter-spacing: 0.01em;
            text-shadow: 0 2px 14px rgba(0,0,0,0.45);
            white-space: nowrap;
          }
          .hl-badge {
            position: absolute;
            top: -5%; right: -11%;
            width: 118px; height: 118px;
            border-radius: 50%;
            background: #f5f1ea;
            box-shadow: 0 10px 26px -10px rgba(80,60,40,0.35);
            display: flex; align-items: center; justify-content: center;
          }
          .hl-badge-svg { width: 100%; height: 100%; animation: hlspin 20s linear infinite; }
          .hl-badge-text {
            font-size: 11px; letter-spacing: 1.4px; fill: #7d7060;
            text-transform: uppercase; font-family: var(--font-lato), sans-serif;
          }
          .hl-badge-dot {
            position: absolute; width: 7px; height: 7px; border-radius: 50%; background: #3a3129;
          }

          .hl-headline {
            font-family: var(--font-playfair), serif;
            font-weight: 500;
            font-style: italic;
            color: #8a6a4a;
            font-size: clamp(2.5rem, 6vw, 4.3rem);
            line-height: 1.06;
            letter-spacing: -0.01em;
            margin: -2.2rem 0 0;
            position: relative;
            text-wrap: balance;
          }
          .hl-brand { margin: 1.9rem 0 0.35rem; color: #4a4038; font-size: 1rem; letter-spacing: 0.01em; }
          .hl-info { margin: 0; color: #a99e90; font-size: 0.82rem; letter-spacing: 0.03em; }
          .hl-cta {
            margin-top: 2rem;
            display: inline-block;
            padding: 0.9rem 2.4rem;
            border: 1px solid #3a3129;
            border-radius: 4px;
            color: #3a3129;
            text-decoration: none;
            font-size: 0.78rem;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            transition: background .25s ease, color .25s ease;
          }
          .hl-cta:hover { background: #3a3129; color: #efe9e1; }

          @keyframes hlspin { to { transform: rotate(360deg); } }
          @media (prefers-reduced-motion: reduce) { .hl-badge-svg { animation: none; } }

          @media (max-width: 768px) {
            .hl-hero { padding: 3rem 1rem 3.5rem; }
            .hl-vside { display: none; }
            .hl-arch-wrap { width: 86%; }
            .hl-badge { width: 88px; height: 88px; right: -4%; top: -4%; }
            .hl-badge-text { font-size: 10px; letter-spacing: 1px; }
            .hl-headline { margin-top: -1.6rem; }
            .hl-arch-cap { font-size: 0.95rem; }
          }
        `}</style>
      </section>

      <div className="container">
        {/* Story Section */}
        <section style={{ padding: '4rem 0', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            color: 'var(--color-text-main)',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-playfair)',
            fontSize: '2.5rem'
          }}>
            {storyTitle}
          </h2>
          <div style={{
            color: 'var(--color-text-light)',
            fontSize: '1.1rem',
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap'
          }}>
            {storyContent}
          </div>
        </section>

        {/* Best Sellers Section */}
        {bestSellers.length > 0 && (
          <BestSellers
            products={bestSellers}
            locale={locale}
            translations={{
              title: homeT('bestSellersTitle'),
              subtitle: homeT('bestSellersSubtitle'),
              viewMenu: homeT('viewMenu')
            }}
          />
        )}

        {/* Ingredients Spotlight */}
        <IngredientSpotlight locale={locale} />

        {/* Customer Reviews */}
        <ReviewSection />

        {/* Instagram Feed */}
        <InstagramGallery />
      </div>
    </div>
  );
}
