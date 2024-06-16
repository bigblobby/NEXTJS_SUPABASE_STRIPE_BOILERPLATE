'use client';

import { billingSchema } from '@/lib/billing/schema';
import type { LsSubscription, PaddleSubscription, Subscription } from '@/lib/types/supabase/table.types';
import { CheckoutButtonPaddle } from '@/lib/components/checkout-button/internal/checkout-button-paddle';
import { CheckoutButtonLs } from '@/lib/components/checkout-button/internal/checkout-button-ls';
import { CheckoutButtonStripe } from '@/lib/components/checkout-button/internal/checkout-button-stripe';
import { BillingSchemaPlan } from '@/lib/types/billing.types';

interface CheckoutButtonProps {
  subscription: Subscription | null;
  lsSubscription: LsSubscription | null;
  paddleSubscription: PaddleSubscription | null;
  plan: BillingSchemaPlan;
}

export function CheckoutButton({
  subscription,
  lsSubscription,
  paddleSubscription,
  plan,
}: CheckoutButtonProps) {
  return (
    <>
      {billingSchema.provider === 'stripe' && (
        <CheckoutButtonStripe subscription={subscription} plan={plan} />
      )}

      {billingSchema.provider === 'paddle' && (
        <CheckoutButtonPaddle paddleSubscription={paddleSubscription} plan={plan} />
      )}

      {billingSchema.provider === 'ls' && (
        <CheckoutButtonLs lsSubscription={lsSubscription} plan={plan} />
      )}
    </>
  )
}