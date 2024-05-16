import { createClient } from '@/lib/utils/supabase/server';
import HomepageContent from '@/app/(public)/(homepage)/page-content';

export default async function Homepage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  if (error) {
    console.log(error);
  }

  const { data: products } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  const { data: paddleSubscription, error: paddleError } = await supabase
    .from('paddle_subscriptions')
    .select('*')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  if (paddleError) {
    console.log(paddleError);
  }

  const { data: paddleProducts } = await supabase
    .from('paddle_products')
    .select('*, paddle_prices(*)')
    .eq('status', 'active')
    .eq('paddle_prices.status', 'active')
    // .order('metadata->index')
    .order('unit_price_amount', { referencedTable: 'paddle_prices' });

  return (
    <HomepageContent
      user={user}
      products={products ?? []}
      subscription={subscription}
      paddleSubscription={paddleSubscription}
      paddleProducts={paddleProducts ?? []}
    />
  );
}
