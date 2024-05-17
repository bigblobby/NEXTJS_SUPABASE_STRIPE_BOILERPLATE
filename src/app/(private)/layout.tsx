import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/server';
import Navbar from '@/lib/components/navbar/navbar';
import Navlinks from '@/lib/components/navbar/dashboard/navlinks';
import UserProvider from '@/lib/providers/user-provider';
import { getURL } from '@/lib/utils/helpers';
import { PropsWithChildren } from 'react';

const meta = {
  title: 'NextBoilerplate - Dashboard',
  description: 'The NextBoilerplate dashboard',
  url: getURL()
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL(meta.url)
  };
}

export default async function Layout({ children }: PropsWithChildren) {
  const supabase = createClient();

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  let sub;

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

  if (!sub) {
    sub = paddleSubscription;
  }

  if (paddleError) {
    console.log(paddleError);
  }

  if (!sub) {
    redirect('/signin');
  }

  if (user) {
    return (
      <UserProvider user={user}>
        <Navbar>
          <Navlinks />
        </Navbar>
        <main>
          {children}
        </main>
      </UserProvider>
    );
  }

  return null;
}