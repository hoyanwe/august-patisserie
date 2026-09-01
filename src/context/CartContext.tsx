'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function isValidItem(x: unknown): x is CartItem {
    if (!x || typeof x !== 'object') return false;
    const i = x as Record<string, unknown>;
    return typeof i.id === 'string'
        && typeof i.name === 'string'
        && typeof i.price === 'number' && Number.isFinite(i.price) && i.price >= 0
        && typeof i.quantity === 'number' && Number.isInteger(i.quantity) && i.quantity > 0;
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loaded, setLoaded] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('august-cart');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    // Hydration-safe one-time load from localStorage (unavailable
                    // during SSR), so a mount-time setState here is intentional.
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setItems(parsed.filter(isValidItem));
                }
            }
        } catch (e) {
            console.error('Failed to parse cart', e);
        }
        setLoaded(true);
    }, []);

    // Save to local storage on change — but only after the initial load, so the
    // empty initial state cannot overwrite a persisted cart on first mount.
    useEffect(() => {
        if (!loaded) return;
        localStorage.setItem('august-cart', JSON.stringify(items));
    }, [items, loaded]);

    const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === newItem.id);
            if (existing) {
                return prev.map(i =>
                    i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...newItem, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setItems(prev => prev.map(i => {
            if (i.id === id) {
                const newQty = Math.max(0, i.quantity + delta);
                return { ...i, quantity: newQty };
            }
            return i;
        }).filter(i => i.quantity > 0));
    };

    const clearCart = () => setItems([]);

    const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
