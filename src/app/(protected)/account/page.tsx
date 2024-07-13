import type { Metadata } from 'next';
import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from 'next/navigation';
import AccountPageContent from '@/app/(protected)/account/page-content';
import { getURL } from '@/lib/utils/helpers';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'NextBoilerplate - Account page',
    description: 'The account page',
    metadataBase: new URL(getURL()),
  };
}

interface AccountPageProps {
  searchParams: {
    _ptxn: string;
  }
}

export default async function Account({ searchParams }: AccountPageProps) {
  const supabase = createClient();

  const {
    data: { user: authUser },
    error: authError
  } = await supabase.auth.getUser();

  if (authError) {
    console.log(authError);
  }

  const { data: user, error: userError } = await supabase
    .from('accounts')
    .select('*')
    .eq('personal_account', true)
    .single();

  if (userError) {
    console.log('Account user error:', userError);
  }

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  if (error) {
    console.log('Account subscription error: ', error);
  }

  const { data: paddleSubscription, error: paddleError } = await supabase
    .from('paddle_subscriptions')
    .select('*')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  if (paddleError) {
    console.log('Account paddle subscription error: ', paddleError);
  }

  const { data: lsSubscription, error: lsError } = await supabase
    .from('ls_subscriptions')
    .select('*')
    .in('status', ['on_trial', 'active'])
    .maybeSingle();

  if (lsError) {
    console.log(lsError);
  }

  if (!user) {
    return redirect('/signin');
  }

  if (authUser && user) {
    return <AccountPageContent
      authUser={authUser}
      user={user}
      subscription={subscription}
      paddleSubscription={paddleSubscription}
      lsSubscription={lsSubscription}
      transactionId={searchParams._ptxn}
    />
  }

  return null;
}
