import { supabaseAdmin } from '@/lib/utils/supabase/admin/index';
import { createLsCustomer, getCustomerById } from '@/lib/utils/lemon-squeezy/server';
import { NewCustomer } from '@lemonsqueezy/lemonsqueezy.js';
import { LsSubscription } from '@/lib/types/supabase/table.types';

async function createOrRetrieveLsCustomer({
  storeId,
  email,
  uuid
}: {
  storeId: string;
  email: string;
  uuid: string;
}) {
  // Check if the customer already exists in Supabase
  const { data: existingSupabaseCustomer, error: queryError } =
    await supabaseAdmin
      .from('ls_customers')
      .select('*')
      .eq('id', uuid)
      .maybeSingle();

  if (queryError) {
    throw new Error(`Supabase Lemon Squeezy customer lookup failed: ${queryError.message}`);
  }

  // Retrieve the Lemon Squeezy customer ID using the Supabase customer ID, with email fallback
  let lsCustomerId: string | undefined;

  if (existingSupabaseCustomer?.ls_customer_id) {
    const existingLsCustomer = await getCustomerById(existingSupabaseCustomer.ls_customer_id);
    if (existingLsCustomer.data) {
      lsCustomerId = existingLsCustomer.data.data.id;
    }
  }

  // If still no lsCustomerId, create a new customer in Lemon Squeezy
  const lsIdToInsert = lsCustomerId ? lsCustomerId : await createCustomerInLs(storeId, email);

  if (!lsIdToInsert) {
    throw new Error('Lemon Squeezy customer creation failed.');
  }

  if (existingSupabaseCustomer && lsCustomerId) {
    // If Supabase has a record but doesn't match Lemon Squeezy, update Supabase record
    if (existingSupabaseCustomer.ls_customer_id !== lsCustomerId) {
      const { error: updateError } = await supabaseAdmin
        .from('ls_customers')
        .update({ ls_customer_id: lsCustomerId })
        .eq('id', uuid);

      if (updateError) {
        throw new Error(`Supabase Lemon Squeezy customer record update failed: ${updateError.message}`);
      }

      console.warn(`Supabase Lemon Squeezy customer record mismatched Lemon Squeezy ID. Supabase record updated.`);
    }

    // If Supabase has a record and matches Lemon Squeezy, return Lemon Squeezy customer ID
    return lsCustomerId;
  } else {
    console.warn(`Supabase Lemon Squeezy customer record was missing. A new record was created.`);

    // If Supabase has no record, create a new record and return Lemon Squeezy customer ID
    const upsertedLsCustomerId = await upsertLsCustomerToSupabase(uuid, lsIdToInsert);

    if (!upsertedLsCustomerId) {
      throw new Error('Supabase Lemon Squeezy customer record creation failed.');
    }

    return upsertedLsCustomerId;
  }
}

async function manageSubscriptionChange(subscription: any) {
  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from('ls_customers')
    .select('id')
    .eq('ls_customer_id', subscription.customer_id)
    .single();

  if (noCustomerError) {
    throw new Error(`Customer lookup failed: ${noCustomerError.message}`);
  }

  const { id: uuid } = customerData!;

  // Upsert the latest status of the subscription object.
  const subscriptionData: LsSubscription = {
    id: subscription.first_subscription_item.subscription_id,
    user_id: uuid,
    customer_id: subscription.customer_id,
    store_id: subscription.store_id,
    order_id: subscription.order_id,
    order_item_id: subscription.order_item_id,
    product_id: subscription.product_id,
    variant_id: subscription.variant_id,
    user_name: subscription.user_name,
    user_email: subscription.user_email,
    cancelled: subscription.cancelled,
    status: subscription.status,
    pause: subscription.pause,
    card_brand: subscription.card_brand,
    card_last_four: subscription.card_last_four,
    first_subscription_item: subscription.first_subscription_item,
    billing_anchor: subscription.billing_anchor,
    urls: subscription.urls,
    trial_ends_at: subscription.trial_ends_at,
    renews_at: subscription.renews_at,
    ends_at: subscription.ends_at,
    updated_at: subscription.updated_at,
    created_at: subscription.created_at,
  };

  const { error: upsertError } = await supabaseAdmin
    .from('ls_subscriptions')
    .upsert([subscriptionData]);

  if (upsertError) throw new Error(`Lemon Squeezy subscription insert/update failed: ${upsertError.message}`);
  console.log(`Inserted/updated Lemon Squeezy subscription [${subscription.first_subscription_item.subscription_id}] for user [${uuid}]`);
}

async function upsertLsCustomerToSupabase(uuid: string, customerId: string) {
  const { error } = await supabaseAdmin
    .from('ls_customers')
    .upsert([{ id: uuid, ls_customer_id: customerId }]);

  if (error) {
    throw new Error(`Supabase Lemon Squeezy customer record creation failed: ${error.message}`);
  }

  return customerId;
}

async function createCustomerInLs(storeId: string, email: string) {
  const customerData = { email: email, name: email };
  const newCustomer = await createLsCustomer(storeId, customerData as NewCustomer)

  if (!newCustomer.data) {
    throw new Error('Lemon Squeezy customer creation failed.');
  }

  return newCustomer.data.data.id;
}

export {
  createOrRetrieveLsCustomer,
  manageSubscriptionChange,
}