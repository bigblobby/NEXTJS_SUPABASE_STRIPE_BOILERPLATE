import { supabaseAdmin } from '@/lib/utils/supabase/admin';
import type { PaddlePrice, PaddleProduct } from '@/lib/types/supabase/table.types';

async function upsertProductQuery(product: PaddleProduct) {
  const { error } = await supabaseAdmin
    .from('paddle_products')
    .upsert([product]);

  if (error) {
    throw new Error(`Paddle product insert/update failed: ${error.message}`);
  }

  console.log(`Paddle product inserted/updated: ${product.id}`);
}

async function upsertPriceQuery(price: PaddlePrice) {
  const { error } = await supabaseAdmin
    .from('paddle_prices')
    .upsert([price]);

  if (error) {
    throw new Error(`Paddle price insert/update failed: ${error.message}`);
  }

  console.log(`Paddle price inserted/updated: ${price.id}`);
}

export {
  upsertProductQuery,
  upsertPriceQuery,
}