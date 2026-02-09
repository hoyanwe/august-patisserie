'use client';

import { useState, useEffect } from 'react';

interface Announcement {
    id: string;
    text: {
        en: string;
        zh: string;
    };
    active: boolean;
}

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'en' | 'zh'>('en');

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch('/api/admin/announcements');
            const data = await res.json() as any[];

            // Migrate legacy data if necessary
            const migratedData = data.map((item: any) => ({
                ...item,
                text: typeof item.text === 'string' ? { en: item.text, zh: '' } : item.text
            }));

            setAnnouncements(migratedData);
        } catch (error) {
            console.error('Failed to fetch announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveAnnouncements = async (newData: Announcement[]) => {
        setSaving(true);
        try {
            await fetch('/api/admin/announcements', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData),
            });
            setAnnouncements(newData);
        } catch (error) {
            alert('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const addAnnouncement = () => {
        if (announcements.length >= 5) {
            alert('Maximum 5 announcements allowed');
            return;
        }
        const newItem: Announcement = {
            id: Date.now().toString(),
            text: { en: '', zh: '' },
            active: true
        };
        setAnnouncements([...announcements, newItem]);
    };

    const updateAnnouncement = (id: string, lang: 'en' | 'zh', value: string) => {
        const newData = announcements.map(item =>
            item.id === id ? { ...item, text: { ...item.text, [lang]: value } } : item
        );
        setAnnouncements(newData);
    };

    const toggleActive = (id: string) => {
        const newData = announcements.map(item =>
            item.id === id ? { ...item, active: !item.active } : item
        );
        setAnnouncements(newData);
    };

    const removeAnnouncement = (id: string) => {
        if (confirm('Are you sure?')) {
            const newData = announcements.filter(item => item.id !== id);
            setAnnouncements(newData);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '2rem', color: '#2c1810' }}>
                    Announcement Bar
                </h1>
                <button
                    onClick={addAnnouncement}
                    disabled={announcements.length >= 5}
                    style={{
                        background: announcements.length >= 5 ? '#ccc' : 'var(--color-pink)',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '50px',
                        cursor: announcements.length >= 5 ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    + Add Announcement
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {announcements.map((item, index) => (
                    <div key={item.id} style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <div style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            background: '#eee',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            color: '#666'
                        }}>
                            {index + 1}
                        </div>

                        <input
                            type="text"
                            value={item.text[activeTab]}
                            onChange={(e) => updateAnnouncement(item.id, activeTab, e.target.value)}
                            placeholder={`Enter announcement text in ${activeTab === 'en' ? 'English' : 'Chinese'}...`}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '1rem'
                            }}
                        />

                        <button
                            onClick={() => toggleActive(item.id)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                border: '1px solid',
                                borderColor: item.active ? '#4CAF50' : '#ccc',
                                background: item.active ? '#e8f5e9' : '#f5f5f5',
                                color: item.active ? '#2e7d32' : '#666',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: '600'
                            }}
                        >
                            {item.active ? 'Active' : 'Hidden'}
                        </button>

                        <button
                            onClick={() => removeAnnouncement(item.id)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#e53935',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                padding: '0.5rem'
                            }}
                            title="Delete"
                        >
                            🗑️
                        </button>
                    </div>
                ))}

                {announcements.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#888', background: '#f9f9f9', borderRadius: '12px' }}>
                        No announcements yet. Click "Add" to create one.
                    </div>
                )}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                <button
                    onClick={() => saveAnnouncements(announcements)}
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

            <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
                * Announcements will rotate in a ticker if multiple are active.
            </p>
        </div>
    );
}
