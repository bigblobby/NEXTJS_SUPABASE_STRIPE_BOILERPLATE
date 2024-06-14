import { createClient } from '@/lib/utils/supabase/server';
import HomepageContent from '@/app/(public)/(homepage)/page-content';
import { AppConfig } from '@/lib/config/app-config';

export default async function Homepage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  let sub = null;
  let paddleSub = null;
  let lsSub = null;

  if (AppConfig.payments === 'stripe' && user) {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .in('status', ['trialing', 'active'])
      .maybeSingle();

    if (error) {
      console.log(error);
    }

    sub = subscription;
  }

  if (AppConfig.payments === 'paddle' && user) {
    const { data: paddleSubscription, error: paddleError } = await supabase
      .from('paddle_subscriptions')
      .select('*')
      .in('status', ['trialing', 'active'])
      .maybeSingle();

    if (paddleError) {
      console.log(paddleError);
    }

    paddleSub = paddleSubscription;
  }

  if (AppConfig.payments === 'ls' && user) {
    const { data: lsSubscription, error: lsError } = await supabase
      .from('ls_subscriptions')
      .select('*')
      .in('status', ['on_trial', 'active'])
      .eq('user_id', user.id)
      .single();

    if (lsError) {
      console.log(lsError);
    }

    console.log(lsSubscription);
    console.log(lsError);

    lsSub = lsSubscription;
  }

  return (
    <HomepageContent
      user={user}
      subscription={sub}
      paddleSubscription={paddleSub}
      lsSubscription={lsSub}
    />
  );
}
