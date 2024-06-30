'use client';

import Pricing from '@/lib/components/pricing';
import { User } from '@supabase/supabase-js';
import CTA from '@/lib/components/cta';
import FAQ from '@/lib/components/faq';
import Hero from '@/lib/components/hero';
import Newsletter from '@/lib/components/newsletter';
import { LsSubscription, PaddleSubscription, Subscription } from '@/lib/types/supabase/table.types';
import TestimonialLarge from '@/lib/components/testimonial-large';
import FeatureTabs from '@/lib/components/feature-tabs';
import { motion, Variants } from "framer-motion";
import WithWithout from '@/lib/components/with-without';

interface HomepageContentProps {
  user: User | null | undefined;
  subscription: Subscription | null;
  paddleSubscription: PaddleSubscription | null;
  lsSubscription: LsSubscription | null;
}

const sectionVariants: Variants = {
  offscreen: {
    y: 20,
    opacity: 0,
    scale: 0.9,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "tween",
      duration: 0.2
    }
  }
};

export default function HomepageContent({
  user,
  subscription,
  paddleSubscription,
  lsSubscription,
}: HomepageContentProps) {
  return (
    <>
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.8 }}
      >
        <motion.div variants={sectionVariants}>
          <Hero />
        </motion.div>
      </motion.div>

      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.8 }}
      >
        <motion.div variants={sectionVariants}>
          <FeatureTabs />
        </motion.div>
      </motion.div>

      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.8 }}
      >
        <motion.div variants={sectionVariants}>
          <TestimonialLarge
            name="John Doe"
            title="CTO at Acme"
            content={`"NextJS Boilerplate is just awesome. It contains tons of predesigned components and pages starting from login screen to complex dashboard. Perfect choice for your next SaaS application."`}
          />
        </motion.div>
      </motion.div>

      <Newsletter />

      <WithWithout />

      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.8 }}
      >
        <motion.div variants={sectionVariants}>
          <Pricing
            user={user}
            subscription={subscription}
            paddleSubscription={paddleSubscription}
            lsSubscription={lsSubscription}
          />
        </motion.div>
      </motion.div>
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.8 }}
      >
        <motion.div variants={sectionVariants}>
          <FAQ />
        </motion.div>
      </motion.div>
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.8 }}
      >
        <motion.div variants={sectionVariants}>
          <CTA />
        </motion.div>
      </motion.div>
    </>
  )
}