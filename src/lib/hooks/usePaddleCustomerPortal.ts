import { getURL } from '@/lib/utils/helpers';
import { getBoathousePortal } from '@/lib/api/boathouse';
import { PaddleSubscription } from '@/lib/types/supabase/table.types';
import { useState } from 'react';

export function usePaddleCustomerPortal(subscription: PaddleSubscription | null) {
  const [loadingPortal, setLoadingPortal] = useState<boolean>(false);

  async function goToCustomerPortal() {
    if (!subscription) return;

    const returnUrl = getURL('/settings');

    try {
      setLoadingPortal(true);
      const boathouse = await getBoathousePortal(
        null,
        subscription.customer_id,
        returnUrl
      );

      window.location.href = boathouse.billingPortalUrl;
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingPortal(false);
    }
  }

  return { loadingPortal, goToCustomerPortal };
}