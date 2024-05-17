import Navbar from '@/lib/components/navbar/navbar';
import Navlinks from '@/lib/components/navbar/main/navlinks';
import Footer from '@/lib/components/footers/footer';
import { PropsWithChildren } from 'react';
import { createClient } from '@/lib/utils/supabase/server';

export default async function Layout({ children }: PropsWithChildren){
  const supabase = createClient();
  let sub = null;

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (user) {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .eq('user_id', user.id)
      .maybeSingle();

    sub = subscription;

    const { data: paddleSubscription, error: paddleError } = await supabase
      .from('paddle_subscriptions')
      .select('*')
      .in('status', ['trialing', 'active'])
      .eq('user_id', user.id)
      .maybeSingle();

    if (!sub) {
      sub = paddleSubscription;
    }
  }

  return (
    <>
      <Navbar>
        <Navlinks user={user} subscription={sub} />
      </Navbar>
      <main id="skip" className="min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-80px)]">
        {children}
      </main>
      <Footer />
    </>
  )
}