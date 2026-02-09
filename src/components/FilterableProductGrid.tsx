'use client';

import { useState } from 'react';
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

interface Category {
    id: string;
    name: {
        en: string;
        zh: string;
    };
}

interface Props {
    products: Product[];
    categories: Category[];
    locale: string;
    translations: {
        all: string;
        bestSeller: string;
    };
}

export default function FilterableProductGrid({ products, categories, locale, translations }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category === selectedCategory);

    return (
        <div>
            {/* Category Filters */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '3rem',
                flexWrap: 'wrap',
                padding: '0 1rem'
            }}>
                <button
                    onClick={() => setSelectedCategory('all')}
                    style={{
                        padding: '0.6rem 1.5rem',
                        borderRadius: '30px',
                        border: '2px solid var(--color-pink)',
                        background: selectedCategory === 'all' ? 'var(--color-pink)' : 'transparent',
                        color: selectedCategory === 'all' ? 'white' : 'var(--color-pink)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: selectedCategory === 'all' ? '0 4px 12px rgba(255, 182, 193, 0.3)' : 'none'
                    }}
                >
                    {translations.all}
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        style={{
                            padding: '0.6rem 1.5rem',
                            borderRadius: '30px',
                            border: '2px solid var(--color-pink)',
                            background: selectedCategory === cat.id ? 'var(--color-pink)' : 'transparent',
                            color: selectedCategory === cat.id ? 'white' : 'var(--color-pink)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: selectedCategory === cat.id ? '0 4px 12px rgba(255, 182, 193, 0.3)' : 'none'
                        }}
                    >
                        {cat.name[locale as 'en' | 'zh'] || cat.name.en}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2.5rem',
                }}>
                    {filteredProducts.map((product) => (
                        <div key={product.id} style={{ position: 'relative' }}>
                            <ProductCard product={product} locale={locale} />
                            {product.isBestSeller && (
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
                                    pointerEvents: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.2rem'
                                }}>
                                    ✨ {translations.bestSeller}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem',
                    color: 'var(--text-secondary)',
                    background: '#fdf8f9',
                    borderRadius: '20px',
                    border: '1px dashed #ffd1dc'
                }}>
                    <p style={{ fontSize: '1.2rem' }}>No products found in this category.</p>
                </div>
            )}
        </div>
    );
}
