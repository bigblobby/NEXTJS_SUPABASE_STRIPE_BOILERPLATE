'use client';

import { Button } from '@/lib/components/ui/button';
import { useEffect, useState } from 'react';
import { checkoutWithStripe, createStripePortal } from '@/lib/utils/stripe/server';
import toast from 'react-hot-toast';
import { StripeCheckoutView } from '@/lib/enums/stripe.enums';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/lib/hooks/useUser';
import { getCheckoutView as getStripeCheckoutView } from '@/lib/utils/stripe/settings';
import { getStripe } from '@/lib/utils/stripe/client';
import CheckoutDrawerModal from '@/lib/components/checkout-drawer-modal';
import type { Subscription } from '@/lib/types/supabase/table.types';
import { BillingSchemaPlan } from '@/lib/types/billing.types';

const stripePromise = getStripe();

interface CheckoutButtonStripeProps {
  subscription: Subscription | null;
  plan: BillingSchemaPlan;
}

export function CheckoutButtonStripe({
  subscription,
  plan,
}: CheckoutButtonStripeProps) {
  const router = useRouter();
  const currentPath = usePathname();
  const stripeCheckoutView = getStripeCheckoutView();
  const [loading, setLoading] = useState(true);
  const user = useUser();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
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

  async function handleCheckout(plan: BillingSchemaPlan) {
    setLoading(true);

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

    setLoading(false);
  }

  async function handlePortal(subscription: Subscription | null){
    setLoading(true);

    if (subscription) {
      const { url, error } = await createStripePortal();
      if (url) {
        return router.push(url);
      }

      if (error) {
        toast.error(error);
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
          if (subscription) {
            void handlePortal(subscription);
          } else {
            void handleCheckout(plan);
          }
        }}
        className="w-full mt-8"
      >
        {subscription ? 'Manage' : 'Subscribe'}
      </Button>
    </>
  )
}