'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { PaddlePrice, PaddleProductWithPrices, PaddleSubscription } from '@/lib/types/supabase/table.types';
import type { BillingIntervalType } from '@/lib/types/billing.types';
import { Button } from '@/lib/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { Heading } from '@/lib/components/ui/heading';
import { Text } from '@/lib/components/ui/text';
import { Card } from '@/lib/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";
import { Container } from '@/lib/components/ui/container';
import { Badge } from '@/lib/components/ui/badge';
import { getCheckoutView } from '@/lib/utils/stripe/settings';
import { Check, X } from 'lucide-react';

interface PaddlePricingProps {
  user: User | null | undefined;
  paddleProducts: PaddleProductWithPrices[];
  paddleSubscription: PaddleSubscription | null;
}

export default function PaddlePricing({ user, paddleProducts, paddleSubscription }: PaddlePricingProps) {
  const intervals = Array.from(
    new Set(paddleProducts.flatMap((paddleProduct) => paddleProduct?.paddle_prices?.map((paddlePrice) => {
      if (paddlePrice?.interval === null) return 'one_time';
      return paddlePrice?.interval;
    })))
  );

  const checkoutView = getCheckoutView();
  const router = useRouter();
  const currentPath = usePathname();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handlePaddleCheckout = async (price: PaddlePrice) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/signin/signup');
    }

    setPriceIdLoading(undefined);
  };

  useEffect(() => {
    if (!checkoutOpen) {
      setPriceIdLoading(undefined);
    }
  }, [checkoutOpen]);

  function getProductsFor(products: PaddleProductWithPrices[], type: BillingIntervalType) {
    return products.map((product) => {
      let features;

      // @ts-ignore
      if (product?.custom_data?.features) {
        // @ts-ignore
        features = JSON.parse(product.custom_data.features);
      }

      console.log(product)

      const price = product?.paddle_prices?.find((price) => {
        return price.interval === type || (type === 'one_time' && price.interval === null);
      });

      if (!price) return null;

      let priceString;

      if (price?.unit_price_amount != null) {
        priceString = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: price.unit_price_currency_code!,
          minimumFractionDigits: 2
        }).format((parseInt(price?.unit_price_amount) || 0) / 100);
      }

      return (
        <div
          key={product.id}
          className="flex flex-col flex-1 basis-1/3 max-w-xs rounded-lg shadow-sm divide-y divide-zinc-600"
        >
          <Card className={`relative p-6 border-none ${product.name === 'Trial' ? 'outline outline-2 outline-primary' : ''}`}>
            {product.name === 'Trial' && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">POPULAR</Badge>}
            <Heading>{product.name}</Heading>
            <Text className="mt-4">
              <Text as="span" className="text-5xl font-extrabold text-zinc-900 dark:text-white">{priceString}</Text>
              <Text as="span" className="text-base font-medium text-zinc-900 dark:text-white">/{type.replace(/_/, ' ')}</Text>
            </Text>
            <Text className="mt-4">{product.description}</Text>
            <div className="flex flex-col mt-4">
              {features && Object.entries(features).map(([key, value]) => {
                if (value) {
                  return <Text className="mt-2 inline-flex capitalize"><Check className="text-green-500 mr-3" /> {key.replaceAll('_', ' ')}</Text>
                } else {
                  return <Text className="mt-2 inline-flex capitalize"><X className="text-red-500 mr-3" /> {key.replaceAll('_', ' ')}</Text>
                }
              })}
            </div>
            <Button
              variant="default"
              type="button"
              disabled={priceIdLoading === price.id}
              onClick={() => handlePaddleCheckout(price)}
              className="w-full mt-8"
            >
              {paddleSubscription ? 'Manage' : 'Subscribe'}
            </Button>
          </Card>
        </div>
      );
    })
  }

  if (!paddleProducts.length) {
    return (
      <section>
        <Container size={11} className="py-20 lg:py-28">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <Text className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{' '}
            <a
              className="text-pink-500 underline"
              href="https://sandbox-vendors.paddle.com/products-v2"
              rel="noopener noreferrer"
              target="_blank"
            >
              Paddle Dashboard
            </a>
            .
          </Text>
        </Container>
      </section>
    );
  } else {
    return (
      <section>
        <Container size={10} className="py-20 lg:py-28">
          <div className="flex flex-col align-center">
            <Heading variant="tagline" as="span" className="text-center">PRICING</Heading>
            <Heading as="h2" variant="h1" className="font-extrabold text-center">Pricing Plans</Heading>
            <Text className="max-w-2xl m-auto mt-5 text-xl sm:text-2xl text-center">
              Start building for free, then add a site plan to go live. Account
              plans unlock additional features.
            </Text>

            <Tabs className="flex flex-col justify-center mt-6" defaultValue="monthly">
              <TabsList className="mx-auto">
                <TabsTrigger className={`${(!intervals.includes('month')) ? 'hidden' : 'block'} px-4`} value="monthly">Monthly billing</TabsTrigger>
                <TabsTrigger className={`${(!intervals.includes('year')) ? 'hidden' : 'block'} px-4`} value="yearly">Yearly billing</TabsTrigger>
                <TabsTrigger className={`${(!intervals.includes('one_time')) ? 'hidden' : 'block'} px-4`} value="one_time">Life time</TabsTrigger>
              </TabsList>
              <TabsContent hidden={!intervals.includes('month')} value="monthly">
                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
                  {getProductsFor(paddleProducts, 'month')}
                </div>
              </TabsContent>
              <TabsContent className={`${(!intervals.includes('year')) ? 'hidden' : 'block'}`} value="yearly">
                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
                  {getProductsFor(paddleProducts, 'year')}
                </div>
              </TabsContent>
              <TabsContent className={`${(!intervals.includes('one_time')) ? 'hidden' : 'block'}`} value="one_time">
                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
                  {getProductsFor(paddleProducts, 'one_time')}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Container>
      </section>
    );
  }
}