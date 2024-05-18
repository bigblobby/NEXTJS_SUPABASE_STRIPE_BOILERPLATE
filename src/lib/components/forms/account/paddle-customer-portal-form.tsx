'use client';

import { PaddleSubscription } from '@/lib/types/supabase/table.types';
import { getURL } from '@/lib/utils/helpers';
import { getBoathousePortal } from '@/lib/api/boathouse';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/lib/components/ui/card';
import { Heading } from '@/lib/components/ui/heading';
import { Text } from '@/lib/components/ui/text';
import { Button } from '@/lib/components/ui/button';

interface PaddleCustomerPortalFormProps {
  paddleSubscription: PaddleSubscription | null;
}

export default function PaddleCustomerPortalForm({
  paddleSubscription
}: PaddleCustomerPortalFormProps) {
  async function goToCustomerPortal(){
    if (!paddleSubscription) return;

    const returnUrl = getURL('/account');

    try {
      const boathouse = await getBoathousePortal(
        null,
        paddleSubscription.customer_id,
        returnUrl
      );

      window.location.href = boathouse.billingPortalUrl;
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <Heading className="mb-1 font-medium" as="h3" variant="h3">Your Plan</Heading>
        {/*<Text>*/}
        {/*  {*/}
        {/*    paddleSubscription*/}
        {/*      ? `You are currently on the ${subscription?.prices?.products?.name} plan.`*/}
        {/*      : 'You are not currently subscribed to any plan.'*/}
        {/*  }*/}
        {/*</Text>*/}
      </CardHeader>
      <CardContent>
        {/*<div className="text-xl font-semibold">*/}
        {/*  {subscription ? (*/}
        {/*    <Text>{subscriptionPrice}/{subscription?.prices?.interval}</Text>*/}
        {/*  ) : (*/}
        {/*    <Text>*/}
        {/*      <Link href="/">Choose your plan</Link>*/}
        {/*    </Text>*/}
        {/*  )}*/}
        {/*</div>*/}
      </CardContent>
      <CardFooter>
        <div className="w-full flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <Text className="pb-4 sm:pb-0" variant="muted">Manage your subscription in the customer portal.</Text>
          <Button disabled={!paddleSubscription} showSpinnerOnDisabled={false} onClick={goToCustomerPortal}>
            Open customer portal
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}