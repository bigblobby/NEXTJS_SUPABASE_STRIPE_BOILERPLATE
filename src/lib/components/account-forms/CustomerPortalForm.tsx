'use client';

import { Button } from '@/src/lib/components/ui/button';
import { Heading } from '@/src/lib/components/ui/heading';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { createStripePortal } from '@/src/lib/utils/stripe/server';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/src/lib/components/ui/card';
import { Tables } from '@/types_db';
import { Text } from '@/src/lib/components/ui/text';
import toast from 'react-hot-toast';

type Subscription = Tables<'subscriptions'>;
type Price = Tables<'prices'>;
type Product = Tables<'products'>;

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
        products: Product | null;
      })
    | null;
};

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null;
}

export default function CustomerPortalForm({ subscription }: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    const { url, error} = await createStripePortal(currentPath);
    if (url) {
      return router.push(url);
    }

    if (error) {
      toast.error(error, {duration: 5000});
    }

    setIsSubmitting(false);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <Heading className="mb-1 font-medium" as="h3" variant="h3">Your Plan</Heading>
        <Text>
          {
            subscription
            ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
            : 'You are not currently subscribed to any plan.'
          }
        </Text>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-semibold">
          {subscription ? (
            <Text>{subscriptionPrice}/{subscription?.prices?.interval}</Text>
          ) : (
            <Text>
              <Link href="/public">Choose your plan</Link>
            </Text>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <Text className="pb-4 sm:pb-0" variant="muted">Manage your subscription on Stripe.</Text>
          <Button
            onClick={handleStripePortalRequest}
            disabled={isSubmitting}
          >
            Open customer portal
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
