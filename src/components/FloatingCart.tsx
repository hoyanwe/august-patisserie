'use client';

import { useCart } from '@/context/CartContext';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

export default function FloatingCart() {
    const { cartCount, cartTotal, items, updateQuantity, removeFromCart } = useCart();
    const locale = useLocale();
    const t = useTranslations('Cart');
    const [isExpanded, setIsExpanded] = useState(false);

    if (cartCount === 0) return null;

    const handleCheckout = () => {
        const link = generateWhatsAppLink(items, cartTotal, locale);
        window.open(link, '_blank');
    };

    return (
        <>
            {/* Expanded Cart View */}
            {isExpanded && (
                <div style={{
                    position: 'fixed',
                    bottom: '7rem', // Above the floating bar
                    right: '2rem',
                    left: '2rem',
                    maxWidth: '400px',
                    margin: '0 auto',
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                }}>
                    <div style={{
                        padding: '1rem',
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#f9f9f9',
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Your Cart</h3>
                        <button
                            onClick={() => setIsExpanded(false)}
                            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}
                        >
                            &times;
                        </button>
                    </div>

                    <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '1rem' }}>
                        {items.map((item) => (
                            <div key={item.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1rem',
                                paddingBottom: '1rem',
                                borderBottom: '1px solid #f0f0f0',
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{item.name}</div>
                                    <div style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                                        RM {item.price.toFixed(2)}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}
                                    >
                                        -
                                    </button>
                                    <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        style={{ marginLeft: '0.5rem', border: 'none', background: 'none', color: '#ff4444', cursor: 'pointer' }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Floating Summary Bar */}
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                left: '2rem',
                maxWidth: '400px',
                margin: '0 auto',
                backgroundColor: 'var(--color-peach)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 1000
            }}>
                <div
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{ color: 'var(--color-text-main)', cursor: 'pointer', flex: 1 }}
                >
                    <p style={{ fontWeight: 'bold' }}>
                        {cartCount} Items {isExpanded ? '▼' : '▲'}
                    </p>
                    <p>RM {cartTotal.toFixed(2)}</p>
                </div>
                <button
                    onClick={handleCheckout}
                    style={{
                        backgroundColor: '#25D366', // WhatsApp Green
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <span>WhatsApp</span> &rarr;
                </button>
            </div>
        </>
    );
}
