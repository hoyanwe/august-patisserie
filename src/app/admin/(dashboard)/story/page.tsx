'use client';

import { useState, useEffect } from 'react';

interface StoryData {
    en: {
        title: string;
        content: string;
    };
    zh: {
        title: string;
        content: string;
    };
}

export default function StoryPage() {
    const [story, setStory] = useState<StoryData>({
        en: { title: '', content: '' },
        zh: { title: '', content: '' }
    });
    const [activeTab, setActiveTab] = useState<'en' | 'zh'>('en');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStory();
    }, []);

    const fetchStory = async () => {
        try {
            const res = await fetch('/api/admin/story');
            const data = await res.json() as StoryData;
            setStory(data);
        } catch (error) {
            console.error('Failed to fetch story:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await fetch('/api/admin/story', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(story),
            });
            alert('Story updated successfully!');
        } catch (error) {
            alert('Failed to update story');
        } finally {
            setSaving(false);
        }
    };

    const updateStory = (lang: 'en' | 'zh', field: 'title' | 'content', value: string) => {
        setStory({
            ...story,
            [lang]: {
                ...story[lang],
                [field]: value
            }
        });
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
                Edit Story
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Edit your story content in English and Chinese
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
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Title {activeTab === 'en' ? '(English)' : '(中文)'}
                    </label>
                    <input
                        type="text"
                        value={story[activeTab].title}
                        onChange={(e) => updateStory(activeTab, 'title', e.target.value)}
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
                        Content {activeTab === 'en' ? '(English)' : '(中文)'}
                    </label>
                    <textarea
                        value={story[activeTab].content}
                        onChange={(e) => updateStory(activeTab, 'content', e.target.value)}
                        rows={10}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontFamily: 'inherit',
                            resize: 'vertical',
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
                    {saving ? 'Saving...' : 'Save Story'}
                </button>
            </form>
        </div>
    );
}
