'use client';

import { type LsSubscription } from '@/lib/types/supabase/table.types';
import { type Variant, type Product } from '@lemonsqueezy/lemonsqueezy.js';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppConfig } from '@/lib/config/app-config';
import { Button } from '@/lib/components/ui/button';
import { Heading } from '@/lib/components/ui/heading';
import { Card, CardContent, CardFooter, CardHeader } from '@/lib/components/ui/card';
import { Text } from '@/lib/components/ui/text';
import { getProductVariantById, getProductById } from '@/lib/utils/lemon-squeezy/server';
import { SubscriptionUrls } from '@/lib/types/lemon-squeezy/subscription.types';

interface CustomerPortalFormProps {
  lsSubscription: LsSubscription | null;
}

export default function LsCustomerPortalForm({ lsSubscription }: CustomerPortalFormProps) {
  const [variant, setVariant] = useState<Variant>()
  const [product, setProduct] = useState<Product>()
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (lsSubscription) {
        const variant = await getProductVariantById(lsSubscription.variant_id);
        if (variant.data) {
          setVariant(variant.data);
        }

        const product = await getProductById(lsSubscription.product_id);
        if (product.data) {
          setProduct(product.data);
        }
      }
      setLoading(false);
    })()
  }, [lsSubscription]);

  const subscriptionPrice = variant &&
    new Intl.NumberFormat(AppConfig.locale, {
      style: 'currency',
      currency: AppConfig.currency,
      minimumFractionDigits: 2
    }).format((parseInt(String(variant.data.attributes.price)) || 0) / 100);


  async function handleStripePortalRequest() {
    if (!lsSubscription) return;

    setIsSubmitting(true);
    const urls = lsSubscription.urls as unknown as SubscriptionUrls;
    router.push(urls?.customer_portal);
    setIsSubmitting(false);
  }

  return (
    <Card className="shadow-none mx-0">
      {loading ? (
        <div className="p-6">
          <Heading className="mb-1 font-medium" as="h3" variant="h3">Your Plan</Heading>
          <Text>Loading...</Text>
        </div>
      ) : (
        <>
          <CardHeader>
            <Heading className="mb-1 font-medium" as="h3" variant="h3">Your Plan</Heading>
            <Text>
              {
                lsSubscription
                ? `You are currently on the ${product?.data.attributes.name} plan.`
                : 'You are not currently subscribed to any plan.'
              }
            </Text>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              {lsSubscription && variant ? (
                <Text>{subscriptionPrice}/{variant?.data.attributes.interval}</Text>
              ) : (
                <Text>
                  <Link href="/">Choose your plan</Link>
                </Text>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <Text className="pb-4 sm:pb-0" variant="muted">Manage your subscription on Lemon Squeezy.</Text>
              <Button
                onClick={handleStripePortalRequest}
                disabled={isSubmitting || !lsSubscription}
                showSpinnerOnDisabled={false}
              >
                Open customer portal
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
