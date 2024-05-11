'use client';

import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentStripeSession } from '@/lib/utils/stripe/server';
import { Container } from '@/lib/components/ui/container';
import { Text } from '@/lib/components/ui/text';
import { Heading } from '@/lib/components/ui/heading';
import { Button } from '@/lib/components/ui/button';
import Link from 'next/link';
import Stripe from 'stripe';

export default function Return() {
  const [status, setStatus] = useState<Stripe.Checkout.Session.Status | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string | null | undefined>('');

  useEffect(() => {
    async function init(){
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sessionId = urlParams.get('session_id');

      if (!sessionId) {
        redirect('/');
      }

      const session = await getCurrentStripeSession(sessionId);

      if (session) {
        setStatus(session.status);
        setCustomerEmail(session.email);
      }
    }

    void init();
  }, []);

  if (status === 'open') {
    return redirect('/');
  }

  if (status === 'complete') {
    return (
      <Container size={6} className="flex flex-col align-center justify-center min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-80px)] py-20 lg:py-28">
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
      </Container>
    )
  }

  return null;
}