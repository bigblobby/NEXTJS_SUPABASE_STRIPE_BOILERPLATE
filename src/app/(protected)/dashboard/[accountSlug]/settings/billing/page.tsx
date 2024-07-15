import type { Metadata } from 'next';
import { createClient } from '@/lib/utils/supabase/server';
import SettingsPageBillingContent from '@/app/(protected)/dashboard/[accountSlug]/settings/billing/page-content';
import { getURL } from '@/lib/utils/helpers';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'NextBoilerplate - Settings Billing page',
    description: 'The settings page',
    metadataBase: new URL(getURL()),
  };
}

export default async function SettingsBillingPage() {
  const supabase = createClient();

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

  return <SettingsPageBillingContent
    subscription={subscription}
    paddleSubscription={paddleSubscription}
    lsSubscription={lsSubscription}
  />
}
