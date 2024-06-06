'use client';

import type { PaddleSubscription } from '@/lib/types/supabase/table.types';
import { getURL } from '@/lib/utils/helpers';
import { getBoathousePortal } from '@/lib/api/boathouse';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/lib/components/ui/card';
import { Heading } from '@/lib/components/ui/heading';
import { Text } from '@/lib/components/ui/text';
import { Button } from '@/lib/components/ui/button';
import Link from 'next/link';
import { getProductById } from '@/lib/utils/paddle/server';
import { Product } from '@paddle/paddle-node-sdk/dist/types/entities';
import { AppConfig } from '@/lib/config/app-config';

interface PaddleCustomerPortalFormProps {
  paddleSubscription: PaddleSubscription | null;
}

export default function PaddleCustomerPortalForm({
  paddleSubscription
}: PaddleCustomerPortalFormProps) {
  const [loadingPortal, setLoadingPortal] = useState<boolean>(false);
  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    if (paddleSubscription) {
      (async () => {
        const items = paddleSubscription.items as any[];
        const item = items[0];
        const product = await getProductById(item.price.productId);
        if (product) {
          setProduct(product);
        }
      })();
    }
  }, [paddleSubscription]);

  async function goToCustomerPortal(){
    if (!paddleSubscription) return;

    const returnUrl = getURL('/account');

    try {
      setLoadingPortal(true);
      const boathouse = await getBoathousePortal(
        null,
        paddleSubscription.customer_id,
        returnUrl
      );

      window.location.href = boathouse.billingPortalUrl;
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingPortal(false);
    }
  }

  function getInterval(){
    if (paddleSubscription) {
      return (paddleSubscription?.billing_cycle as any)?.interval;
    }
  }

  function getPrice(){
    if (paddleSubscription) {
      const items = paddleSubscription.items as any[];
      const item = items[0];

      return new Intl.NumberFormat(AppConfig.locale, {
        style: 'currency',
        currency: item.price.unitPrice.currencyCode,
        minimumFractionDigits: 0
      }).format((item.price.unitPrice.amount || 0) / 100);
    }
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <Heading className="mb-1 font-medium" as="h3" variant="h3">Your Plan</Heading>
        <Text>
          {
            paddleSubscription && product
              ? `You are currently on the ${product.name} plan.`
              : 'You are not currently subscribed to any plan.'
          }
        </Text>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-semibold">
          {paddleSubscription ? (
            <Text>{getPrice()}/{getInterval()}</Text>
          ) : (
            <Text>
              <Link href="/">Choose your plan</Link>
            </Text>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <Text className="pb-4 sm:pb-0" variant="muted">Manage your subscription in the customer portal.</Text>
          <Button disabled={!paddleSubscription || loadingPortal} showSpinnerOnDisabled={loadingPortal} onClick={goToCustomerPortal}>
            Open customer portal
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}