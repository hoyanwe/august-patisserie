'use client';

import { useEffect, useState } from 'react';

interface Ingredient {
    id: string;
    name: {
        en: string;
        zh: string;
    };
    description: {
        en: string;
        zh: string;
    };
    image: string;
}

interface Props {
    locale?: string;
}

export default function IngredientSpotlight({ locale = 'en' }: Props) {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

    useEffect(() => {
        fetch('/api/admin/ingredients')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Filter out empty ones if any
                    setIngredients(data.filter((i: Ingredient) =>
                        (i.name.en || i.name.zh) &&
                        (i.description.en || i.description.zh)
                    ));
                }
            })
            .catch(err => console.error(err));
    }, []);

    if (ingredients.length === 0) return null;

    const currentLocale = locale as 'en' | 'zh';

    return (
        <section style={{ padding: '4rem 1rem', background: '#fafafa' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '3rem',
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '2.5rem',
                    color: '#2c1810'
                }}>
                    {currentLocale === 'zh' ? '我们的优质原料' : 'Our Premium Ingredients'}
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {ingredients.map((item) => (
                        <div key={item.id} style={{
                            background: 'white',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            transition: 'transform 0.3s',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ height: '220px', overflow: 'hidden' }}>
                                <img
                                    src={item.image}
                                    alt={item.name[currentLocale] || item.name.en}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{
                                    fontFamily: 'var(--font-playfair)',
                                    fontSize: '1.25rem',
                                    marginBottom: '0.5rem',
                                    color: '#2c1810'
                                }}>
                                    {item.name[currentLocale] || item.name.en}
                                </h3>
                                <p style={{
                                    color: '#666',
                                    lineHeight: '1.6',
                                    fontSize: '0.95rem'
                                }}>
                                    {item.description[currentLocale] || item.description.en}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
