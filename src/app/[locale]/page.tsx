import { getTranslations } from 'next-intl/server';
import InstagramGallery from '@/components/InstagramGallery';
import IngredientSpotlight from '@/components/IngredientSpotlight';
import BestSellers from '@/components/BestSellers';
import ReviewSection from '@/components/ReviewSection';
import { query } from '@/lib/db';


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

interface ProductDB {
  id: string;
  name_en: string;
  name_zh: string;
  price: number;
  category_id: string;
  description_en: string;
  description_zh: string;
  is_best_seller: number;
  main_image: string;
  images_list?: string;
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

  // Fetch best sellers (products) from D1
  let bestSellers: any[] = [];
  try {
    const results = await query<ProductDB>(`
        SELECT p.*, GROUP_CONCAT(pi.url) as images_list
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.is_best_seller = 1
        GROUP BY p.id
    `);

    bestSellers = results.map(row => ({
      id: row.id,
      name: { en: row.name_en, zh: row.name_zh },
      price: row.price,
      category: row.category_id,
      description: { en: row.description_en, zh: row.description_zh },
      isBestSeller: true,
      image: row.main_image,
      images: row.images_list ? row.images_list.split(',') : []
    }));
  } catch (error) {
    console.error('Failed to fetch best sellers from D1:', error);
  }

  const homeT = await getTranslations('Index'); // Fetched Index translations

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* Hero Section - Full Width */}
      <section className="hero-section" style={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        padding: '2rem 1rem',
        width: '100%'
      }}>
        {/* Background Image with Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
        }}></div>

        {/* Content Box - Glassmorphism */}
        <div className="hero-content" style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          width: '100%',
          maxWidth: '800px',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
        }}>
          <h1 className="hero-title" style={{
            color: '#4a4a4a',
            fontFamily: 'var(--font-playfair)',
            letterSpacing: '-1px',
            lineHeight: '1.1'
          }}>
            {heroTitle}
          </h1>
          <p className="hero-subtitle" style={{
            color: '#666',
            fontFamily: 'var(--font-body)',
            fontWeight: '400'
          }}>
            {heroSubtitle}
          </p>
          <div>
            <a href="/menu" className="btn hero-btn" style={{
              background: '#006699',
              color: 'white',
              borderRadius: '50px',
              boxShadow: '0 4px 15px rgba(0, 102, 153, 0.2)',
              transition: 'all 0.2s',
              display: 'inline-block',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              fontWeight: '600'
            }}>
              {heroButton}
            </a>
          </div>
        </div>

        <style>{`
          .hero-content {
            padding: 4rem 3rem;
            border-radius: 250px 250px 20px 20px;
          }
          .hero-title {
            font-size: 4.5rem;
            margin-bottom: 1rem;
          }
          .hero-subtitle {
            font-size: 1.4rem;
            margin-bottom: 2.5rem;
          }
          .hero-btn {
             padding: 1rem 3.5rem;
             font-size: 0.9rem;
          }

          @media (max-width: 768px) {
            .hero-section {
               min-height: 60vh !important;
               padding: 1rem !important;
            }
            .hero-content {
               padding: 2.5rem 1.5rem !important;
               border-radius: 120px 120px 16px 16px !important;
            }
            .hero-title {
               font-size: 2.5rem !important;
            }
            .hero-subtitle {
               font-size: 1.1rem !important;
               margin-bottom: 1.5rem !important;
            }
            .hero-btn {
               padding: 0.875rem 2rem !important;
               width: 100%;
               max-width: 250px;
            }
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
