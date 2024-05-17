import type { PaddlePrice, PaddleProduct, PaddleSubscription } from '@/lib/types/supabase/table.types';
import { Json } from '@/lib/types/supabase/types_db';
import { supabaseAdmin } from '@/lib/utils/supabase/admin/index';
import {
  ProductUpdatedEvent,
  ProductCreatedEvent,
  PriceUpdatedEvent,
  PriceCreatedEvent,
  SubscriptionCreatedEvent,
  SubscriptionUpdatedEvent,
} from '@paddle/paddle-node-sdk/dist/types/notifications/events';
import { paddle } from '@/lib/utils/paddle/config';
import { EventName } from '@paddle/paddle-node-sdk';

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

async function createOrRetrievePaddleCustomer({
  email,
  uuid
}: {
  email: string;
  uuid: string;
}) {
  // Check if the customer already exists in Supabase
  const { data: existingSupabaseCustomer, error: queryError } =
    await supabaseAdmin
      .from('paddle_customers')
      .select('*')
      .eq('id', uuid)
      .maybeSingle();

  if (queryError) {
    throw new Error(`Supabase paddle customer lookup failed: ${queryError.message}`);
  }

  // Retrieve the Paddle customer ID using the Supabase customer ID, with email fallback
  let paddleCustomerId: string | undefined;

  if (existingSupabaseCustomer?.paddle_customer_id) {
    const existingPaddleCustomer = await paddle.customers.get(existingSupabaseCustomer.paddle_customer_id);
    paddleCustomerId = existingPaddleCustomer.id;
  }

  // If still no paddleCustomerId, create a new customer in Paddle
  const paddleIdToInsert = paddleCustomerId ? paddleCustomerId : await createCustomerInPaddle(uuid, email);

  if (!paddleIdToInsert) {
    throw new Error('Paddle customer creation failed.');
  }

  if (existingSupabaseCustomer && paddleCustomerId) {
    // If Supabase has a record but doesn't match Paddle, update Supabase record
    if (existingSupabaseCustomer.paddle_customer_id !== paddleCustomerId) {
      const { error: updateError } = await supabaseAdmin
        .from('paddle_customers')
        .update({ paddle_customer_id: paddleCustomerId })
        .eq('id', uuid);

      if (updateError) {
        throw new Error(`Supabase paddle customer record update failed: ${updateError.message}`);
      }

      console.warn(`Supabase paddle customer record mismatched Paddle ID. Supabase record updated.`);
    }
    // If Supabase has a record and matches Paddle, return Paddle customer ID
    return paddleCustomerId;
  } else {
    console.warn(`Supabase paddle customer record was missing. A new record was created.`);

    // If Supabase has no record, create a new record and return Paddle customer ID
    const upsertedPaddleCustomerId = await upsertPaddleCustomerToSupabase(uuid, paddleIdToInsert);

    if (!upsertedPaddleCustomerId) {
      throw new Error('Supabase paddle customer record creation failed.');
    }

    return upsertedPaddleCustomerId;
  }
}

async function manageSubscriptionStatusChange(
  subscription: SubscriptionCreatedEvent | SubscriptionUpdatedEvent,
) {
  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from('paddle_customers')
    .select('id')
    .eq('paddle_customer_id', subscription.data.customerId)
    .single();

  if (noCustomerError) {
    throw new Error(`Customer lookup failed: ${noCustomerError.message}`);
  }

  const { id: uuid } = customerData!;

  // We need to make sure we don't overwrite the transactionId
  // as it is omitted from all events except EventName.SubscriptionCreated
  let transactionId;
  if (subscription.eventType !== EventName.SubscriptionCreated) {
    const { data: storedSubscription } = await supabaseAdmin
      .from('paddle_subscriptions')
      .select('id, transaction_id')
      .eq('id', subscription.data.id)
      .maybeSingle();

    transactionId = storedSubscription?.transaction_id;
  } else {
    transactionId = subscription.data?.transactionId;
  }

  // Upsert the latest status of the subscription object.
  const subscriptionData: PaddleSubscription = {
    id: subscription.data.id,
    user_id: uuid,
    customer_id: subscription.data.customerId,
    transaction_id: transactionId ?? null,
    address_id: subscription.data.addressId,
    business_id: subscription.data.businessId,
    status: subscription.data.status,
    billing_cycle: subscription.data.billingCycle as unknown as Json,
    billing_details: subscription.data.billingDetails as Json,
    collection_mode: subscription.data.collectionMode,
    currency_code: subscription.data.currencyCode,
    items: subscription.data.items as unknown as Json[],
    custom_data: subscription.data.customData as Json,
    current_billing_period: subscription.data.currentBillingPeriod as Json,
    discount: subscription.data.discount as Json,
    scheduled_change: subscription.data.scheduledChange as Json,
    first_billed_at: subscription.data.firstBilledAt,
    next_billed_at: subscription.data.nextBilledAt,
    started_at: subscription.data.startedAt,
    created_at: subscription.data.createdAt,
    updated_at: subscription.data.updatedAt,
    paused_at: subscription.data.pausedAt,
    cancelled_at: subscription.data.canceledAt,
  };

  const { error: upsertError } = await supabaseAdmin
    .from('paddle_subscriptions')
    .upsert([subscriptionData]);

  if (upsertError) throw new Error(`Paddle subscription insert/update failed: ${upsertError.message}`);
  console.log(`Inserted/updated paddle subscription [${subscription.data.id}] for user [${uuid}]`);

  // TODO move this to transaction.completed event
  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  // if (createAction && subscription.default_payment_method && uuid) {
  //   //@ts-ignore
  //   await copyBillingDetailsToCustomer(
  //     uuid,
  //     subscription.default_payment_method as Stripe.PaymentMethod
  //   );
  // }
}

async function upsertPaddleCustomerToSupabase(uuid: string, customerId: string) {
  const { error } = await supabaseAdmin
    .from('paddle_customers')
    .upsert([{ id: uuid, paddle_customer_id: customerId }]);

  if (error) {
    throw new Error(`Supabase paddle customer record creation failed: ${error.message}`);
  }

  return customerId;
}

async function createCustomerInPaddle(uuid: string, email: string) {
  const customerData = { customData: { supabaseUUID: uuid }, email: email };
  const newCustomer = await paddle.customers.create(customerData)

  if (!newCustomer) {
    throw new Error('Paddle customer creation failed.');
  }

  return newCustomer.id;
}

export {
  upsertProductRecord,
  upsertPriceRecord,
  createOrRetrievePaddleCustomer,
  manageSubscriptionStatusChange,
};