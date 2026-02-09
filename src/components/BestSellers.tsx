'use client';

import ProductCard from './ProductCard';

interface Product {
    id: string;
    name: {
        en: string;
        zh: string;
    };
    price: number;
    category: string;
    description: {
        en: string;
        zh: string;
    };
    image: string;
    isBestSeller?: boolean;
}

interface Props {
    products: Product[];
    locale: string;
    translations: {
        title: string;
        subtitle: string;
        viewMenu: string;
    };
}

export default function BestSellers({ products, locale, translations }: Props) {
    const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

    if (bestSellers.length === 0) return null;

    return (
        <section style={{
            padding: '5rem 2rem',
            background: '#fffafb', // Very light pink background
            position: 'relative',
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-playfair)',
                        marginBottom: '1rem'
                    }}>
                        {translations.title}
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '1.1rem',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        {translations.subtitle}
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2.5rem',
                    marginBottom: '3rem'
                }}>
                    {bestSellers.map((product) => (
                        <div key={product.id} style={{ position: 'relative' }}>
                            <ProductCard product={product} locale={locale} />
                            <div style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'var(--color-pink)',
                                color: 'white',
                                padding: '0.3rem 0.8rem',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                zIndex: 2,
                                pointerEvents: 'none'
                            }}>
                                ✨ BEST SELLER
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center' }}>
                    <a
                        href="/menu"
                        style={{
                            display: 'inline-block',
                            padding: '1rem 2.5rem',
                            background: 'transparent',
                            border: '2px solid var(--color-pink)',
                            color: 'var(--color-pink)',
                            borderRadius: '50px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'var(--color-pink)';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--color-pink)';
                        }}
                    >
                        {translations.viewMenu}
                    </a>
                </div>
            </div>
        </section>
    );
}
