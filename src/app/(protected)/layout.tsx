import Navbar from '@/lib/components/navbar/navbar';
import Navlinks from '@/lib/components/navbar/main/navlinks';
import Footer from '@/lib/components/footer';
import { PropsWithChildren } from 'react';
import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: PropsWithChildren){
  const supabase = createClient();
  let sub = null;

  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    redirect('/signin');
  }

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .eq('user_id', session.user.id)
    .maybeSingle();

  sub = subscription;

  if (error) {
    console.log(error);
  }

  return (
    <>
      <Navbar>
        <Navlinks user={session.user} subscription={sub} />
      </Navbar>
      <main
        id="skip"
        className="min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-80px)]"
      >
        {children}
      </main>
      <Footer />
    </>
  )
}