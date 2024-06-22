import type { Tables } from '@/lib/types/supabase/types_db';
export type User = Tables<'users'>;
export type Subscription = Tables<'subscriptions'>;
export type Order = Tables<'orders'>;
export type Customer = Tables<'customers'>;
export type PaddleCustomer = Tables<'paddle_customers'>;
export type PaddleSubscription = Tables<'paddle_subscriptions'>;
export type LsSubscription = Tables<'ls_subscriptions'>;