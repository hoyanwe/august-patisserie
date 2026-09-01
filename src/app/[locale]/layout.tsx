import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/navigation';
import { SITE_URL } from '@/lib/site';
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

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';
  const title = isZh ? 'August Patisserie · 手工糕点烘焙' : 'August Patisserie · Artisan Bakery';
  const description = isZh
    ? '现代优雅的手工糕点，每日新鲜烘焙。浏览菜单，通过 WhatsApp 下单。'
    : 'Modern & elegant artisan pastries, freshly baked daily. Browse the menu and order via WhatsApp.';

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        en: `${SITE_URL}/en`,
        zh: `${SITE_URL}/zh`,
        'x-default': `${SITE_URL}/`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_URL}/${locale}`,
      locale: isZh ? 'zh_CN' : 'en_US',
      siteName: 'August Patisserie',
    },
  };
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { children } = props;

  // Validate locale
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

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
