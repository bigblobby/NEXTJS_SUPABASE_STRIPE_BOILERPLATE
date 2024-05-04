import { Metadata } from 'next';
import { PropsWithChildren, Suspense } from 'react';
import '@/styles/main.css';
import { getURL } from '@/lib/utils/helpers';
import { ThemeProvider } from 'next-themes';
import { Toaster as HotToaster } from 'react-hot-toast';
import { Gabarito } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

const gabarito = Gabarito({ subsets: ['latin'] });

const meta = {
  title: 'Next.js Subscription Starter',
  description: 'Brought to you by Vercel, Stripe, and Supabase.',
  cardImage: '/og.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: getURL()
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: meta.title,
    description: meta.description,
    referrer: 'origin-when-cross-origin',
    keywords: ['Vercel', 'Supabase', 'Next.js', 'Stripe', 'Subscription'],
    authors: [{ name: 'Vercel', url: 'https://vercel.com/' }],
    creator: 'Vercel',
    publisher: 'Vercel',
    robots: meta.robots,
    icons: { icon: meta.favicon },
    metadataBase: new URL(meta.url),
    openGraph: {
      url: meta.url,
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage],
      type: 'website',
      siteName: meta.title
    },
    twitter: {
      card: 'summary_large_image',
      site: '@Vercel',
      creator: '@Vercel',
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage]
    }
  };
}

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html className="bg-background" lang="en" suppressHydrationWarning>
      <body className={"bg-background loading " + gabarito.className}>
        <NextTopLoader color="#FE600E" showSpinner={false} crawlSpeed={200} />
        <ThemeProvider>
          <Suspense>
            <HotToaster position="top-center" toastOptions={{
              duration: 5000,
              style: {
                borderRadius: '2px',
              }
            }}  />
          </Suspense>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
