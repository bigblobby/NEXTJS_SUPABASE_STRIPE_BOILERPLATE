'use client';

import { Button } from '@/lib/components/ui/button';
import { Heading } from '@/lib/components/ui/heading';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createStripePortal } from '@/lib/utils/stripe/server';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/lib/components/ui/card';
import { Text } from '@/lib/components/ui/text';
import toast from 'react-hot-toast';
import { type Subscription } from '@/lib/types/supabase/table.types';
import { AppConfig } from '@/lib/config/app-config';
import { billingSchema } from '@/lib/billing/schema';

interface CustomerPortalFormProps {
  subscription: Subscription | null;
}

export default function CustomerPortalForm({ subscription }: CustomerPortalFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  function getPrice() {
    const priceId = subscription?.price_id;

    const lineItems = billingSchema.products.flatMap(product => {
      return product.plans.flatMap(plan => {
        return plan.lineItems.flatMap((lineItem) => {
          return lineItem;
        });
      });
    });

    const lineItem = lineItems.find(price => price.id === priceId);

    if (lineItem && subscription) {
      return new Intl.NumberFormat(AppConfig.locale, {
        style: 'currency',
        currency: AppConfig.currency,
        minimumFractionDigits: 0
      }).format((lineItem.cost || 0));
    }

    return null;
  }

  function getInterval() {
    const priceId = subscription?.price_id;

    const plan = billingSchema.products.map(product => {
      return product.plans.find(plan => {
        return plan.lineItems.find((lineItem) => {
          return lineItem.id === priceId;
        });
      });
    }).filter(Boolean);

    if (plan) {
      return plan[0]?.interval?.replace('_', ' ');
    }

    return null;
  }

  function getName() {
    const priceId = subscription?.price_id;

    const product = billingSchema.products.find(product => {
      return product.plans.find(plan => {
        return plan.lineItems.find((lineItem) => {
          return lineItem.id === priceId;
        });
      });
    });

    return product?.name;
  }

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    const { url, error} = await createStripePortal();
    if (url) {
      return router.push(url);
    }

    if (error) {
      toast.error(error, {duration: 5000});
    }

    setIsSubmitting(false);
  };

  return (
    <Card className="shadow-none mx-0">
      <CardHeader>
        <Heading className="mb-1 font-medium" as="h3" variant="h3">Your Plan</Heading>
        <Text>
          {
            subscription
            ? `You are currently on the ${getName()} plan.`
            : 'You are not currently subscribed to any plan.'
          }
        </Text>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-semibold">
          {subscription ? (
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
          <Text className="pb-4 sm:pb-0" variant="muted">Manage your subscription on Stripe.</Text>
          <Button
            onClick={handleStripePortalRequest}
            disabled={isSubmitting || !subscription}
            showSpinnerOnDisabled={false}
          >
            Open customer portal
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
