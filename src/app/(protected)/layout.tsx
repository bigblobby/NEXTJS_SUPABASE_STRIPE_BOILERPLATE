import Navbar from '@/lib/components/navbar/navbar';
import Navlinks from '@/lib/components/navbar/main/navlinks';
import MinimalFooter from '@/lib/components/footers/minimal-footer';
import { PropsWithChildren } from 'react';
import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from 'next/navigation';
import UserProvider from '@/lib/providers/user-provider';

export default async function Layout({ children }: PropsWithChildren){
  const supabase = createClient();
  let sub = null;

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/signin');
  }

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .eq('user_id', user.id)
    .maybeSingle();

  sub = subscription;

  if (error) {
    console.log(error);
  }

  const { data: paddleSubscription, error: paddleError } = await supabase
    .from('paddle_subscriptions')
    .select('*')
    .in('status', ['trialing', 'active'])
    .eq('user_id', user.id)
    .maybeSingle();

  if (!sub) sub = paddleSubscription;

  if (paddleError) {
    console.log(paddleError);
  }

  return (
    <UserProvider value={user}>
      <Navbar>
        <Navlinks user={user} subscription={sub} />
      </Navbar>
      <main id="skip" className="min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-80px)]">
        {children}
      </main>
      <MinimalFooter />
    </UserProvider>
  )
}