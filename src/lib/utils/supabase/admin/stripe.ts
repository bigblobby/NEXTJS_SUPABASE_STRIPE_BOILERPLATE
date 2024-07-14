'use server';

import type { Json } from '@/lib/types/supabase/types_db';
import { Order, Subscription } from '@/lib/types/supabase/table.types';
import Stripe from 'stripe';
import { toDateTime } from '@/lib/utils/helpers';
import { stripe } from '@/lib/utils/stripe/config';
import { getCustomerByIdQuery, getCustomerByCustomerIdQuery, upsertCustomerQuery, updateCustomerByIdQuery } from '@/lib/utils/supabase/admin/queries/stripe/customer-queries';
import { upsertSubscriptionQuery } from '@/lib/utils/supabase/admin/queries/stripe/subscription-queries';
import { updateUserQuery } from '@/lib/utils/supabase/admin/queries/general/user-queries';
import { createOrderQuery } from '@/lib/utils/supabase/admin/queries/stripe/order-queries';

async function createOrRetrieveCustomer({
  email,
  uuid
}: {
  email: string;
  uuid: string;
}) {
  const existingSupabaseCustomer = await getCustomerByIdQuery(uuid);

  // Retrieve the Stripe customer ID using the Supabase customer ID, with email fallback
  let stripeCustomerId: string | undefined;

  if (existingSupabaseCustomer?.stripe_customer_id) {
    const existingStripeCustomer = await stripe.customers.retrieve(existingSupabaseCustomer.stripe_customer_id);
    stripeCustomerId = existingStripeCustomer.id;
  } else {
    // If Stripe ID is missing from Supabase, try to retrieve Stripe customer ID by email
    const stripeCustomers = await stripe.customers.list({ email: email });
    stripeCustomerId = stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
  }

  // If still no stripeCustomerId, create a new customer in Stripe
  const stripeIdToInsert = stripeCustomerId ? stripeCustomerId : await createCustomerInStripe(uuid, email);

  if (!stripeIdToInsert) {
    throw new Error('Stripe customer creation failed.');
  }

  if (existingSupabaseCustomer && stripeCustomerId) {
    // If Supabase has a record but doesn't match Stripe, update Supabase record
    if (existingSupabaseCustomer.stripe_customer_id !== stripeCustomerId) {
      await updateCustomerByIdQuery(uuid, { stripe_customer_id: stripeCustomerId });
      console.warn(`Supabase customer record mismatched Stripe ID. Supabase record updated.`);
    }
    // If Supabase has a record and matches Stripe, return Stripe customer ID
    return stripeCustomerId;
  } else {
    console.warn(`Supabase customer record was missing. A new record was created.`);

    // If Supabase has no record, create a new record and return Stripe customer ID
    const upsertedStripeCustomer = await upsertCustomerQuery(uuid, stripeIdToInsert);

    if (!upsertedStripeCustomer) {
      throw new Error('Supabase customer record creation failed.');
    }

    return upsertedStripeCustomer;
  }
}

async function manageSubscriptionStatusChange(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {
  // Get customer's UUID from mapping table.
  const customerData = await getCustomerByCustomerIdQuery(customerId);
  const { id: uuid } = customerData!;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method']
  });

  // Upsert the latest status of the subscription object.
  const subscriptionData: Subscription = {
    id: subscription.id,
    user_id: uuid,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    //TODO check quantity on subscription
    // @ts-ignore
    quantity: subscription.quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at ? toDateTime(subscription.cancel_at).toISOString() : null,
    canceled_at: subscription.canceled_at ? toDateTime(subscription.canceled_at).toISOString() : null,
    current_period_start: toDateTime(subscription.current_period_start).toISOString(),
    current_period_end: toDateTime(subscription.current_period_end).toISOString(),
    created: toDateTime(subscription.created).toISOString(),
    ended_at: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
    trial_start: subscription.trial_start ? toDateTime(subscription.trial_start).toISOString() : null,
    trial_end: subscription.trial_end ? toDateTime(subscription.trial_end).toISOString() : null
  };

  await upsertSubscriptionQuery(subscriptionData);
  console.log(`Inserted/updated subscription [${subscription.id}] for user [${uuid}]`);

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid) {
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
  }
}

async function manageOneTimeStatusChange(
  checkoutSession: Stripe.Checkout.Session,
  createAction = false
) {
  const customerData = await getCustomerByCustomerIdQuery(checkoutSession.customer as string);
  const { id: uuid } = customerData;
  const lineItems = await stripe.checkout.sessions.listLineItems(checkoutSession.id);
  const product: Stripe.LineItem = lineItems.data[0];

  const session = await stripe.checkout.sessions.retrieve(
    checkoutSession.id,
    {
      expand: ['payment_intent.payment_method'],
    }
  );

  // Upsert the latest status of the subscription object.
  const subscriptionData: Subscription = {
    id: checkoutSession.payment_intent as string,
    user_id: uuid,
    metadata: checkoutSession.metadata,
    status: 'active',
    price_id: product.price?.id ?? null,
    quantity: 1,
    cancel_at_period_end: null,
    cancel_at: null,
    canceled_at: null,
    current_period_start: toDateTime(checkoutSession.created).toISOString(),
    current_period_end: toDateTime(4102444799).toISOString(),
    created: toDateTime(checkoutSession.created).toISOString(),
    ended_at: null,
    trial_start: null,
    trial_end: null
  };

  await upsertSubscriptionQuery(subscriptionData);
  console.log(`Inserted/updated life time subscription [${checkoutSession.payment_intent}] for user [${uuid}]`);

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && session.payment_intent && uuid) {
    //@ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      (session.payment_intent as Stripe.PaymentIntent).payment_method as Stripe.PaymentMethod,
      false
    );
  }
}

async function createOrder(checkoutSession: Stripe.Checkout.Session) {
  const customerData = await getCustomerByCustomerIdQuery(checkoutSession.customer as string);
  const { id: uuid } = customerData;
  const lineItems = await stripe.checkout.sessions.listLineItems(checkoutSession.id);

  const orderData: Order = {
    id: checkoutSession.payment_intent as string,
    user_id: uuid,
    metadata: {} as Json,
    items: lineItems.data as unknown as Json,
    created: checkoutSession.created.toString(),
    total: checkoutSession.amount_total,
  };

  await createOrderQuery(orderData);
  console.log(`Inserted/updated order [${checkoutSession.payment_intent}] for user [${uuid}]`);
}

async function createCustomerInStripe(uuid: string, email: string) {
  const customerData = { metadata: { supabaseUUID: uuid }, email: email };
  const newCustomer = await stripe.customers.create(customerData);

  if (!newCustomer) {
    throw new Error('Stripe customer creation failed.');
  }

  return newCustomer.id;
}

/**
 * Copies the billing details from the payment method to the customer object.
 */
async function copyBillingDetailsToCustomer(
  uuid: string,
  payment_method: Stripe.PaymentMethod,
  updateCustomer: boolean = true
) {
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  const params: { name?: string, phone?: string, address?: Stripe.Address } = {};
  if (name) params.name = name;
  if (phone) params.phone = phone;
  if (address) params.address = address;

  if (updateCustomer) {
    //@ts-ignore
    await stripe.customers.update(customer, params);
  }

  await updateUserQuery(uuid, {
    billing_address: { ...address },
    payment_method: { ...payment_method[payment_method.type] } as Json
  });
}

export {
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
  manageOneTimeStatusChange,
  createOrder,
};
