'use client';

import { Button } from '@/lib/components/ui/button';
import { useEffect, useState } from 'react';
import { checkoutWithStripe, createStripePortal } from '@/lib/utils/stripe/server';
import toast from 'react-hot-toast';
import { StripeCheckoutView } from '@/lib/enums/stripe.enums';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/lib/hooks/useUser';
import { getCheckoutView } from '@/lib/utils/stripe/settings';
import { getStripe } from '@/lib/utils/stripe/client';
import CheckoutDrawerModal from '@/lib/components/checkout-drawer-modal';

const stripePromise = getStripe();

export function CheckoutButton({
  subscription,
  plan,
}: any){
  const router = useRouter();
  const currentPath = usePathname();
  const checkoutView = getCheckoutView();
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

  async function handleStripeCheckout(plan: any) {
    setLoading(true);

    if (!user) {
      setLoading(false);
      return router.push('/signin/signup');
    }

    const { error, clientSecret, sessionId } = await checkoutWithStripe(plan, checkoutView);

    if (error) {
      setLoading(false);
      toast.error(error);
      return router.push(currentPath);
    }

    if (checkoutView === StripeCheckoutView.Embedded && clientSecret) {
      setOptions({ fetchClientSecret: () => Promise.resolve(clientSecret) })
      setCheckoutOpen(true)
    }

    if (checkoutView === StripeCheckoutView.Hosted && sessionId) {
      const stripe = await stripePromise;
      stripe?.redirectToCheckout({ sessionId });
    }

    setLoading(false);
  }

  async function handlePortal(){
    setLoading(true);

    const { url, error} = await createStripePortal();
    if (url) {
      return router.push(url);
    }

    if (error) {
      toast.error(error);
    }

    setLoading(false);
  }

  return (
    <>
      {checkoutView === StripeCheckoutView.Embedded && (
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
            void handlePortal();
          } else {
            void handleStripeCheckout(plan)
          }
        }}
        className="w-full mt-8"
      >
        {subscription ? 'Manage' : 'Subscribe'}
      </Button>
    </>
  )
}