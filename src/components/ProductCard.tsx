'use client';

import { useCart } from '@/context/CartContext';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

interface Product {
    id: string;
    name: {
        en: string;
        zh: string;
    };
    price: number;
    image?: string;
    description?: {
        en: string;
        zh: string;
    };
}

export default function ProductCard({ product, locale }: { product: Product; locale: string }) {
    const { addToCart } = useCart();
    const t = useTranslations('Menu');

    // Get localized name and description
    const productName = product.name[locale as 'en' | 'zh'] || product.name.en;
    const productDescription = product.description?.[locale as 'en' | 'zh'] || product.description?.en || '';

    const handleAdd = () => {
        addToCart({
            id: product.id,
            name: productName,
            price: product.price,
        });
    };

    return (
        <div style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Clickable Image Area */}
            <Link href={`/menu/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                    backgroundColor: '#eee',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                }}>
                    {/* Placeholder or Image */}
                    {product.image ? (
                        <img src={product.image} alt={productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ color: '#aaa' }}>No Image</span>
                    )}
                </div>
            </Link>

            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Link href={`/menu/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', cursor: 'pointer' }}>{productName}</h3>
                </Link>
                <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem', flex: 1 }}>
                    {productDescription}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>RM {product.price.toFixed(2)}</span>
                    <button
                        onClick={handleAdd}
                        className="btn btn-primary"
                        style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
