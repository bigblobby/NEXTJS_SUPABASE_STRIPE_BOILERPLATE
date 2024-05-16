import type { Tables } from '@/lib/types/supabase/types_db';
export type Subscription = Tables<'subscriptions'>;
export type Product = Tables<'products'>;
export type Price = Tables<'prices'>;
export type User = Tables<'users'>;
export type PaddleProduct = Tables<'paddle_products'>;
export type PaddlePrice = Tables<'paddle_prices'>;
export type PaddleSubscription = Tables<'paddle_subscriptions'>;

export interface ProductWithPrices extends Product {
  prices: Price[];
}

export interface PriceWithProduct extends Price {
  products: Product | null;
}

export interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

export type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
    products: Product | null;
  })
    | null;
};

export interface PaddleProductWithPrices extends PaddleProduct {
  paddle_prices: PaddlePrice[]
}