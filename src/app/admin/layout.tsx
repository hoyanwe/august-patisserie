import '../globals.css';
import { Playfair_Display, Lato } from 'next/font/google';

const playfair = Playfair_Display({
    variable: '--font-playfair',
    subsets: ['latin'],
});

const lato = Lato({
    variable: '--font-lato',
    weight: ['400', '700'],
    subsets: ['latin'],
});

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
            <head />
            <body style={{ margin: 0, fontFamily: 'var(--font-lato)' }} suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
