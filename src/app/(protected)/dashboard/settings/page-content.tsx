'use client';

import NameForm from '@/lib/components/forms/account/name-form';
import EmailForm from '@/lib/components/forms/account/email-form';
import { usePaddle } from '@/lib/hooks/usePaddle';
import { AppConfig } from '@/lib/config/app-config';
import { useEffect } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { useAccounts } from '@/lib/hooks/useAccounts';

interface AccountPageContentProps {
  transactionId?: string | null;
}

export default function SettingsPageContent({
  transactionId,
}: AccountPageContentProps){
  const user = useUser();
  const accounts = useAccounts();
  const personalAccount = accounts?.find((acc) => acc.personal_account);

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
      <NameForm name={personalAccount?.name ?? ''} />
      <EmailForm email={user?.email ?? ''} />
    </div>
  )
}