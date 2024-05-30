import Pricing from '@/lib/components/pricing';
import { User } from '@supabase/supabase-js';
import CTA from '@/lib/components/cta';
import FAQ from '@/lib/components/faq';
import Hero from '@/lib/components/hero';
import Newsletter from '@/lib/components/newsletter';
import { LsSubscription, PaddleProductWithPrices, PaddleSubscription, type ProductWithPrices, Subscription } from '@/lib/types/supabase/table.types';
import TestimonialLarge from '@/lib/components/testimonial-large';
import FeatureTabs from '@/lib/components/feature-tabs';
import PaddlePricing from '@/lib/components/paddle-pricing';
import { AppConfig } from '@/lib/config/app-config';
import LsPricing from '@/lib/components/ls-pricing';
import { ListProducts } from '@lemonsqueezy/lemonsqueezy.js';

interface HomepageContentProps {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: Subscription | null;
  paddleSubscription: PaddleSubscription | null;
  paddleProducts: PaddleProductWithPrices[];
  lsSubscription: LsSubscription | null;
  lsProducts: ListProducts | null;
}

export default function HomepageContent({
  user,
  products,
  subscription,
  paddleSubscription,
  paddleProducts,
  lsSubscription,
  lsProducts,
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
      {AppConfig.payments === 'stripe' && (
        <Pricing
          user={user}
          products={products ?? []}
          subscription={subscription}
        />
      )}
      {AppConfig.payments === 'paddle' && (
        <PaddlePricing
          user={user}
          paddleProducts={paddleProducts}
          paddleSubscription={paddleSubscription}
        />
      )}
      {AppConfig.payments === 'ls' && (
        <LsPricing
          user={user}
          lsProducts={lsProducts}
          lsSubscription={lsSubscription}
        />
      )}
      <FAQ />
      <CTA />
    </>
  )
}