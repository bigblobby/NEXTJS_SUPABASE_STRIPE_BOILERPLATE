'use client';

import type { LsSubscription, PaddleSubscription, Subscription } from '@/lib/types/supabase/table.types';
import CustomerPortalForm from '@/lib/components/forms/account/customer-portal-form';
import PaddleCustomerPortalForm from '@/lib/components/forms/account/paddle-customer-portal-form';
import { AppConfig } from '@/lib/config/app-config';
import LsCustomerPortalForm from '@/lib/components/forms/account/ls-portal-form';

interface SettingsBillingPageContentsProps {
  subscription: Subscription | null;
  paddleSubscription: PaddleSubscription | null;
  lsSubscription: LsSubscription | null;
}

export default function SettingsBillingPageContents({
  subscription,
  paddleSubscription,
  lsSubscription,
}: SettingsBillingPageContentsProps){
  return (
    <div>
      {AppConfig.payments === 'paddle' && (
        <PaddleCustomerPortalForm paddleSubscription={paddleSubscription} />
      )}
      {AppConfig.payments === 'stripe' && (
        <CustomerPortalForm subscription={subscription} />
      )}
      {AppConfig.payments === 'ls' && (
        <LsCustomerPortalForm lsSubscription={lsSubscription} />
      )}
    </div>
  );
}