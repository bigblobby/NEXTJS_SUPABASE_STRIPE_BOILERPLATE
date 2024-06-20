import Stripe from 'stripe';
import { stripe } from '@/lib/utils/stripe/config';
import {
  manageSubscriptionStatusChange,
  manageOneTimeStatusChange,
  createOrder,
} from '@/lib/utils/supabase/admin/stripe';
import { NextResponse } from "next/server";
import { sendTrialEndedEmail } from '@/lib/utils/email/server';

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.trial_will_end',
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
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          console.log(checkoutSession);

          // Handle regular subscriptions
          if (checkoutSession.mode === 'subscription') {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true
            );
          }

          // Handle life-time subscriptions
          if (checkoutSession.mode === 'payment' && checkoutSession.metadata?.payment_type === 'life_time') {
            await manageOneTimeStatusChange(
              checkoutSession,
              true
            )
          }

          // Handle regular one off payments
          if (checkoutSession.mode === 'payment' && checkoutSession.metadata?.payment_type === 'one_time') {
            await createOrder(checkoutSession);
          }

          break;
        case 'customer.subscription.trial_will_end': {
          const subscription = event.data.object as Stripe.Subscription;
          await sendTrialEndedEmail(subscription)
          break;
        }
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
