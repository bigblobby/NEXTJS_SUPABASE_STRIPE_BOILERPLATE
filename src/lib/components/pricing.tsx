'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { User } from '@supabase/supabase-js';
import type { Price, ProductWithPrices, SubscriptionWithProduct } from '@/lib/types/supabase/table.types';
import type { BillingIntervalType } from '@/lib/types/billing.types';
import { Button } from '@/lib/components/ui/button';
import { checkoutWithStripe } from '@/lib/utils/stripe/server';
import { usePathname, useRouter } from 'next/navigation';
import { Heading } from '@/lib/components/ui/heading';
import { Text } from '@/lib/components/ui/text';
import { Card } from '@/lib/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";
import { Container } from '@/lib/components/ui/container';
import { Badge } from '@/lib/components/ui/badge';
import CheckoutDrawerModal from '@/lib/components/checkout-drawer-modal';
import { getStripe } from '@/lib/utils/stripe/client';
import { getCheckoutView } from '@/lib/utils/stripe/settings';
import { StripeCheckoutView } from '@/lib/enums/stripe.enums';
import { Check } from 'lucide-react';

interface PricingProps {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

const stripePromise = getStripe();

export default function Pricing({ user, products, subscription }: PricingProps) {
  const productTypes = Array.from(
    new Set(products.flatMap((product) => product?.prices?.map((price) => price.type)))
  );
  const intervals = Array.from(
    new Set(products.flatMap((product) => product?.prices?.map((price) => price?.interval)))
  );
  const checkoutView = getCheckoutView();
  const router = useRouter();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [options, setOptions] = useState<{
    clientSecret?: string | null;
    fetchClientSecret?: (() => Promise<string>) | null;
    onComplete?: () => void;
  }>();

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/signin/signup');
    }

    const { error, clientSecret, sessionId } = await checkoutWithStripe(price, checkoutView);

    if (error) {
      setPriceIdLoading(undefined);
      toast.error(error);
      return router.push(currentPath);
    }

    if (checkoutView === StripeCheckoutView.Embedded && clientSecret) {
      setOptions({ fetchClientSecret: () => Promise.resolve(clientSecret) })
      setCheckoutOpen(true)
    }

    if (checkoutView === StripeCheckoutView.Hosted && sessionId) {
      const stripe = await stripePromise;
      stripe?.redirectToCheckout({ sessionId });
    }

    setPriceIdLoading(undefined);
  };

  useEffect(() => {
    if (!checkoutOpen) {
      setPriceIdLoading(undefined);
    }
  }, [checkoutOpen]);

  function getProductsFor(products: ProductWithPrices[], type: BillingIntervalType) {
    return products.map((product) => {
      const price = product?.prices?.find((price) => price.interval === type || price.type === type);
      if (!price) return null;

      const priceString = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: price.currency!,
        minimumFractionDigits: 2
      }).format((price?.unit_amount || 0) / 100);

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
              {(product.features as [])?.map((feature: any) => {
                return (
                  <Text className="mt-2 inline-flex"><Check className="text-green-500 mr-3" /> {feature.name}</Text>
                )
              })}
            </div>
            <Button
              variant="default"
              type="button"
              disabled={priceIdLoading === price.id}
              onClick={() => handleStripeCheckout(price)}
              className="w-full mt-8"
            >
              {subscription ? 'Manage' : 'Subscribe'}
            </Button>
          </Card>
        </div>
      );
    })
  }

  if (!products.length) {
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
        {checkoutView === StripeCheckoutView.Embedded && (
          <CheckoutDrawerModal
            open={checkoutOpen}
            setOpen={setCheckoutOpen}
            stripePromise={stripePromise}
            options={options}
          />
        )}

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
                <TabsTrigger className={`${(!productTypes.includes('recurring') || !intervals.includes('month')) ? 'hidden' : 'block'} px-4`} value="monthly">Monthly billing</TabsTrigger>
                <TabsTrigger className={`${(!productTypes.includes('recurring') || !intervals.includes('year')) ? 'hidden' : 'block'} px-4`} value="yearly">Yearly billing</TabsTrigger>
                <TabsTrigger className={`${!productTypes.includes('one_time') ? 'hidden' : 'block'} px-4`} value="lifetime">Life time</TabsTrigger>
              </TabsList>
              <TabsContent hidden={!productTypes.includes('recurring') && !intervals.includes('month')} value="monthly">
                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
                 {getProductsFor(products, 'month')}
                </div>
              </TabsContent>
              <TabsContent className={`${(!productTypes.includes('recurring') && !intervals.includes('year')) ? 'hidden' : 'block'}`} value="yearly">
                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
                  {getProductsFor(products, 'year')}
                </div>
              </TabsContent>
              <TabsContent hidden={!productTypes.includes('one_time')} value="lifetime">
                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
                  {getProductsFor(products, 'one_time')}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Container>
      </section>
    );
  }
}
