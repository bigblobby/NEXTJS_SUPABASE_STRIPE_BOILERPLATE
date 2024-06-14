import { AppConfig } from '@/lib/config/app-config';

export const billingConfig: BillingConfig = {
  provider: AppConfig.payments,
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



// export const billingConfig: BillingConfig = {
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

export interface BillingConfigLineItem {
  id: string;
  name: string;
  cost: number;
  type: 'flat',
}

export interface BillingConfigPlan {
  name: string;
  id: string;
  trialDays: number;
  paymentType: 'recurring' | 'one_time';
  interval: 'year' | 'month' | 'one_time';
  lineItems: BillingConfigLineItem[];
}

export interface BillingConfigProduct {
  id: string;
  name: string;
  description: string;
  currency: 'USD',
  isFeatured: boolean;
  features: { name: string }[],
  plans: BillingConfigPlan[],
}

export interface BillingConfig {
  provider: 'stripe' | 'ls' | 'paddle';
  products: BillingConfigProduct[];
}

// export const billingConfig: BillingConfig = {
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
//           trialDays: 7,
//           paymentType: 'recurring',
//           interval: 'month',
//           lineItems: [
//             {
//               id: '390321',
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
//               id: '390320',
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