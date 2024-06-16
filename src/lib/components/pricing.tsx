'use client';

import { User } from '@supabase/supabase-js';
import type { LsSubscription, PaddleSubscription, Subscription } from '@/lib/types/supabase/table.types';
import { BillingSchemaLineItem, BillingSchemaPlan, BillingSchemaProduct, BillingIntervalType, BillingSchema } from '@/lib/types/billing.types';
import { Heading } from '@/lib/components/ui/heading';
import { Text } from '@/lib/components/ui/text';
import { Card } from '@/lib/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";
import { Container } from '@/lib/components/ui/container';
import { Badge } from '@/lib/components/ui/badge';
import { Check } from 'lucide-react';
import { AppConfig } from '@/lib/config/app-config';
import { billingSchema } from '@/lib/billing/schema';
import { CheckoutButton } from '@/lib/components/checkout-button/checkout-button';
import { inter } from 'react-email/src/app/inter';

interface PricingProps {
  user: User | null | undefined;
  subscription: Subscription | null;
  paddleSubscription: PaddleSubscription | null;
  lsSubscription: LsSubscription | null;
}

export default function Pricing({ subscription, paddleSubscription, lsSubscription }: PricingProps) {
  const paymentType = Array.from(
    new Set(billingSchema.products.flatMap(product => product.plans.map(plan => plan.paymentType)))
  );
  const intervals = Array.from(
    new Set(billingSchema.products.flatMap(product => product.plans.map(plan => plan.interval)))
  );

  function getProductsFor(products: BillingSchemaProduct[], type: BillingIntervalType) {
    return products.map((product: BillingSchemaProduct) => {
      const plan = product.plans.find((p: BillingSchemaPlan) => p.interval === type);
      if (!plan) return null;

      const price = plan.lineItems.find((l: BillingSchemaLineItem) => l.type === 'flat');
      if (!price) return null;

      const priceString = new Intl.NumberFormat(AppConfig.locale, {
        style: 'currency',
        currency: product.currency,
        minimumFractionDigits: 2
      }).format(price.cost);

      return (
        <div
          key={product.id}
          className="flex flex-col flex-1 basis-1/3 max-w-xs rounded-lg shadow-sm divide-y divide-zinc-600"
        >
          <Card className={`relative flex flex-col p-6 border-none h-full ${product.isFeatured && 'outline outline-2 outline-primary'}`}>
            {product.isFeatured && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">POPULAR</Badge>}
            <Heading>{product.name}</Heading>
            <Text className="mt-4">
              <Text as="span" className="text-5xl font-extrabold text-zinc-900 dark:text-white">{priceString}</Text>
              <Text as="span" className="text-base font-medium text-zinc-900 dark:text-white">/{type.replace(/_/, ' ')}</Text>
            </Text>
            <Text className="mt-4">{product.description}</Text>
            <div className="flex flex-col mt-4">
              {(product.features as [])?.map((feature: any) => {
                return (
                  <Text key={feature.name} className="mt-2 inline-flex">
                    <span>
                      <Check className="text-green-500 mr-3" width={24} height={24} />
                    </span>
                    <span>
                      {feature.name}
                    </span>
                  </Text>
                )
              })}
            </div>
            <div className="mt-auto">
              <CheckoutButton subscription={subscription} lsSubscription={lsSubscription} paddleSubscription={paddleSubscription} plan={plan} />
            </div>
          </Card>
        </div>
      );
    })
  }

  if (!billingSchema.products.length) {
    return (
      <section>
        <Container size={11} className="py-20 lg:py-28">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <Text className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{' '}
            <a
              className="text-pink-500 underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
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
                <TabsTrigger className={`${(paymentType.includes('recurring') && intervals.includes('month')) ? 'block' : 'hidden'} px-4`} value="month">Monthly billing</TabsTrigger>
                <TabsTrigger className={`${(paymentType.includes('recurring') && intervals.includes('year')) ? 'block' : 'hidden'} px-4`} value="year">Yearly billing</TabsTrigger>
                <TabsTrigger className={`${paymentType.includes('recurring') && intervals.includes('life_time') ? 'block' : 'hidden'} px-4`} value="life_time">Life time</TabsTrigger>
              </TabsList>
              <TabsContent hidden={!paymentType.includes('recurring') && !intervals.includes('month')} value="month">
                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
                  {getProductsFor(billingSchema.products, 'month')}
                </div>
              </TabsContent>
              <TabsContent className={`${(!paymentType.includes('recurring') && !intervals.includes('year')) ? 'hidden' : 'block'}`} value="year">
                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
                  {getProductsFor(billingSchema.products, 'year')}
                </div>
              </TabsContent>
              <TabsContent hidden={!paymentType.includes('recurring') && !intervals.includes('life_time')} value="life_time">
                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
                  {getProductsFor(billingSchema.products, 'life_time')}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Container>
      </section>
    );
  }
}

