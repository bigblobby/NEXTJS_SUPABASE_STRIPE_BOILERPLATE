import Pricing from '@/lib/components/pricing';
import { User } from '@supabase/supabase-js';
import CTA from '@/lib/components/cta';
import FAQ from '@/lib/components/faq';
import Hero from '@/lib/components/hero';
import Newsletter from '@/lib/components/newsletter';
import { PaddleProductWithPrices, PaddleSubscription, type ProductWithPrices, SubscriptionWithProduct } from '@/lib/types/supabase/table.types';
import TestimonialLarge from '@/lib/components/testimonial-large';
import FeatureTabs from '@/lib/components/feature-tabs';
import PaddlePricing from '@/lib/components/paddle-pricing';

interface HomepageContentProps {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
  paddleSubscription: PaddleSubscription | null;
  paddleProducts: PaddleProductWithPrices[];
}

export default function HomepageContent({
  user,
  products,
  subscription,
  paddleSubscription,
  paddleProducts,
}: HomepageContentProps) {
  return (
    <>
      <Hero />
      <FeatureTabs />
      <TestimonialLarge
        name="John Doe"
        title="CTO at Acme"
        content={`"NextJS Boilerplate is just awesome. It contains tons of predesigned components and pages starting from login screen to complex dashboard. Perfect choice for your next SaaS application."`}
      />
      <Newsletter />
      <Pricing
        user={user}
        products={products ?? []}
        subscription={subscription}
      />
      <PaddlePricing
        user={user}
        paddleProducts={paddleProducts}
        paddleSubscription={paddleSubscription}
      />
      <FAQ />
      <CTA />
    </>
  )
}