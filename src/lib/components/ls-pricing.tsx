'use client';

import { Container } from '@/lib/components/ui/container';
import { Text } from '@/lib/components/ui/text';
import { Heading } from '@/lib/components/ui/heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { User } from '@supabase/supabase-js';
import { LsSubscription } from '@/lib/types/supabase/table.types';
import { ListProducts } from '@lemonsqueezy/lemonsqueezy.js';
import type { BillingIntervalType } from '@/lib/types/billing.types';
import { Card } from '@/lib/components/ui/card';
import { Button } from '@/lib/components/ui/button';
import { AppConfig } from '@/lib/config/app-config';
import { useRouter } from 'next/navigation';
import { checkoutWithLS } from '@/lib/utils/lemon-squeezy/server';
import toast from 'react-hot-toast';

interface LsPricingProps {
  user: User | null | undefined;
  lsProducts: ListProducts | null;
  lsSubscription: LsSubscription | null;
}

export default function LsPricing({ user, lsProducts, lsSubscription}: LsPricingProps) {
  const router = useRouter();
  const intervals = Array.from(
    new Set((lsProducts?.included ?? []).flatMap((lsProduct) => lsProduct.attributes.status === 'published' ? lsProduct?.attributes?.interval : null).filter(Boolean))
  );

  async function handleCheckout(product: any) {
    if (!user) {
      return router.push('/signin/signup');
    }

    const { data, error } = await checkoutWithLS(product, user.email);

    if (error) {
      toast.error(error);
    }

    if (data) {
      window.location.assign(data);
    }
  }

  function getProductsFor(products: ListProducts, type: BillingIntervalType) {
    const publishedProducts = products.data?.filter((product) => product?.attributes?.status === 'published')!;
    const publishedVariants = products.included?.filter((variant) => variant?.attributes?.status === 'published')!;

    function attachVariantsToProducts(products: typeof publishedProducts, variants: typeof publishedVariants) {
      const productsWithVariants = [];

      for (const product of products) {
        for(const variant of variants) {
          const productVariantIds = product.relationships?.variants?.data?.map((variant) => variant.id);
          if (productVariantIds?.includes(variant.id) && variant.attributes.interval === type) {
            productsWithVariants.push({
              ...product,
              variant: variant
            })
          }
        }
      }

      return productsWithVariants;
    }

    const productsWithVariants = attachVariantsToProducts(publishedProducts, publishedVariants);

    return productsWithVariants.map(product => {
      let priceString;

      if (product.variant.attributes.price !== null) {
        const price = String(product.variant.attributes.price);

        priceString = new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: AppConfig.lemonSqueezy.currency,
          minimumFractionDigits: 2
        }).format((parseInt(price) || 0) / 100);
      }

      return (
        <div
          key={product.id}
          className="flex flex-col flex-1 basis-1/3 max-w-xs rounded-lg shadow-sm divide-y divide-zinc-600"
        >
          <Card className={`relative p-6 border-none`}>
            <Heading>{product.attributes.name}</Heading>
            <Text className="mt-4">
              <Text as="span" className="text-5xl font-extrabold text-zinc-900 dark:text-white">{priceString}</Text>
              <Text as="span" className="text-base font-medium text-zinc-900 dark:text-white">/{type.replace(/_/, ' ')}</Text>
            </Text>
            <Text className="mt-4">{product.attributes.description}</Text>
            <Button
              className="w-full mt-8"
              variant="default"
              type="button"
              onClick={() => handleCheckout(product)}
            >
              Subscribe
            </Button>
          </Card>
        </div>
      );
    });
  }

  if (!lsProducts) {
    return (
      <section>
        <Container size={11} className="py-20 lg:py-28">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <Text className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{' '}
            <a
              className="text-pink-500 underline"
              href="https://app.lemonsqueezy.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Lemon Squeezy Dashboard
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
              </TabsList>
              <TabsContent hidden={!intervals.includes('month')} value="monthly">
                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
                  {getProductsFor(lsProducts, 'month')}
                </div>
              </TabsContent>
              <TabsContent className={`${(!intervals.includes('year')) ? 'hidden' : 'block'}`} value="yearly">
                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
                  {getProductsFor(lsProducts, 'year')}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Container>
      </section>
    );
  }
}