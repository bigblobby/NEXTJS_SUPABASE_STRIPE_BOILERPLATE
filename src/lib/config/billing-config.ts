export const billingConfig = {
  provider: 'stripe',
  products: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'The perfect plan to get started',
      currency: 'USD',
      isFeatured: true,
      features: [
        {name: 'Life time updates'},
        {name: 'Ready made components'},
        {name: 'Payments (Stripe/Lemon Squeezy/Paddle)'},
      ],
      plans: [
        {
          name: 'Starter Monthly',
          id: 'starter-monthly',
          trialDays: 7,
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_1P8Q8ALRGwjtCfxMHxDjr9s1',
              name: 'Addon 2',
              cost: 9.99,
              type: 'flat',
            },
          ],
        },
        {
          name: 'Starter Yearly',
          id: 'starter-yearly',
          trialDays: 7,
          paymentType: 'recurring',
          interval: 'year',
          lineItems: [
            {
              id: 'price_1PPqwWLRGwjtCfxMXeo1kPVI',
              name: 'Addon 2',
              cost: 99.99,
              type: 'flat',
            },
          ],
        }
      ],
    }
  ]
};