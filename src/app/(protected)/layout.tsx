import MinimalFooter from '@/lib/components/footers/minimal-footer';
import { PropsWithChildren } from 'react';
import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from 'next/navigation';
import UserProvider from '@/lib/providers/user-provider';
import Navbar from '@/lib/components/nav/navbar';
import Navlinks from '@/lib/components/nav/dashboard/navlinks';
import { getAccounts } from '@/lib/queries/account';
import { AccountsProvider } from '@/lib/providers/accounts-provider';

export default async function Layout({ children }: PropsWithChildren){
  const supabase = createClient();

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/signin');
  }

  const accounts = await getAccounts(user);

  return (
    <AccountsProvider data={accounts}>
      <UserProvider user={user}>
        <Navbar>
          <Navlinks />
        </Navbar>
        <main id="skip" className="min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-80px)]">
          {children}
        </main>
        <MinimalFooter />
      </UserProvider>
    </AccountsProvider>
  )
}