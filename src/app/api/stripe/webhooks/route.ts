import Stripe from 'stripe';
import { stripe } from '@/lib/utils/stripe/config';
import {
  upsertProductRecord,
  upsertPriceRecord,
  manageSubscriptionStatusChange,
  deleteProductRecord,
  deletePriceRecord
} from '@/lib/utils/supabase/admin';
import { NextResponse } from "next/server";

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'product.deleted',
  'price.created',
  'price.updated',
  'price.deleted',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted'
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return new NextResponse('Webhook secret not found.', { status: 400 });
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log(`🔔  Webhook received: ${event.type}`);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;
        case 'price.created':
        case 'price.updated':
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;
        case 'price.deleted':
          await deletePriceRecord(event.data.object as Stripe.Price);
          break;
        case 'product.deleted':
          await deleteProductRecord(event.data.object as Stripe.Product);
          break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === 'customer.subscription.created'
          );
          break;
        case 'checkout.session.completed':
          /*
           * {
           *   id: 'cs_test_b1d5KVfKi4vVgs8u0B6EFSchFLsJx5Tog0C590Ce451lKWc3F2wHM41maL',
           *   object: 'checkout.session',
           *   after_expiration: null,
           *   allow_promotion_codes: true,
           *   amount_subtotal: 10000,
           *   amount_total: 10000,
           *   automatic_tax: { enabled: false, liability: null, status: null },
           *   billing_address_collection: 'required',
           *   cancel_url: 'http://localhost:3000',
           *   client_reference_id: null,
           *   client_secret: null,
           *   consent: null,
           *   consent_collection: null,
           *   created: 1714931087,
           *   currency: 'gbp',
           *   currency_conversion: null,
           *   custom_fields: [],
           *   custom_text: {
           *     after_submit: null,
           *     shipping_address: null,
           *     submit: null,
           *     terms_of_service_acceptance: null
           *   },
           *   customer: 'cus_Q0bLPAsAlY5cGg',
           *   customer_creation: null,
           *   customer_details: {
           *     address: {
           *       city: 'London',
           *       country: 'GB',
           *       line1: '14 Vicarage Gate',
           *       line2: null,
           *       postal_code: 'W8 4AG',
           *       state: null
           *     },
           *     email: 'a@test.com',
           *     name: 'Dave Jones',
           *     phone: null,
           *     tax_exempt: 'none',
           *     tax_ids: []
           *   },
           *   customer_email: null,
           *   expires_at: 1715017487,
           *   invoice: null,
           *   invoice_creation: {
           *     enabled: false,
           *     invoice_data: {
           *       account_tax_ids: null,
           *       custom_fields: null,
           *       description: null,
           *       footer: null,
           *       issuer: null,
           *       metadata: {},
           *       rendering_options: null
           *     }
           *   },
           *   livemode: false,
           *   locale: null,
           *   metadata: {},
           *   mode: 'payment',
           *   payment_intent: 'pi_3PD97qLRGwjtCfxM0L5lnjCG',
           *   payment_link: null,
           *   payment_method_collection: 'if_required',
           *   payment_method_configuration_details: null,
           *   payment_method_options: { card: { request_three_d_secure: 'automatic' } },
           *   payment_method_types: [ 'card' ],
           *   payment_status: 'paid',
           *   phone_number_collection: { enabled: false },
           *   recovered_from: null,
           *   saved_payment_method_options: { allow_redisplay_filters: [ 'always' ], payment_method_save: null },
           *   setup_intent: null,
           *   shipping_address_collection: null,
           *   shipping_cost: null,
           *   shipping_details: null,
           *   shipping_options: [],
           *   status: 'complete',
           *   submit_type: null,
           *   subscription: null,
           *   success_url: 'http://localhost:3000/account',
           *   total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
           *   ui_mode: 'hosted',
           *   url: null
           * }
           */
          const checkoutSession = event.data.object as Stripe.Checkout.Session;

          /*
           * {
           *   object: 'list',
           *   data: [
           *     {
           *       id: 'li_1PD9MaLRGwjtCfxMEOGcKeuE',
           *       object: 'item',
           *       amount_discount: 0,
           *       amount_subtotal: 10000,
           *       amount_tax: 0,
           *       amount_total: 10000,
           *       currency: 'gbp',
           *       description: 'Life',
           *       price: [Object],
           *       quantity: 1
           *     }
           *   ],
           *   has_more: false,
           *   url: '/v1/checkout/sessions/cs_test_b1aMbIKpKzBRoR5voNOi5wbsI54f1OBBe6HkA0aQo3EIts1zJ5mAwyqcCj/line_items'
           * }
           */
          const lineItems = await stripe.checkout.sessions.listLineItems(checkoutSession.id);
          console.log(checkoutSession)
          console.log(lineItems);
          if (checkoutSession.mode === 'subscription') {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true
            );
          }
          // TODO setup checkoutSession.mode === 'payment' for one_time payments
          break;
        default:
          throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      console.log(error);
      return new NextResponse(
        'Webhook handler failed. View your Next.js function logs.',
        {
          status: 400
        }
      );
    }
  } else {
    return new NextResponse(`Unsupported event type: ${event.type}`, {
      status: 400
    });
  }

  return new NextResponse(JSON.stringify({ received: true }));
}
