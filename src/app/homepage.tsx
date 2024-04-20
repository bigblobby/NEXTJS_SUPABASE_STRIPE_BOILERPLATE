'use client';

import Pricing from '@/src/lib/components/pricing';
import type { Tables } from '@/types_db';
import { User } from '@supabase/supabase-js';

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

interface HomepageProps {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

export default function Homepage({
  user,
  products,
  subscription
}: HomepageProps) {
  return (
    <>
      <Pricing
        user={user}
        products={products ?? []}
        subscription={subscription}
      />
    </>
  )
}