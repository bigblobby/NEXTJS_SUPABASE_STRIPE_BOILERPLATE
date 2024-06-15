import type { Tables } from '@/lib/types/supabase/types_db';
export type Subscription = Tables<'subscriptions'>;
export type User = Tables<'users'>;
export type PaddleCustomer = Tables<'paddle_customers'>;
export type PaddleProduct = Tables<'paddle_products'>;
export type PaddlePrice = Tables<'paddle_prices'>;
export type PaddleSubscription = Tables<'paddle_subscriptions'>;
export type LsSubscription = Tables<'ls_subscriptions'>;