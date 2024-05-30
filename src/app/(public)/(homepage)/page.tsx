import { createClient } from '@/lib/utils/supabase/server';
import HomepageContent from '@/app/(public)/(homepage)/page-content';
import { AppConfig } from '@/lib/config/app-config';
import { PaddleProductWithPrices, type ProductWithPrices } from '@/lib/types/supabase/table.types';
import { getProducts } from '@/lib/utils/lemon-squeezy/server';
import { ListProducts } from '@lemonsqueezy/lemonsqueezy.js';

export default async function Homepage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  let sub = null;
  let paddleSub = null;
  let lsSub = null;
  let prods: ProductWithPrices[] = [];
  let paddleProds: PaddleProductWithPrices[] = [];
  let lsProds: ListProducts | null = null;

  if (AppConfig.payments === 'stripe') {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
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

    if (products) {
      prods = products;
    }

    sub = subscription;
  }


  if (AppConfig.payments === 'paddle') {
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

    if (paddleProducts) {
      paddleProds = paddleProducts;
    }

    paddleSub = paddleSubscription;
  }

  if (AppConfig.payments === 'ls') {
    const { data: lsSubscription, error: lsError } = await supabase
      .from('ls_subscriptions')
      .select('*')
      .in('status', ['on_trial', 'active'])
      .maybeSingle();

    if (lsError) {
      console.log(lsError);
    }

    const products = await getProducts();

    if (products?.data) {
      lsProds = products;
    }

    lsSub = lsSubscription;
  }

  return (
    <HomepageContent
      user={user}
      products={prods ?? []}
      subscription={sub}
      paddleSubscription={paddleSub}
      paddleProducts={paddleProds ?? []}
      lsSubscription={lsSub}
      lsProducts={lsProds}
    />
  );
}
