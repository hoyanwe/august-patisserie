'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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

export default function IngredientsPage() {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'en' | 'zh'>('en');

    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = async () => {
        try {
            const res = await fetch('/api/admin/ingredients');
            const data = await res.json() as any[];

            // Migrate legacy data if necessary and ensure 6 slots
            const migratedData = data.map((item: any) => ({
                ...item,
                name: typeof item.name === 'string' ? { en: item.name, zh: '' } : item.name,
                description: typeof item.description === 'string' ? { en: item.description, zh: '' } : item.description
            }));

            const paddedData = [...migratedData];
            while (paddedData.length < 6) {
                paddedData.push({
                    id: Date.now().toString() + Math.random(),
                    name: { en: '', zh: '' },
                    description: { en: '', zh: '' },
                    image: ''
                });
            }
            setIngredients(paddedData.slice(0, 6)); // Strictly 6
        } catch (error) {
            console.error('Failed to fetch ingredients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (file: File, index: number) => {
        setUploading(index.toString());
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json() as { url: string; error?: string };

            if (data.url) {
                const newIngredients = [...ingredients];
                newIngredients[index].image = data.url;
                setIngredients(newIngredients);
            }
        } catch (error) {
            alert('Upload failed');
        } finally {
            setUploading(null);
        }
    };

    const updateIngredient = (index: number, field: 'name' | 'description', lang: 'en' | 'zh', value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = {
            ...newIngredients[index],
            [field]: { ...newIngredients[index][field], [lang]: value }
        };
        setIngredients(newIngredients);
    };

    const saveChanges = async () => {
        setSaving(true);
        try {
            await fetch('/api/admin/ingredients', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ingredients),
            });
            alert('Ingredients updated successfully!');
        } catch (error) {
            alert('Failed to save ingredients');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: '1000px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '2rem', color: '#2c1810' }}>
                    Ingredients Spotlight
                </h1>
                <button
                    onClick={saveChanges}
                    disabled={saving}
                    style={{
                        background: '#333',
                        color: 'white',
                        border: 'none',
                        padding: '1rem 3rem',
                        borderRadius: '8px',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                    }}
                >
                    {saving ? 'Saving...' : 'Save All Changes'}
                </button>
            </div>

            {/* Language Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #eee' }}>
                <button
                    onClick={() => setActiveTab('en')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: 'transparent',
                        borderBottom: activeTab === 'en' ? '3px solid var(--color-pink)' : 'none',
                        color: activeTab === 'en' ? 'var(--color-pink)' : '#666',
                        fontWeight: activeTab === 'en' ? '700' : '400',
                        cursor: 'pointer'
                    }}
                >
                    English
                </button>
                <button
                    onClick={() => setActiveTab('zh')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: 'transparent',
                        borderBottom: activeTab === 'zh' ? '3px solid var(--color-pink)' : 'none',
                        color: activeTab === 'zh' ? 'var(--color-pink)' : '#666',
                        fontWeight: activeTab === 'zh' ? '700' : '400',
                        cursor: 'pointer'
                    }}
                >
                    中文 (Chinese)
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {ingredients.map((item, index) => (
                    <div key={item.id || index} style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <div style={{ fontWeight: 'bold', color: '#888', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                            Highlight #{index + 1}
                        </div>

                        {/* Image Uploader */}
                        <div style={{
                            width: '100%',
                            height: '200px',
                            background: '#f8f9fa',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            position: 'relative',
                            border: '2px dashed #ddd',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt="Ingredient"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <span style={{ color: '#aaa' }}>No Image</span>
                            )}

                            {uploading === index.toString() && (
                                <div style={{
                                    position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    Uploading...
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], index)}
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    opacity: 0,
                                    cursor: 'pointer'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                                Name ({activeTab === 'en' ? 'English' : 'Chinese'})
                            </label>
                            <input
                                type="text"
                                value={item.name[activeTab]}
                                onChange={(e) => updateIngredient(index, 'name', activeTab, e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                                Description ({activeTab === 'en' ? 'English' : 'Chinese'})
                            </label>
                            <textarea
                                value={item.description[activeTab]}
                                onChange={(e) => updateIngredient(index, 'description', activeTab, e.target.value)}
                                rows={3}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd', resize: 'none' }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
