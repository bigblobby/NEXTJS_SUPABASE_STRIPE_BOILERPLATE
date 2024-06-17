import { supabaseAdmin } from '@/lib/utils/supabase/admin';
import { Subscription } from '@/lib/types/supabase/table.types';

async function upsertSubscriptionQuery(subscription: Subscription): Promise<string> {
  const { error: upsertError } = await supabaseAdmin
    .from('subscriptions')
    .upsert([subscription]);

  if (upsertError) {
    throw new Error(`Subscription insert/update failed: ${upsertError.message}`);
  }

  return subscription.id;
}

export {
  upsertSubscriptionQuery,
}