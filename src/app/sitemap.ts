import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { routing } from '@/navigation';

// Dynamic so product URLs reflect live D1 (build has no D1 binding).
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const paths = ['', '/menu', '/story', '/contact'];
    const entries: MetadataRoute.Sitemap = [];

    for (const locale of routing.locales) {
        for (const path of paths) {
            entries.push({
                url: `${SITE_URL}/${locale}${path}`,
                changeFrequency: 'weekly',
                priority: path === '' ? 1 : 0.7,
                alternates: {
                    languages: Object.fromEntries(
                        routing.locales.map(l => [l, `${SITE_URL}/${l}${path}`]),
                    ),
                },
            });
        }
    }

    // Best-effort product pages — never fail the sitemap if D1 is unavailable.
    try {
        const { getAllProducts } = await import('@/lib/products');
        const products = await getAllProducts();
        for (const p of products) {
            for (const locale of routing.locales) {
                entries.push({
                    url: `${SITE_URL}/${locale}/menu/${p.id}`,
                    changeFrequency: 'weekly',
                    priority: 0.6,
                });
            }
        }
    } catch {
        // ignore
    }

    return entries;
}
