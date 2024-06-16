'use client';

import { billingConfig } from '@/lib/config/billing-config';
import type { LsSubscription, PaddleSubscription, Subscription } from '@/lib/types/supabase/table.types';
import { CheckoutButtonPaddle } from '@/lib/components/checkout-button/internal/checkout-button-paddle';
import { CheckoutButtonLs } from '@/lib/components/checkout-button/internal/checkout-button-ls';
import { CheckoutButtonStripe } from '@/lib/components/checkout-button/internal/checkout-button-stripe';
import { BillingConfigPlan } from '@/lib/types/billing.types';

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
  return (
    <>
      {billingConfig.provider === 'stripe' && (
        <CheckoutButtonStripe subscription={subscription} plan={plan} />
      )}

      {billingConfig.provider === 'paddle' && (
        <CheckoutButtonPaddle paddleSubscription={paddleSubscription} plan={plan} />
      )}

      {billingConfig.provider === 'ls' && (
        <CheckoutButtonLs lsSubscription={lsSubscription} plan={plan} />
      )}
    </>
  )
}