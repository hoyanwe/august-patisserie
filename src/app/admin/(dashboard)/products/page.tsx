'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
    id: string;
    name: {
        en: string;
        zh: string;
    };
    price: number;
    category: string;
    image: string;
    description: {
        en: string;
        zh: string;
    };
}

interface Category {
    id: string;
    name: {
        en: string;
        zh: string;
    };
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                fetch('/api/admin/products'),
                fetch('/api/admin/categories')
            ]);
            const productsData = await productsRes.json() as { products: Product[] };
            const categoriesData = await categoriesRes.json() as { categories: Category[] };
            setProducts(productsData.products || []);
            setCategories(categoriesData.categories || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            alert('Failed to delete product');
        }
    };

    const getCategoryName = (categoryId: string) => {
        const cat = categories.find(c => c.id === categoryId);
        if (!cat) return categoryId;
        return typeof cat.name === 'string' ? cat.name : cat.name.en;
    };

    if (loading) {
        return <div style={{ padding: '2rem' }}>Loading...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '2rem',
                    margin: 0,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-playfair)',
                }}>
                    Products
                </h1>
                <a href="/admin/products/new" style={{
                    padding: '0.75rem 1.5rem',
                    background: 'var(--pastel-purple)',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '500',
                }}>
                    ➕ Add Product
                </a>
            </div>

            {products.length === 0 ? (
                <div style={{
                    background: 'white',
                    padding: '3rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                }}>
                    No products yet. Click "Add Product" to create your first product.
                </div>
            ) : (
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Image</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Name</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Category</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Price</th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                                    <td style={{ padding: '1rem' }}>
                                        {product.image && (
                                            <img
                                                src={product.image}
                                                alt={typeof product.name === 'string' ? product.name : product.name.en}
                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: '500' }}>
                                        {typeof product.name === 'string' ? product.name : product.name.en}
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                                        {getCategoryName(product.category)}
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--pastel-purple)' }}>
                                        RM {product.price.toFixed(2)}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <a
                                            href={`/admin/products/${product.id}`}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: 'var(--pastel-blue)',
                                                color: 'var(--text-primary)',
                                                textDecoration: 'none',
                                                borderRadius: '6px',
                                                marginRight: '0.5rem',
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            Edit
                                        </a>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: 'var(--pastel-red)',
                                                color: 'var(--text-primary)',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
