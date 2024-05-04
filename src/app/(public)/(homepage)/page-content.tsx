import Pricing from '@/lib/components/pricing';
import { User } from '@supabase/supabase-js';
import CTA from '@/lib/components/cta';
import FAQ from '@/lib/components/faq';
import Hero from '@/lib/components/hero';
import Newsletter from '@/lib/components/newsletter';
import { type ProductWithPrices, SubscriptionWithProduct } from '@/lib/types/supabase/table.types';

interface HomepageContentProps {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

export default function HomepageContent({
  user,
  products,
  subscription
}: HomepageContentProps) {
  return (
    <>
      <Hero />
      <Newsletter />
      <Pricing
        user={user}
        products={products ?? []}
        subscription={subscription}
      />
      <FAQ />
      <CTA />
    </>
  )
}