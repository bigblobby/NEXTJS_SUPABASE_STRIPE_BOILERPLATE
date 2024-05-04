import type { Tables } from '@/lib/types/supabase/types_db';
import { User as AuthUser } from '@supabase/supabase-js';

export type Subscription = Tables<'subscriptions'>;
export type Product = Tables<'products'>;
export type Price = Tables<'prices'>;
export type User = Tables<'users'>;

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