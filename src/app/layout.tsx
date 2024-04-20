import { Metadata } from 'next';
import Footer from '@/src/lib/components/footer';
import Navbar from 'src/lib/components/navbar';
import { Toaster } from '@/src/lib/components/ui/toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import '@/src/styles/main.css';
import { getURL } from '@/src/lib/utils/helpers';
import { ThemeProvider } from 'next-themes';
import { Toaster as HotToaster } from 'react-hot-toast';

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
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background loading">
        <ThemeProvider>
          <Suspense>
            <HotToaster position="top-center" toastOptions={{
              duration: 5000,
              style: {
                borderRadius: '2px',
              }
            }}  />
          </Suspense>
          <Suspense>
            <Toaster />
          </Suspense>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
