import Pricing from '@/lib/components/pricing';
import { User } from '@supabase/supabase-js';
import CTA from '@/lib/components/cta';
import FAQ from '@/lib/components/faq';
import Hero from '@/lib/components/hero';
import Newsletter from '@/lib/components/newsletter';
import { LsSubscription, PaddleSubscription, Subscription } from '@/lib/types/supabase/table.types';
import TestimonialLarge from '@/lib/components/testimonial-large';
import FeatureTabs from '@/lib/components/feature-tabs';

interface HomepageContentProps {
  user: User | null | undefined;
  subscription: Subscription | null;
  paddleSubscription: PaddleSubscription | null;
  lsSubscription: LsSubscription | null;
}

export default function HomepageContent({
  user,
  subscription,
  paddleSubscription,
  lsSubscription,
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
        subscription={subscription}
        paddleSubscription={paddleSubscription}
        lsSubscription={lsSubscription}
      />
      <FAQ />
      <CTA />
    </>
  )
}