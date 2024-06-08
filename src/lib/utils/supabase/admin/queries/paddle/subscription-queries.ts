import { supabaseAdmin } from '@/lib/utils/supabase/admin';
import { PaddleSubscription } from '@/lib/types/supabase/table.types';

async function getSubscriptionByIdQuery(id: string): Promise<PaddleSubscription | null> {
  const { data: subscription, error } = await supabaseAdmin
    .from('paddle_subscriptions')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Subscription lookup failed: ${error.message}`);
  }

  return subscription;
}

async function upsertSubscriptionQuery(subscription: PaddleSubscription): Promise<string> {
  const { error: upsertError } = await supabaseAdmin
    .from('paddle_subscriptions')
    .upsert([subscription]);

  if (upsertError) {
    throw new Error(`Paddle subscription insert/update failed: ${upsertError.message}`);
  }

  return subscription.id;
}

export {
  getSubscriptionByIdQuery,
  upsertSubscriptionQuery,
}