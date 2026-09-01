'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

interface Product {
    id: string;
    name: {
        en: string;
        zh: string;
    };
    price: number;
    image?: string;
    images?: string[]; // Array of images
    description?: {
        en: string;
        zh: string;
    };
}

export default function ProductDetail({ product, locale }: { product: Product; locale: string }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const t = useTranslations('Product');

    // Get localized name and description
    const productName = product.name[locale as 'en' | 'zh'] || product.name.en;
    const productDescription = product.description?.[locale as 'en' | 'zh'] || product.description?.en || '';

    // Determine image list. Fallback to single image if array is empty/missing.
    const imageList = (product.images && product.images.length > 0)
        ? product.images
        : (product.image ? [product.image] : []);

    const [selectedImage, setSelectedImage] = useState(imageList[0] || null);

    const handleAdd = () => {
        // Add item multiple times based on quantity
        for (let i = 0; i < quantity; i++) {
            addToCart({
                id: product.id,
                name: productName,
                price: product.price,
            });
        }

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="product-detail-container" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
            <Link href="/menu" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#666' }}>
                {t('backToMenu')}
            </Link>

            <div className="product-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
                {/* Image Section */}
                <div>
                    <div style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        aspectRatio: '1/1',
                        background: '#f8f9fa',
                        marginBottom: '1rem'
                    }}>
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt={productName}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
                                No Image
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {imageList.length > 1 && (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {imageList.map((img, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    style={{
                                        width: '70px',
                                        height: '70px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        border: selectedImage === img ? '2px solid var(--color-pink)' : '2px solid transparent',
                                        opacity: selectedImage === img ? 1 : 0.7,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <img
                                        src={img}
                                        alt={`Thumbnail ${idx + 1}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div>
                    <h1 className="product-title" style={{
                        fontFamily: 'var(--font-playfair)',
                        fontSize: '2.5rem',
                        marginBottom: '1rem',
                        color: 'var(--color-text-main)'
                    }}>
                        {productName}
                    </h1>

                    <p style={{
                        fontSize: '1.5rem',
                        color: 'var(--color-pink)',
                        fontWeight: 'bold',
                        marginBottom: '1.5rem'
                    }}>
                        RM {product.price.toFixed(2)}
                    </p>

                    <div className="pd-desc">
                        {productDescription
                            ? productDescription.split('\n').map((raw, i) => {
                                const line = raw.trim();
                                if (!line) return <div key={i} className="pd-gap" />;
                                const bar = line.indexOf('｜');
                                const head = bar > 0 ? line.slice(0, bar).trim() : '';
                                // ALL-CAPS name before ｜ (KOHAKU, KANTON TSUKI) → section heading;
                                // Title-case (Kohaku) → compact flavour card.
                                const isCapsHead = bar > 0 && /^[A-Z][A-Z ]*$/.test(head);
                                const isHead = isCapsHead || line.includes('SHELF LIFE') || line.includes('賞味期') || line.includes('赏味期');
                                const isFlavor = !isHead && bar > 0 && !head.includes(':') && line.length < 120;
                                if (isHead) return <h4 key={i} className="pd-head">{line.replace('｜', ' · ')}</h4>;
                                if (isFlavor) {
                                    const notes = line.slice(bar + 1).trim();
                                    return (
                                        <div key={i} className="pd-flavor">
                                            <span className="pd-flavor-name">{head}</span>
                                            <span className="pd-flavor-notes">{notes}</span>
                                        </div>
                                    );
                                }
                                return <p key={i} className="pd-line">{line}</p>;
                            })
                            : <p className="pd-line">{t('freshnessDisclaimer')}</p>}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <span style={{ fontWeight: '500' }}>{t('quantity')}</span>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px' }}>
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                style={{ padding: '0.5rem 1rem', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}
                            >-</button>
                            <span style={{ padding: '0 1rem', fontWeight: 'bold' }}>{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => q + 1)}
                                style={{ padding: '0.5rem 1rem', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}
                            >+</button>
                        </div>
                    </div>

                    <button
                        onClick={handleAdd}
                        style={{
                            padding: '1rem 3rem',
                            background: added ? '#4CAF50' : 'var(--color-btn-primary-bg)',
                            color: 'var(--color-btn-primary-text)',
                            border: 'none',
                            borderRadius: '50px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background 0.3s',
                            width: '100%',
                            maxWidth: '300px'
                        }}
                    >
                        {added ? t('addedToOrder') : t('addToOrder')}
                    </button>

                    <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#888' }}>
                        {t('freshnessDisclaimer')}
                    </div>

                </div>
            </div>

            {/* Responsiveness Helper */}
            <style jsx>{`
                .pd-desc { margin-bottom: 2rem; }
                .pd-gap { height: 0.5rem; }
                .pd-line { color: #555; line-height: 1.8; font-size: 1.05rem; margin: 0 0 0.4rem; }
                .pd-head {
                    font-family: var(--font-playfair), serif;
                    font-size: 0.9rem; letter-spacing: 0.06em; text-transform: uppercase;
                    color: var(--color-text-main); margin: 1.75rem 0 0.75rem;
                    padding-bottom: 0.4rem; border-bottom: 1px solid #f0e0e5;
                }
                .pd-flavor {
                    display: flex; flex-direction: column; gap: 0.15rem;
                    padding: 0.6rem 0.9rem; margin-bottom: 0.5rem;
                    border-left: 3px solid var(--color-pink);
                    background: #fdf6f8; border-radius: 0 8px 8px 0;
                }
                .pd-flavor-name { font-weight: 700; color: var(--color-text-main); font-size: 1.02rem; }
                .pd-flavor-notes { color: #777; font-size: 0.92rem; }

                @media (max-width: 768px) {
                    .product-detail-container {
                        padding: 1.5rem !important;
                    }
                    .product-detail-grid {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                    }
                    .product-title {
                        font-size: 2rem !important;
                    }
                }
             `}</style>
        </div>
    );
}
