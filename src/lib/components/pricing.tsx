'use client';

import { Button } from '@/lib/components/ui/button';
import type { Tables } from '@/lib/types/supabase/types_db';
import { getStripe } from '@/lib/utils/stripe/client';
import { checkoutWithStripe } from '@/lib/utils/stripe/server';
import { User } from '@supabase/supabase-js';
import cn from 'classnames';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Heading } from '@/lib/components/ui/heading';
import { Text } from '@/lib/components/ui/text';
import { Card } from '@/lib/components/ui/card';
import { Container } from '@/lib/components/ui/container';
import toast from 'react-hot-toast';

type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type Price = Tables<'prices'>;
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

type BillingInterval = 'lifetime' | 'year' | 'month';

export default function Pricing({ user, products, subscription }: Props) {
  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval)
      )
    )
  );
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('month');
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/signin/signup');
    }

    const { error, sessionId } = await checkoutWithStripe(
      price,
      // currentPath
    );

    if (error) {
      setPriceIdLoading(undefined);
      toast.error(error);
      return router.push(currentPath);
    }

    if (!sessionId) {
      setPriceIdLoading(undefined);
      toast.error('An unknown error occurred. - Please try again later or contact a system administrator.')
      router.push(currentPath);
      return;
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });

    setPriceIdLoading(undefined);
  };

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
        <Container size={11} className="py-20 lg:py-28">
          <div className="sm:flex sm:flex-col sm:align-center">
            <Heading className="text-primary text-lg md:text-lg lg:text-lg sm:text-center dark:text-primary">PRICING</Heading>
            <Heading as="h2" variant="h1" className="font-extrabold sm:text-center">Pricing Plans</Heading>
            <Text className="max-w-2xl m-auto mt-5 text-xl sm:text-2xl sm:text-center">
              Start building for free, then add a site plan to go live. Account
              plans unlock additional features.
            </Text>
            <div className="relative self-center mt-6 rounded-lg p-0.5 flex sm:mt-8 border bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
              {intervals.includes('month') && (
                <button
                  onClick={() => setBillingInterval('month')}
                  type="button"
                  className={`${
                    billingInterval === 'month'
                      ? 'relative w-1/2 shadow-sm bg-zinc-300 text-zinc-900 dark:bg-zinc-700 dark:border-zinc-800 dark:text-white'
                      : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-600 dark:text-zinc-400'
                  } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                >
                  Monthly billing
                </button>
              )}
              {intervals.includes('year') && (
                <button
                  onClick={() => setBillingInterval('year')}
                  type="button"
                  className={`${
                    billingInterval === 'year'
                      ? 'relative w-1/2 shadow-sm bg-zinc-300 text-zinc-900 dark:bg-zinc-700 dark:border-zinc-800 dark:text-white'
                      : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-600 dark:text-zinc-400'
                  } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                >
                  Yearly billing
                </button>
              )}
            </div>
          </div>
          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
            {products.map((product) => {
              const price = product?.prices?.find(
                (price) => price.interval === billingInterval
              );
              if (!price) return null;
              const priceString = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: price.currency!,
                minimumFractionDigits: 2
              }).format((price?.unit_amount || 0) / 100);
              return (
                <div
                  key={product.id}
                  className={cn(
                    'flex flex-col rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-100 dark:bg-zinc-900',
                    'flex-1', // This makes the flex item grow to fill the space
                    'basis-1/3', // Assuming you want each card to take up roughly a third of the container's width
                    'max-w-xs' // Sets a maximum width to the cards to prevent them from getting too large
                  )}
                >
                  <Card className="p-6 bg-zinc-100 dark:bg-card border-none">
                    <Heading>{product.name}</Heading>
                    <Text className="mt-4">{product.description}</Text>
                    <Text className="mt-8">
                      <Text as="span" className="text-5xl font-extrabold text-zinc-900 dark:text-white">{priceString}</Text>
                      <Text as="span" className="text-base font-medium text-zinc-900 dark:text-white">/{billingInterval}</Text>
                    </Text>
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
            })}
          </div>
        </Container>
      </section>
    );
  }
}
