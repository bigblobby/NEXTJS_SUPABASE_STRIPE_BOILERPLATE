import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/server';
import Navbar from '@/lib/components/navbar/navbar';
import Navlinks from '@/lib/components/navbar/dashboard/navlinks';
import UserProvider from '@/lib/providers/user-provider';
import { getURL } from '@/lib/utils/helpers';
import { PropsWithChildren } from 'react';
import { getSubscription } from '@/lib/utils/supabase/queries/server/subscription';

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

  if (userError || !user) {
    redirect('/signin');
  }

  const subscription = await getSubscription(user);

  if (!subscription) {
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