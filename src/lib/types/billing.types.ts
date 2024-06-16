import { AppConfigPayments } from '@/lib/config/app-config';

export type BillingIntervalType = 'one_time' | 'year' | 'month';

export interface BillingConfigLineItem {
  id: string;
  name: string;
  cost: number;
  type: 'flat',
}

export interface BillingConfigPlan {
  name: string;
  id: string;
  trialDays?: number;
  paymentType: 'recurring' | 'one_time';
  interval: BillingIntervalType;
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
  provider: AppConfigPayments;
  products: BillingConfigProduct[];
}