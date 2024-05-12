import { Resend } from 'resend';
import Stripe from 'stripe';
import { stripe } from '@/lib/utils/stripe/config';
import { TrialEndedEmail } from '@/email/templates/trial-ended-email';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

async function sendTrialEndedEmail(subscription: Stripe.Subscription) {
  const expandedSubscription = await stripe.subscriptions.retrieve(subscription.id, {
    expand: ['customer']
  });

  const customer = expandedSubscription.customer as Stripe.Customer;

  if (customer.email) {
    await resend.emails.send({
      from: 'you@example.com',
      to: customer.email,
      subject: 'Trail ended',
      react: TrialEndedEmail()
    });
  }
}

export {
  sendTrialEndedEmail
};