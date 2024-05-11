'use server';

import Stripe from 'stripe';
import type { Price } from '@/lib/types/supabase/table.types';
import { stripe } from '@/lib/utils/stripe/config';
import { createClient } from '@/lib/utils/supabase/server';
import { createOrRetrieveCustomer } from '@/lib/utils/supabase/admin/stripe';
import { calculateTrialDays, calculateTrialEndUnixTimestamp, getURL } from '@/lib/utils/helpers';
import { CheckoutView } from '@/lib/enums/stripe.enums';
import { AppConfig } from '@/lib/config/app-config';

interface CheckoutResponse {
  error?: string;
  sessionId?: string;
  clientSecret?: string | null;
}

export async function checkoutWithStripe(
  price: Price,
  checkoutView: CheckoutView
): Promise<CheckoutResponse> {
  try {
    const supabase = createClient();
    const {
      error,
      data: { user }
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(error);
      throw new Error('Could not get user session.');
    }

    // Retrieve or create the customer in Stripe
    let customer: string;

    try {
      customer = await createOrRetrieveCustomer({
        uuid: user?.id || '',
        email: user?.email || ''
      });
    } catch (err) {
      console.error(err);
      throw new Error('Unable to access customer record.');
    }

    let params: Stripe.Checkout.SessionCreateParams = {
      ui_mode: checkoutView,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer,
      customer_update: {
        address: 'auto'
      },
      line_items: [
        {
          price: price.id,
          quantity: 1
        }
      ],
      return_url: checkoutView === CheckoutView.Embedded ? getURL(`/purchase-confirmation?session_id={CHECKOUT_SESSION_ID}`) : undefined,
      cancel_url: checkoutView === CheckoutView.Hosted ? getURL() : undefined,
      success_url: checkoutView === CheckoutView.Hosted ? getURL(`/purchase-confirmation?session_id={CHECKOUT_SESSION_ID}`) : undefined,
    };

    console.log('Trial end:', calculateTrialEndUnixTimestamp(price.trial_period_days));
    if (price.type === 'recurring') {
      params = {
        ...params,
        mode: 'subscription',
        subscription_data: {
          trial_settings: {
            end_behavior: {
              missing_payment_method: 'pause',
            },
          },
          trial_period_days: calculateTrialDays(price.trial_period_days),
          // trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days)
        },
        payment_method_collection: price.trial_period_days && !AppConfig.trialPeriodCollectCard ? 'if_required' : 'always',
      };
    } else if (price.type === 'one_time') {
      params = {
        ...params,
        mode: 'payment'
      };
    }

    // Create a checkout session in Stripe
    let session;
    try {
      session = await stripe.checkout.sessions.create(params);
    } catch (err) {
      console.error(err);
      throw new Error('Unable to create checkout session.');
    }

    // Instead of returning a Response, just return the data or error.
    if (session) {
      return { clientSecret: session.client_secret, sessionId: session.id };
    } else {
      throw new Error('Unable to create checkout session.');
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: 'An unknown error occurred. Please try again later or contact a system administrator.' };
    } else {
      return { error: 'An unknown error occurred. Please try again later or contact a system administrator.' };
    }
  }
}

export async function getCurrentStripeSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return { status: session.status, email: session.customer_details?.email };
  } catch (err) {
    console.log(err);
    throw new Error('Could not get user session.');
  }
}

export async function createStripePortal() {
  try {
    const supabase = createClient();
    const {
      error,
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      if (error) {
        console.error(error);
      }
      throw new Error('Could not get user session.');
    }

    let customer;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user.id || '',
        email: user.email || ''
      });
    } catch (err) {
      console.error(err);
      throw new Error('Unable to access customer record.');
    }

    if (!customer) {
      throw new Error('Could not get customer.');
    }

    try {
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: getURL('/account')
      });

      if (!url) {
        throw new Error('Could not create billing portal');
      }

      return { url };
    } catch (err) {
      console.error(err);
      throw new Error('Could not create billing portal');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return { error: `${error.message} - Please try again later or contact a system administrator.` };
    } else {
      return { error: 'An unknown error occurred. - Please try again later or contact a system administrator.' };
    }
  }
}
