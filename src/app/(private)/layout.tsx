import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/server';
import SessionProvider from '@/lib/providers/session-provider';
import Navbar from '@/lib/components/navbar/navbar';
import Navlinks from '@/lib/components/navbar/dashboard/navlinks';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function Layout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const supabase = createClient();

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

  if (error) {
    console.log(error);
  }

  if (!subscription) {
    redirect('/signin');
  }

  if (session) {
    return (
      <SessionProvider session={session}>
        <Navbar>
            <Navlinks />
        </Navbar>
        <main>
          {children}
        </main>
      </SessionProvider>
    );
  }

  return null;
}