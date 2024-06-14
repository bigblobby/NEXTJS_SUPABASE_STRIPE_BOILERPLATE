'use client';

import React, { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { getCustomerIdAndTransactionStatusByTransactionById, getCustomerById } from '@/lib/utils/paddle/server';
import { Container } from '@/lib/components/ui/container';
import { Heading } from '@/lib/components/ui/heading';
import { Text } from '@/lib/components/ui/text';
import { Button } from '@/lib/components/ui/button';
import Link from 'next/link';
import { sleep } from '@/lib/utils/timers';
import { Spinner } from '@/lib/components/ui/spinner';

interface PaddlePurchaseConfirmationProps {
  transactionId?: string;
}

export default function PaddlePurchaseConfirmation({ transactionId }: PaddlePurchaseConfirmationProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string | null | undefined>('');
  const router = useRouter();

  useEffect(() => {
    async function init(){
      if (!transactionId) {
        redirect('/');
      }

      const transaction = await getCustomerIdAndTransactionStatusByTransactionById(transactionId);
      if (transaction.customerId && transaction.status) {
        const customer = await getCustomerById(transaction.customerId);
        setCustomerEmail(customer.email);
        setStatus(transaction.status);
      }

      // The dashboard button in the top right doesn't appear right away because the subscription data is stale
      // this isn't really a problem because there's a dashboard button in the thank you message. Though I
      // decided it was probably best to refresh the page every 10 secs anyway.
      await sleep(10000);
      router.refresh();
    }

    void init();
  }, []);

  return (
    <Container size={6} className="relative flex flex-col align-center justify-center min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-80px)] py-20 lg:py-28">
      {status === 'completed' ? (
        <>
          <Heading className="text-center" as="h1" variant="h1">Thank you!</Heading>
          <Text className="text-center my-4" variant="leading">
            We appreciate your business! A confirmation email will be sent to {customerEmail}. If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
          </Text>
          <div className="text-center">
            <Button asChild>
              <Link href="/dashboard">
                Go to dashboard
              </Link>
            </Button>
          </div>
        </>
      ) : (
        <Spinner size="large" variant="primary" />
      )}
    </Container>
  )
}