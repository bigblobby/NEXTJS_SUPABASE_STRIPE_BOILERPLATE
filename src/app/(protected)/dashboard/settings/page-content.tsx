'use client';

import type { Account } from '@/lib/types/supabase/table.types';
import { type User as AuthUser } from '@supabase/supabase-js';
import NameForm from '@/lib/components/forms/account/name-form';
import EmailForm from '@/lib/components/forms/account/email-form';
import { usePaddle } from '@/lib/hooks/usePaddle';
import { AppConfig } from '@/lib/config/app-config';
import { useEffect } from 'react';

interface AccountPageContentProps {
  authUser: AuthUser;
  user: Account;
  transactionId?: string | null;
}

export default function SettingsPageContent({
  authUser,
  user,
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
    <div className="space-y-6">
      <NameForm name={user?.name ?? ''} />
      <EmailForm email={authUser.email ?? ''} />
    </div>
  )
}