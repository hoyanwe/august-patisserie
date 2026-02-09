'use client';

import { useState, useEffect } from 'react';

interface ContactData {
    en: {
        title: string;
        intro: string;
        whatsappTitle: string;
        instagramTitle: string;
    };
    zh: {
        title: string;
        intro: string;
        whatsappTitle: string;
        instagramTitle: string;
    };
}

export default function ContactAdminPage() {
    const [data, setData] = useState<ContactData>({
        en: { title: '', intro: '', whatsappTitle: '', instagramTitle: '' },
        zh: { title: '', intro: '', whatsappTitle: '', instagramTitle: '' }
    });
    const [activeTab, setActiveTab] = useState<'en' | 'zh'>('en');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/contact');
            const json = await res.json() as ContactData;
            if (json.en) {
                setData(json);
            }
        } catch (error) {
            console.error('Failed to fetch contact content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await fetch('/api/admin/contact', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            alert('Contact page updated successfully!');
        } catch (error) {
            alert('Failed to update contact page');
        } finally {
            setSaving(false);
        }
    };

    const updateField = (lang: 'en' | 'zh', field: string, value: string) => {
        setData({
            ...data,
            [lang]: {
                ...data[lang],
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
                Edit Contact Page
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Edit your contact page content in English and Chinese
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
                        value={data[activeTab].title}
                        onChange={(e) => updateField(activeTab, 'title', e.target.value)}
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
                        Introduction Text {activeTab === 'en' ? '(English)' : '(中文)'}
                    </label>
                    <textarea
                        value={data[activeTab].intro}
                        onChange={(e) => updateField(activeTab, 'intro', e.target.value)}
                        rows={4}
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
                    <p style={{ fontSize: '0.875rem', color: '#888', marginTop: '0.25rem' }}>
                        Use new lines for paragraph breaks
                    </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        WhatsApp Section Title {activeTab === 'en' ? '(English)' : '(中文)'}
                    </label>
                    <input
                        type="text"
                        value={data[activeTab].whatsappTitle}
                        onChange={(e) => updateField(activeTab, 'whatsappTitle', e.target.value)}
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
                        Instagram Section Title {activeTab === 'en' ? '(English)' : '(中文)'}
                    </label>
                    <input
                        type="text"
                        value={data[activeTab].instagramTitle}
                        onChange={(e) => updateField(activeTab, 'instagramTitle', e.target.value)}
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
