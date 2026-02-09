import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <AdminSidebar />

            <main style={{
                flex: 1,
                padding: '2rem',
                background: '#f8f9fa',
                overflowY: 'auto',
            }}>
                {children}
            </main>
        </div>
    );
}
