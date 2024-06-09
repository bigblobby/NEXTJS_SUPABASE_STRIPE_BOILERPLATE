'use client';

import { useState } from 'react';
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
import { getCheckoutView } from '@/lib/utils/paddle/settings';
import { Check, X } from 'lucide-react';
import { usePaddle } from '@/lib/hooks/usePaddle';
import { checkoutWithPaddle } from '@/lib/utils/paddle/server';
import toast from 'react-hot-toast';
import { AppConfig } from '@/lib/config/app-config';
import { usePaddleCustomerPortal } from '@/lib/hooks/usePaddleCustomerPortal';

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

  const paddle = usePaddle();
  const router = useRouter();
  const currentPath = usePathname();
  const checkoutView = getCheckoutView();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const { loadingPortal, goToCustomerPortal } = usePaddleCustomerPortal(paddleSubscription);

  const handlePaddleCheckout = async (price: PaddlePrice) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/signin/signup');
    }

    const { error, customer } = await checkoutWithPaddle();

    if (error) {
      setPriceIdLoading(undefined);
      toast.error(error);
      return router.push(currentPath);
    }

    if (customer) {
      paddle?.Checkout.open({
        settings: {
          displayMode: checkoutView,
          allowLogout: false,
        },
        items: [
          {
            priceId: price.id,
            quantity: 1,
          }
        ],
        customer: {
          id: customer,
        }
      })
    }

    setPriceIdLoading(undefined);
  };

  function getProductsFor(products: PaddleProductWithPrices[], type: BillingIntervalType) {
    return products.map((product) => {
      let features;

      // @ts-ignore
      if (product?.custom_data?.features) {
        // @ts-ignore
        features = JSON.parse(product.custom_data.features);
      }

      const price = product?.paddle_prices?.find((price) => {
        return price.interval === type || (type === 'one_time' && price.interval === null);
      });

      if (!price) return null;

      let priceString;

      if (price?.unit_price_amount != null) {
        priceString = new Intl.NumberFormat(AppConfig.locale, {
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
                  return <Text key={key} className="mt-2 inline-flex capitalize"><Check className="text-green-500 mr-3" /> {key.replaceAll('_', ' ')}</Text>
                } else {
                  return <Text key={key} className="mt-2 inline-flex capitalize"><X className="text-red-500 mr-3" /> {key.replaceAll('_', ' ')}</Text>
                }
              })}
            </div>
            <Button
              variant="default"
              type="button"
              disabled={priceIdLoading === price.id || loadingPortal}
              onClick={() => {
                if (paddleSubscription) {
                  void goToCustomerPortal();
                } else {
                  void handlePaddleCheckout(price)
                }
              }}
              className="w-full mt-8"
            >
              {paddleSubscription ? 'Manage' : 'Subscribe'}
            </Button>
          </Card>
        </div>
      );
    })
  }

  if (!intervals.length) {
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

            <Tabs className="flex flex-col justify-center mt-6" defaultValue={intervals[0]}>
              <TabsList className="mx-auto">
                <TabsTrigger className={`${(!intervals.includes('month')) ? 'hidden' : 'block'} px-4`} value="month">Monthly billing</TabsTrigger>
                <TabsTrigger className={`${(!intervals.includes('year')) ? 'hidden' : 'block'} px-4`} value="year">Yearly billing</TabsTrigger>
                <TabsTrigger className={`${(!intervals.includes('one_time')) ? 'hidden' : 'block'} px-4`} value="one_time">Life time</TabsTrigger>
              </TabsList>
              <TabsContent hidden={!intervals.includes('month')} value="month">
                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
                  {getProductsFor(paddleProducts, 'month')}
                </div>
              </TabsContent>
              <TabsContent className={`${(!intervals.includes('year')) ? 'hidden' : 'block'}`} value="year">
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
