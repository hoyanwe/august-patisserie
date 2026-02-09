import { query } from '@/lib/db';

export default async function InstagramGallery() {
    let images: string[] = [];

    try {
        const results = await query<{ value: string }>('SELECT value FROM site_settings WHERE key = ?', ['instagram']);
        if (results.length > 0) {
            images = JSON.parse(results[0].value);
        }
    } catch (e) {
        console.error('Could not load Instagram images from D1:', e);
    }

    if (images.length === 0) return null;

    // Take top 6 for a nice layout
    const displayImages = images.slice(0, 6);

    return (
        <section style={{ padding: '4rem 0', backgroundColor: 'var(--color-white)' }}>
            <div className="container">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--color-text-main)' }}>
                    Follow us on Instagram <a href="https://www.instagram.com/august.patisserie/" target="_blank" style={{ color: 'var(--color-pink)' }}>@august.patisserie</a>
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1rem'
                }}>
                    {displayImages.map((src, index) => (
                        <div key={index} style={{
                            position: 'relative',
                            aspectRatio: '1/1',
                            overflow: 'hidden',
                            borderRadius: 'var(--radius-sm)'
                        }}>
                            <img
                                src={src}
                                alt="Instagram post"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.3s'
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
