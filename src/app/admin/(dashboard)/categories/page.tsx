'use client';

import { useState, useEffect } from 'react';

interface Category {
    id: string;
    name: {
        en: string;
        zh: string;
    };
    slug: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState({
        name: { en: '', zh: '' },
        slug: ''
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'en' | 'zh'>('en');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json() as { categories: Category[] };
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategory),
            });
            setNewCategory({ name: { en: '', zh: '' }, slug: '' });
            fetchCategories();
        } catch (error) {
            alert('Failed to add category');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this category?')) return;
        try {
            await fetch('/api/admin/categories', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            fetchCategories();
        } catch (error) {
            alert('Failed to delete category');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 style={{
                fontSize: '2rem',
                marginBottom: '2rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-playfair)',
            }}>
                Categories
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px' }}>
                    <h2 style={{ marginTop: 0 }}>Add New Category</h2>

                    {/* Language Tabs */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee' }}>
                        <button
                            onClick={() => setActiveTab('en')}
                            style={{
                                padding: '0.5rem 1rem',
                                border: 'none',
                                background: 'transparent',
                                borderBottom: activeTab === 'en' ? '2px solid var(--color-pink)' : 'none',
                                color: activeTab === 'en' ? 'var(--color-pink)' : '#666',
                                fontWeight: activeTab === 'en' ? '600' : '400',
                                cursor: 'pointer'
                            }}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setActiveTab('zh')}
                            style={{
                                padding: '0.5rem 1rem',
                                border: 'none',
                                background: 'transparent',
                                borderBottom: activeTab === 'zh' ? '2px solid var(--color-pink)' : 'none',
                                color: activeTab === 'zh' ? 'var(--color-pink)' : '#666',
                                fontWeight: activeTab === 'zh' ? '600' : '400',
                                cursor: 'pointer'
                            }}
                        >
                            中文
                        </button>
                    </div>

                    <form onSubmit={handleAdd}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                Category Name ({activeTab === 'en' ? 'English' : 'Chinese'})
                            </label>
                            <input
                                type="text"
                                required
                                value={activeTab === 'en' ? newCategory.name.en : newCategory.name.zh}
                                onChange={(e) => setNewCategory({
                                    ...newCategory,
                                    name: {
                                        ...newCategory.name,
                                        [activeTab]: e.target.value
                                    }
                                })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                Slug (URL-friendly)
                            </label>
                            <input
                                type="text"
                                required
                                value={newCategory.slug}
                                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'var(--color-pink)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                            }}
                        >
                            Add Category
                        </button>
                    </form>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px' }}>
                    <h2 style={{ marginTop: 0 }}>Existing Categories</h2>
                    {categories.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No categories yet</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1rem',
                                        background: '#f8f9fa',
                                        borderRadius: '8px',
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: '600' }}>
                                            {typeof cat.name === 'string' ? cat.name : (cat.name.en || cat.name.zh)}
                                            <span style={{ color: '#aaa', fontWeight: '400', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                                                {typeof cat.name !== 'string' && cat.name.zh && `(${cat.name.zh})`}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            {cat.slug}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: 'var(--pastel-red)',
                                            color: 'var(--text-primary)',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
