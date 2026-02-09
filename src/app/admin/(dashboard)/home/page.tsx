'use client';

import { useState, useEffect } from 'react';

interface HomeData {
    hero: {
        en: {
            title: string;
            subtitle: string;
            buttonText: string;
        };
        zh: {
            title: string;
            subtitle: string;
            buttonText: string;
        };
    };
    heroImage: string;
}

export default function HomePage() {
    const [data, setData] = useState<HomeData>({
        hero: {
            en: { title: '', subtitle: '', buttonText: '' },
            zh: { title: '', subtitle: '', buttonText: '' }
        },
        heroImage: ''
    });
    const [activeTab, setActiveTab] = useState<'en' | 'zh'>('en');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/home');
            const json = await res.json() as HomeData;
            if (json.hero) {
                setData(json);
            }
        } catch (error) {
            console.error('Failed to fetch home content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await fetch('/api/admin/home', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            alert('Home page updated successfully!');
        } catch (error) {
            alert('Failed to update home page');
        } finally {
            setSaving(false);
        }
    };

    const updateHero = (lang: 'en' | 'zh', field: string, value: string) => {
        setData({
            ...data,
            hero: {
                ...data.hero,
                [lang]: {
                    ...data.hero[lang],
                    [field]: value
                }
            }
        });
    };

    const updateHeroImage = (value: string) => {
        setData({
            ...data,
            heroImage: value
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: uploadData,
            });
            const result = await res.json() as { url: string; error?: string };

            if (res.ok) {
                updateHeroImage(result.url);
            } else {
                alert('Upload failed: ' + (result.error || 'Unknown error'));
            }
        } catch (error) {
            alert('Failed to upload image');
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 style={{
                fontSize: '2rem',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-playfair)',
            }}>
                Edit Home Page
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Edit your home page content in English and Chinese
            </p>

            {/* Language Tabs */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button
                    type="button"
                    onClick={() => setActiveTab('en')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: activeTab === 'en' ? 'var(--pastel-purple)' : 'white',
                        color: activeTab === 'en' ? 'var(--text-primary)' : '#666',
                        border: '2px solid var(--pastel-purple)',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                    }}
                >
                    English
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('zh')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: activeTab === 'zh' ? 'var(--pastel-purple)' : 'white',
                        color: activeTab === 'zh' ? 'var(--text-primary)' : '#666',
                        border: '2px solid var(--pastel-purple)',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                    }}
                >
                    中文 (Chinese)
                </button>
            </div>

            <form onSubmit={handleSubmit} style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                maxWidth: '800px',
            }}>
                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Hero Configuration</h3>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Hero Background Image URL
                    </label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <input
                                type="text"
                                value={data.heroImage}
                                onChange={(e) => updateHeroImage(e.target.value)}
                                placeholder="/images/hero-santorini-v5.png"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    marginBottom: '1rem'
                                }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <label style={{
                                    padding: '0.5rem 1rem',
                                    background: '#f8f9fa',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    cursor: uploading ? 'not-allowed' : 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    display: 'inline-block'
                                }}>
                                    {uploading ? 'Uploading...' : '📁 Choose File'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                                    Or enter path manually.
                                </span>
                            </div>
                        </div>
                        {data.heroImage && (
                            <div style={{
                                width: '120px',
                                height: '80px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: '1px solid #ddd',
                                background: '#f8f9fa'
                            }}>
                                <img
                                    src={data.heroImage}
                                    alt="Hero Preview"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Invalid+Image')}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Title {activeTab === 'en' ? '(English)' : '(中文)'}
                    </label>
                    <input
                        type="text"
                        value={data.hero[activeTab].title}
                        onChange={(e) => updateHero(activeTab, 'title', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem',
                        }}
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Subtitle {activeTab === 'en' ? '(English)' : '(中文)'}
                    </label>
                    <input
                        type="text"
                        value={data.hero[activeTab].subtitle}
                        onChange={(e) => updateHero(activeTab, 'subtitle', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem',
                        }}
                    />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Button Text {activeTab === 'en' ? '(English)' : '(中文)'}
                    </label>
                    <input
                        type="text"
                        value={data.hero[activeTab].buttonText}
                        onChange={(e) => updateHero(activeTab, 'buttonText', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem',
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    style={{
                        padding: '0.875rem 2rem',
                        background: saving ? '#ccc' : 'var(--pastel-purple)',
                        color: 'var(--text-primary)',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: saving ? 'not-allowed' : 'pointer',
                    }}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}
