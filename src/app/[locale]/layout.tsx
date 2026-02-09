import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingCart from '@/components/FloatingCart';
import AnnouncementBar from '@/components/AnnouncementBar';
import AuthProvider from '@/components/AuthProvider';
import { CartProvider } from '@/context/CartContext';

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "August Patisserie",
  description: "Modern & Elegant Bakery",
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { children } = props;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${playfair.variable} ${lato.variable}`} suppressHydrationWarning>
        <AuthProvider>
          <NextIntlClientProvider messages={messages}>
            <CartProvider>
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <AnnouncementBar />
                <Header />
                <main style={{ flex: 1 }}>{children}</main>
                <Footer />
                <FloatingCart />
              </div>
            </CartProvider>
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
