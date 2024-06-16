import { AppConfig } from '@/lib/config/app-config';
import { BillingSchema } from '@/lib/types/billing.types';

export const billingSchema: BillingSchema = {
  provider: AppConfig.payments,
  products: [
    {
      id: 'standard',
      name: 'Standard',
      description: 'The perfect plan to get started',
      currency: 'GBP',
      isFeatured: false,
      features: [
        {name: 'Life time updates'},
        {name: 'Ready made components'},
        {name: 'Payments (Stripe)'},
      ],
      plans: [
        {
          name: 'Standard Monthly',
          id: 'standard-monthly',
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
          name: 'Standard Yearly',
          id: 'standard-yearly',
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
        },
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'The perfect plan to get started',
      currency: 'GBP',
      isFeatured: true,
      features: [
        {name: 'Life time updates'},
        {name: 'Ready made components'},
        {name: 'Payments (Stripe)'},
      ],
      plans: [
        {
          name: 'Premium Monthly',
          id: 'premium-monthly',
          trialDays: 7,
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_1P8Q8ALRGwjtCfxMHxDjr9s1',
              name: 'Addon 2',
              cost: 14.99,
              type: 'flat',
            },
          ],
        },
        {
          name: 'Premium Yearly',
          id: 'premium-yearly',
          trialDays: 7,
          paymentType: 'recurring',
          interval: 'year',
          lineItems: [
            {
              id: 'price_1PPqwWLRGwjtCfxMXeo1kPVI',
              name: 'Addon 2',
              cost: 149.99,
              type: 'flat',
            },
          ],
        }
      ],
    },
    {
      id: 'platinum',
      name: 'Platinum',
      description: 'The perfect plan to get started',
      currency: 'GBP',
      isFeatured: false,
      features: [
        {name: 'Life time updates'},
        {name: 'Ready made components'},
        {name: 'Payments (Stripe)'},
        {name: 'Payments (Stripe)'},
        {name: 'Payments (Stripe)'},
      ],
      plans: [
        {
          name: 'Platinum Monthly',
          id: 'platinum-monthly',
          trialDays: 7,
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_1P8Q8ALRGwjtCfxMHxDjr9s1',
              name: 'Addon 2',
              cost: 22.99,
              type: 'flat',
            },
          ],
        },
        {
          name: 'Platinum Yearly',
          id: 'platinum-yearly',
          trialDays: 7,
          paymentType: 'recurring',
          interval: 'year',
          lineItems: [
            {
              id: 'price_1PPqwWLRGwjtCfxMXeo1kPVI',
              name: 'Addon 2',
              cost: 229.99,
              type: 'flat',
            },
          ],
        }
      ],
    },
    {
      id: 'forever',
      name: 'Forever',
      description: 'The perfect plan to get started',
      currency: 'GBP',
      isFeatured: false,
      features: [
        {name: 'Life time updates'},
        {name: 'Ready made components'},
        {name: 'Payments (Stripe)'},
      ],
      plans: [
        {
          name: 'Forever',
          id: 'forever-life-time',
          trialDays: 7,
          paymentType: 'recurring',
          interval: 'life_time',
          lineItems: [
            {
              id: 'price_1PD7mNLRGwjtCfxMKmxvHNyD',
              name: 'Addon 2',
              cost: 299.99,
              type: 'flat',
            },
          ],
        }
      ]
    },
  ]
};



// export const billingSchema: BillingSchema = {
//   provider: AppConfig.payments,
//   products: [
//     {
//       id: 'starter',
//       name: 'Starter',
//       description: 'The perfect plan to get started',
//       currency: 'USD',
//       isFeatured: true,
//       features: [
//         {name: 'Life time updates'},
//         {name: 'Ready made components'},
//         {name: 'Payments (Paddle)'},
//       ],
//       plans: [
//         {
//           name: 'Starter Monthly',
//           id: 'starter-monthly',
//           trialDays: 7,
//           paymentType: 'one_time',
//           interval: 'one_time',
//           lineItems: [
//             {
//               id: 'pri_01hy1578wadcemgntc7tx1dfdv',
//               name: 'Addon 2',
//               cost: 10,
//               type: 'flat',
//             },
//           ],
//         },
//         {
//           name: 'Starter Yearly',
//           id: 'starter-yearly',
//           trialDays: 7,
//           paymentType: 'recurring',
//           interval: 'year',
//           lineItems: [
//             {
//               id: 'pri_01hy155j77a6wbtqddv772mwa9',
//               name: 'Addon 2',
//               cost: 100,
//               type: 'flat',
//             },
//           ],
//         }
//       ],
//     }
//   ]
// };

// export const billingSchema: BillingSchema = {
//   provider: AppConfig.payments,
//   products: [
//     {
//       id: 'starter',
//       name: 'Starter',
//       description: 'The perfect plan to get started',
//       currency: 'USD',
//       isFeatured: true,
//       features: [
//         {name: 'Life time updates'},
//         {name: 'Ready made components'},
//         {name: 'Payments (Stripe/Lemon Squeezy/Paddle)'},
//       ],
//       plans: [
//         {
//           name: 'Starter Monthly',
//           id: 'starter-monthly',
//           paymentType: 'recurring',
//           interval: 'month',
//           lineItems: [
//             {
//               id: '390321',
//               name: 'Addon 2',
//               cost: 5,
//               type: 'flat',
//             },
//           ],
//         },
//         {
//           name: 'Starter Yearly',
//           id: 'starter-yearly',
//           paymentType: 'recurring',
//           interval: 'year',
//           lineItems: [
//             {
//               id: '390320',
//               name: 'Addon 2',
//               cost: 50,
//               type: 'flat',
//             },
//           ],
//         }
//       ],
//     }
//   ]
// };