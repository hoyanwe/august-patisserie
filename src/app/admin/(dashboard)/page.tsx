import DashboardActions from '@/components/admin/DashboardActions';
import { query } from '@/lib/db';

export const runtime = 'edge';

export default async function AdminDashboard() {
    // Fetch statistics from D1
    let productCount = 0;
    let categoryCount = 0;

    try {
        const productStats = await query<{ count: number }>('SELECT COUNT(*) as count FROM products');
        productCount = productStats[0]?.count || 0;

        const categoryStats = await query<{ count: number }>('SELECT COUNT(*) as count FROM categories');
        categoryCount = categoryStats[0]?.count || 0;
    } catch (error) {
        console.error('Error fetching dashboard stats from D1:', error);
    }

    return (
        <div>
            <h1 style={{
                fontSize: '2rem',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-playfair)',
            }}>
                Welcome to Admin Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Manage your bakery content
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem',
                width: '100%',
            }}>
                {/* Products Card */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧁</div>
                    <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>Products</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#E0BBE4', margin: 0 }}>
                        {productCount}
                    </p>
                </div>

                {/* Categories Card */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📁</div>
                    <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>Categories</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FFB7B2', margin: 0 }}>
                        {categoryCount}
                    </p>
                </div>

                {/* Story Card */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📝</div>
                    <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>Story</h3>
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>
                        Configured
                    </p>
                </div>
            </div>

            <DashboardActions />
        </div>
    );
}
