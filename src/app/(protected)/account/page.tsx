import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from 'next/navigation';
import AccountPageContent from '@/app/(protected)/account/page-content';
import type { Metadata } from 'next';
import { getURL } from '@/lib/utils/helpers';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'NextBoilerplate - Account page',
    description: 'The account page',
    metadataBase: new URL(getURL()),
  };
}

export default async function Account() {
  const supabase = createClient();

  const {
    data: { user: authUser },
    error: authError
  } = await supabase.auth.getUser();

  if (authError) {
    console.log(authError);
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .single();

  if (userError) {
    console.log(userError);
  }

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  if (error) {
    console.log(error);
  }

  if (!user) {
    return redirect('/signin');
  }

  if (authUser && user) {
    return <AccountPageContent authUser={authUser} user={user} subscription={subscription} />
  }

  return null
}
