'use client';

import NameForm from '@/lib/components/forms/account/name-form';
import { usePaddle } from '@/lib/hooks/usePaddle';
import { AppConfig } from '@/lib/config/app-config';
import { useEffect } from 'react';
import { useCurrentAccount } from '@/lib/hooks/useCurrentAccount';

interface AccountPageContentProps {
  transactionId?: string | null;
}

export default function SettingsPageContent({
  transactionId,
}: AccountPageContentProps){
  const currentAccount = useCurrentAccount();

  if (AppConfig.payments === 'paddle' && transactionId) {
    const paddle = usePaddle();
    useEffect(() => {
      paddle?.Checkout.open({
        transactionId: transactionId,
      });
    }, [transactionId]);
  }

  return (
    <div className="space-y-6">
      <NameForm title={'Team Name'} subTitle={'This is your teams display name.'} name={currentAccount?.name ?? ''} />
    </div>
  )
}