'use client';

import type { LsSubscription, PaddleSubscription, SubscriptionWithProduct, User } from '@/lib/types/supabase/table.types';
import { type User as AuthUser } from '@supabase/supabase-js';
import { Heading } from '@/lib/components/ui/heading';
import { Text } from '@/lib/components/ui/text';
import CustomerPortalForm from '@/lib/components/forms/account/customer-portal-form';
import PaddleCustomerPortalForm from '@/lib/components/forms/account/paddle-customer-portal-form';
import NameForm from '@/lib/components/forms/account/name-form';
import EmailForm from '@/lib/components/forms/account/email-form';
import { usePaddle } from '@/lib/hooks/usePaddle';
import { AppConfig } from '@/lib/config/app-config';
import { useEffect } from 'react';
import LsCustomerPortalForm from '@/lib/components/forms/account/ls-portal-form';

interface AccountPageContentProps {
  authUser: AuthUser;
  user: User;
  subscription: SubscriptionWithProduct | null;
  paddleSubscription: PaddleSubscription | null;
  lsSubscription: LsSubscription | null;
  transactionId?: string | null;
}

export default function AccountPageContent({
  authUser,
  user,
  subscription,
  paddleSubscription,
  lsSubscription,
  transactionId,
}: AccountPageContentProps){
  if (AppConfig.payments === 'paddle' && transactionId) {
    const paddle = usePaddle();
    useEffect(() => {
      paddle?.Checkout.open({
        transactionId: transactionId,
      });
    }, [transactionId]);
  }

  return (
    <section className="mb-32">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <Heading className="sm:text-center sm:text-6xl">Account</Heading>
          <Text className="max-w-2xl m-auto mt-5 text-xl sm:text-center sm:text-2xl">We partnered with Stripe for a simplified billing.</Text>
        </div>
      </div>
      <div className="p-4 space-y-8">
        {AppConfig.payments === 'paddle' && (
          <PaddleCustomerPortalForm paddleSubscription={paddleSubscription} />
        )}
        {AppConfig.payments === 'stripe' && (
          <CustomerPortalForm subscription={subscription} />
        )}
        {AppConfig.payments === 'ls' && (
          <LsCustomerPortalForm lsSubscription={lsSubscription} />
        )}
        <NameForm userName={user?.full_name ?? ''} />
        <EmailForm userEmail={authUser.email} />
      </div>
    </section>
  );
}