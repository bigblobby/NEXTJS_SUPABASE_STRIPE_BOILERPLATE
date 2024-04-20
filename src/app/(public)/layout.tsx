import Navbar from '@/src/lib/components/navbar';
import Footer from '@/src/lib/components/footer';
import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren){
  return (
    <>
      <Navbar />
      <main
        id="skip"
        className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
      >
        {children}
      </main>
      <Footer />
    </>
  )
}