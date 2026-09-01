import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/products';
import ProductDetail from '@/components/ProductDetail';

// Always reflect live D1 data (never a stale build-time snapshot).
export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ id: string; locale: string }>;
}

export default async function ProductPage({ params }: Props) {
    const { id, locale } = await params;

    let product = null;
    try {
        product = await getProductById(id);
    } catch (error) {
        console.error('Error fetching product from D1:', error);
    }

    // Hidden (deactivated) products are not reachable on the storefront.
    if (!product || !product.isActive) {
        notFound();
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8f9fa',
            padding: '4rem 2rem'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <ProductDetail product={product} locale={locale} />
            </div>
        </div>
    );
}
