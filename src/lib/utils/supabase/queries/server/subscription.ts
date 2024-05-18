import { createClient } from '@/lib/utils/supabase/server';
import { User } from '@supabase/auth-js';

async function getSubscription(user: User) {
  const supabase = createClient();
  let sub = null;

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .eq('user_id', user.id)
    .maybeSingle();

  if (subscription){
    sub = subscription;
  }

  if (error) {
    console.log(error);
  }

  const { data: paddleSubscription, error: paddleError } = await supabase
    .from('paddle_subscriptions')
    .select('*')
    .in('status', ['trialing', 'active'])
    .eq('user_id', user.id)
    .maybeSingle();

  if (paddleSubscription) {
    sub = paddleSubscription;
  }

  if (paddleError) {
    console.log(paddleError);
  }

  return sub;
}

export {
  getSubscription,
}