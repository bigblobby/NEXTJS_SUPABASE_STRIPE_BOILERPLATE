'use client';

import { Button } from '@/lib/components/ui/button';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { checkoutWithLS } from '@/lib/utils/lemon-squeezy/server';
import type { LsSubscription } from '@/lib/types/supabase/table.types';
import { SubscriptionUrls } from '@/lib/types/lemon-squeezy/subscription.types';
import { BillingSchemaPlan } from '@/lib/types/billing.types';

interface CheckoutButtonLsProps {
  lsSubscription: LsSubscription | null;
  plan: BillingSchemaPlan;
}

export function CheckoutButtonLs({
  lsSubscription,
  plan,
}: CheckoutButtonLsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCheckout(plan: BillingSchemaPlan) {
    setLoading(true);

    const { data: url, error } = await checkoutWithLS(plan);

    if (error) {
      toast.error(error);
    }

    if (url) {
      router.push(url);
    }

    setLoading(false);
  }

  async function handlePortal(lsSubscription: LsSubscription | null){
    setLoading(true);

    if (lsSubscription) {
      if (lsSubscription.urls) {
        const urls = lsSubscription?.urls as unknown as SubscriptionUrls;
        router.push(urls?.customer_portal)
      }
    }

    setLoading(false);
  }

  return (
    <Button
      variant="default"
      type="button"
      disabled={loading}
      onClick={() => {
        if (lsSubscription) {
          void handlePortal(lsSubscription);
        } else {
          void handleCheckout(plan);
        }
      }}
      className="w-full mt-8"
    >
      {lsSubscription ? 'Manage' : 'Subscribe'}
    </Button>
  )
}