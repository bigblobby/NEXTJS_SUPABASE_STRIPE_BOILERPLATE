import { PaddlePrice, PaddleProduct } from '@/lib/types/supabase/table.types';
import { Json } from '@/lib/types/supabase/types_db';
import { supabaseAdmin } from '@/lib/utils/supabase/admin/index';
import type {
  ProductUpdatedEvent,
  ProductCreatedEvent,
  PriceUpdatedEvent,
  PriceCreatedEvent
} from '@paddle/paddle-node-sdk/dist/types/notifications/events';

async function upsertProductRecord(product: ProductCreatedEvent | ProductUpdatedEvent) {
  const productData: PaddleProduct = {
    id: product.data.id,
    status: 'active',
    name: product.data.name,
    description: product.data.description ?? null,
    image: product.data.imageUrl ?? null,
    custom_data: product.data.customData as Json,
    type: product.data.type,
    tax_category: product.data.taxCategory,
    created_at: product.data.createdAt,
    updated_at: product.data.updatedAt,
  };

  const { error } = await supabaseAdmin
    .from('paddle_products')
    .upsert([productData]);

  if (error) {
    throw new Error(`Paddle product insert/update failed: ${error.message}`);
  }

  console.log(`Paddle product inserted/updated: ${product.data.id}`);
}

async function upsertPriceRecord(
  price: PriceCreatedEvent | PriceUpdatedEvent,
  retryCount = 0,
  maxRetries = 3
) {
  const priceData: PaddlePrice = {
    id: price.data.id,
    product_id: price.data.productId,
    name: price.data.name,
    type: price.data.type,
    description: price.data.description ?? null,
    interval: price.data.billingCycle?.interval!,
    interval_frequency: price.data.billingCycle?.frequency!,
    unit_price_currency_code: price.data.unitPrice.currencyCode,
    status: price.data.status,
    trial_interval: price.data.trialPeriod?.interval!,
    trial_interval_frequency: price.data.trialPeriod?.frequency!,
    quantity_max: price.data.quantity.maximum,
    quantity_min: price.data.quantity.minimum,
    tax_mode: price.data.taxMode,
    unit_price_amount: price.data.unitPrice.amount,
    custom_data: price.data.customData as Json,
    created_at: price.data.createdAt,
    updated_at: price.data.updatedAt,
    // Fix this
    unit_price_overrides: null,
  };

  const { error } = await supabaseAdmin
    .from('paddle_prices')
    .upsert([priceData]);

  if (error?.message.includes('foreign key constraint')) {
    if (retryCount < maxRetries) {
      console.log(`Retry attempt ${retryCount + 1} for price ID: ${price.data.id}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await upsertPriceRecord(price, retryCount + 1, maxRetries);
    } else {
      throw new Error(`Paddle Price insert/update failed after ${maxRetries} retries: ${error.message}`);
    }
  } else if (error) {
    throw new Error(`Paddle Price insert/update failed: ${error.message}`);
  } else {
    console.log(`Paddle Price inserted/updated: ${price.data.id}`);
  }
}

export {
  upsertProductRecord,
  upsertPriceRecord,
};