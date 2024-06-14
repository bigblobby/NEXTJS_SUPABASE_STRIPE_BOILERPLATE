'use client';

import { Button } from '@/lib/components/ui/button';
import { useEffect, useState } from 'react';
import { checkoutWithStripe, createStripePortal } from '@/lib/utils/stripe/server';
import toast from 'react-hot-toast';
import { StripeCheckoutView } from '@/lib/enums/stripe.enums';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/lib/hooks/useUser';
import { getCheckoutView as getStripeCheckoutView } from '@/lib/utils/stripe/settings';
import { getCheckoutView as getPaddleCheckoutView } from '@/lib/utils/paddle/settings';
import { getStripe } from '@/lib/utils/stripe/client';
import CheckoutDrawerModal from '@/lib/components/checkout-drawer-modal';
import { billingConfig, BillingConfigPlan } from '@/lib/config/billing-config';
import { checkoutWithPaddle } from '@/lib/utils/paddle/server';
import { usePaddle } from '@/lib/hooks/usePaddle';
import { checkoutWithLS } from '@/lib/utils/lemon-squeezy/server';
import type { LsSubscription, PaddleSubscription, Subscription } from '@/lib/types/supabase/table.types';
import { SubscriptionUrls } from '@/lib/types/lemon-squeezy/subscription.types';
import { usePaddleCustomerPortal } from '@/lib/hooks/usePaddleCustomerPortal';
import { formatLineItems } from '@/lib/utils/paddle/client';

const stripePromise = getStripe();

interface CheckoutButtonProps {
  subscription: Subscription | null;
  lsSubscription: LsSubscription | null;
  paddleSubscription: PaddleSubscription | null;
  plan: BillingConfigPlan;
}

export function CheckoutButton({
  subscription,
  lsSubscription,
  paddleSubscription,
  plan,
}: CheckoutButtonProps) {
  const paddle = usePaddle();
  const router = useRouter();
  const currentPath = usePathname();
  const stripeCheckoutView = getStripeCheckoutView();
  const paddleCheckoutView = getPaddleCheckoutView();
  const [loading, setLoading] = useState(true);
  const user = useUser();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { loadingPortal, goToCustomerPortal } = usePaddleCustomerPortal(paddleSubscription);
  const [options, setOptions] = useState<{
    clientSecret?: string | null;
    fetchClientSecret?: (() => Promise<string>) | null;
    onComplete?: () => void;
  }>();

  useEffect(() => {
    if (!checkoutOpen) {
      setLoading(false);
    }
  }, [checkoutOpen]);

  async function handleCheckout(plan: BillingConfigPlan) {
    setLoading(true);

    if (billingConfig.provider === 'stripe') {
      if (!user) {
        setLoading(false);
        return router.push('/signin/signup');
      }

      const { error, clientSecret, sessionId } = await checkoutWithStripe(plan, stripeCheckoutView);

      if (error) {
        setLoading(false);
        toast.error(error);
        return router.push(currentPath);
      }

      if (stripeCheckoutView === StripeCheckoutView.Embedded && clientSecret) {
        setOptions({ fetchClientSecret: () => Promise.resolve(clientSecret) })
        setCheckoutOpen(true)
      }

      if (stripeCheckoutView === StripeCheckoutView.Hosted && sessionId) {
        const stripe = await stripePromise;
        stripe?.redirectToCheckout({ sessionId });
      }
    }

    if (billingConfig.provider === 'paddle') {
      if (!user) {
        setLoading(false);
        return router.push('/signin/signup');
      }

      const { error, customer } = await checkoutWithPaddle();

      if (error) {
        setLoading(false);
        toast.error(error);
        return router.push(currentPath);
      }

      if (customer) {
        paddle?.Checkout.open({
          settings: {
            displayMode: paddleCheckoutView,
            allowLogout: false,
          },
          items: formatLineItems(plan.lineItems),
          customer: {
            id: customer,
          }
        });
      }
    }

    if (billingConfig.provider === 'ls') {
      const { data: url, error } = await checkoutWithLS(plan);

      if (error) {
        toast.error(error);
      }

      if (url) {
        router.push(url);
      }
    }

    setLoading(false);
  }

  async function handlePortal(subscription: Subscription | null, lsSubscription: LsSubscription | null, paddleSubscription: PaddleSubscription | null){
    setLoading(true);

    if (billingConfig.provider === 'stripe' && subscription) {
      const { url, error } = await createStripePortal();
      if (url) {
        return router.push(url);
      }

      if (error) {
        toast.error(error);
      }
    }

    if (billingConfig.provider === 'paddle' && paddleSubscription) {
      void goToCustomerPortal();
    }

    if (billingConfig.provider === 'ls' && lsSubscription) {
      if (lsSubscription.urls) {
        const urls = lsSubscription?.urls as unknown as SubscriptionUrls;
        router.push(urls?.customer_portal)
      }
    }

    setLoading(false);
  }

  return (
    <>
      {stripeCheckoutView === StripeCheckoutView.Embedded && (
        <CheckoutDrawerModal
          open={checkoutOpen}
          setOpen={setCheckoutOpen}
          stripePromise={stripePromise}
          options={options}
        />
      )}
      <Button
        variant="default"
        type="button"
        disabled={loading}
        onClick={() => {
          if (subscription || lsSubscription || paddleSubscription) {
            void handlePortal(subscription, lsSubscription, paddleSubscription);
          } else {
            void handleCheckout(plan);
          }
        }}
        className="w-full mt-8"
      >
        {subscription || lsSubscription || paddleSubscription ? 'Manage' : 'Subscribe'}
      </Button>
    </>
  )
}