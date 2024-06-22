import { supabaseAdmin } from '@/lib/utils/supabase/admin';
import { Order } from '@/lib/types/supabase/table.types';

async function createOrderQuery(order: Order) {
  const { error: upsertError } = await supabaseAdmin
    .from('orders')
    .upsert([order]);

  if (upsertError) {
    throw new Error(`Order insert/update failed: ${upsertError.message}`);
  }

  return order.id;
}

export {
  createOrderQuery,
}