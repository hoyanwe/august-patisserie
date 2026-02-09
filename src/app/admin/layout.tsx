import '../globals.css';

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head />
            <body style={{ margin: 0, fontFamily: 'var(--font-lato)' }} suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
