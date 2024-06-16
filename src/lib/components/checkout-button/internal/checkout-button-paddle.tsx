'use client';

import { Button } from '@/lib/components/ui/button';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/lib/hooks/useUser';
import { getCheckoutView } from '@/lib/utils/paddle/settings';
import { checkoutWithPaddle } from '@/lib/utils/paddle/server';
import { usePaddle } from '@/lib/hooks/usePaddle';
import type { PaddleSubscription } from '@/lib/types/supabase/table.types';
import { usePaddleCustomerPortal } from '@/lib/hooks/usePaddleCustomerPortal';
import { formatLineItems } from '@/lib/utils/paddle/client';
import { BillingConfigPlan } from '@/lib/types/billing.types';

interface CheckoutButtonPaddleProps {
  paddleSubscription: PaddleSubscription | null;
  plan: BillingConfigPlan;
}

export function CheckoutButtonPaddle({
  paddleSubscription,
  plan,
}: CheckoutButtonPaddleProps) {
  const paddle = usePaddle();
  const router = useRouter();
  const currentPath = usePathname();
  const paddleCheckoutView = getCheckoutView();
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const { loadingPortal, goToCustomerPortal } = usePaddleCustomerPortal(paddleSubscription);

  async function handleCheckout(plan: BillingConfigPlan) {
    setLoading(true);

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

    setLoading(false);
  }

  async function handlePortal(paddleSubscription: PaddleSubscription | null){
    setLoading(true);

    if (paddleSubscription) {
      void goToCustomerPortal();
    }

    setLoading(false);
  }

  return (
    <Button
      variant="default"
      type="button"
      disabled={loading || loadingPortal}
      onClick={() => {
        if (paddleSubscription) {
          void handlePortal(paddleSubscription);
        } else {
          void handleCheckout(plan);
        }
      }}
      className="w-full mt-8"
    >
      {paddleSubscription ? 'Manage' : 'Subscribe'}
    </Button>
  )
}