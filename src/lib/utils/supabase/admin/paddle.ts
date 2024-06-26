'use server';

import type { PaddleSubscription } from '@/lib/types/supabase/table.types';
import { Json } from '@/lib/types/supabase/types_db';
import {
  SubscriptionCreatedEvent,
  SubscriptionUpdatedEvent,
  TransactionCompletedEvent
} from '@paddle/paddle-node-sdk/dist/types/notifications/events';
import { paddle } from '@/lib/utils/paddle/config';
import { EventName } from '@paddle/paddle-node-sdk';
import { getAddressById } from '@/lib/utils/paddle/server';
import { getCustomerByCustomerIdQuery, getCustomerByIdQuery, updateCustomerByIdQuery, upsertCustomerQuery } from '@/lib/utils/supabase/admin/queries/paddle/customer-queries';
import { getSubscriptionByIdQuery, upsertSubscriptionQuery } from '@/lib/utils/supabase/admin/queries/paddle/subscription-queries';
import { updateUserQuery } from '@/lib/utils/supabase/admin/queries/general/user-queries';

async function createOrRetrievePaddleCustomer(uuid: string, email: string) {
  const existingSupabaseCustomer = await getCustomerByIdQuery(uuid);
  let paddleCustomerId: string | undefined;

  if (existingSupabaseCustomer?.paddle_customer_id) {
    const existingPaddleCustomer = await paddle.customers.get(existingSupabaseCustomer.paddle_customer_id);
    paddleCustomerId = existingPaddleCustomer.id;
  }

  const paddleIdToInsert = paddleCustomerId ? paddleCustomerId : await createCustomerInPaddle(uuid, email);

  if (existingSupabaseCustomer && paddleCustomerId) {
    if (existingSupabaseCustomer.paddle_customer_id !== paddleCustomerId) {
      await updateCustomerByIdQuery(uuid, { paddle_customer_id: paddleCustomerId });
      console.warn(`Supabase paddle customer record mismatched Paddle ID. Supabase record updated.`);
    }
  } else {
    paddleCustomerId = await upsertCustomerQuery(uuid, paddleIdToInsert);
    console.warn(`Supabase paddle customer record was missing. A new record was created.`);
  }

  return paddleCustomerId;
}

async function manageSubscriptionStatusChange(
  subscription: SubscriptionCreatedEvent | SubscriptionUpdatedEvent,
) {
  const customer = await getCustomerByCustomerIdQuery(subscription.data.customerId);

  // We need to make sure we don't overwrite the transactionId
  // as it is omitted from all events except EventName.SubscriptionCreated
  let transactionId;
  if (subscription.eventType !== EventName.SubscriptionCreated) {
    const storedSubscription = await getSubscriptionByIdQuery(subscription.data.id);
    transactionId = storedSubscription?.transaction_id;
  } else {
    transactionId = subscription.data?.transactionId;
  }

  const subscriptionData: PaddleSubscription = {
    id: subscription.data.id,
    user_id: customer.id,
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

  await upsertSubscriptionQuery(subscriptionData);
  console.log(`Inserted/updated paddle subscription [${subscription.data.id}] for user [${customer.id}]`);
}

async function copyBillingDetailsCustomer(transaction: TransactionCompletedEvent) {
  const customer = await getCustomerByCustomerIdQuery(transaction.data.customerId!);
  let address = null;

  if (transaction.data.customerId && transaction.data.addressId) {
    address = await getAddressById(transaction.data.customerId, transaction.data.addressId);
  }

  await updateUserQuery(customer.id, {
    billing_address: address,
    payment_method: transaction.data.payments as unknown as Json
  })
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
  createOrRetrievePaddleCustomer,
  manageSubscriptionStatusChange,
  copyBillingDetailsCustomer,
};