import { AppConfigPayments } from '@/lib/config/app-config';

export type BillingIntervalType = 'one_time' | 'year' | 'month';

export interface BillingSchemaLineItem {
  id: string;
  name: string;
  cost: number;
  type: 'flat',
}

export interface BillingSchemaPlan {
  name: string;
  id: string;
  trialDays?: number;
  paymentType: 'recurring' | 'one_time';
  interval: BillingIntervalType;
  lineItems: BillingSchemaLineItem[];
}

export interface BillingSchemaProduct {
  id: string;
  name: string;
  description: string;
  currency: 'USD',
  isFeatured: boolean;
  features: { name: string }[],
  plans: BillingSchemaPlan[],
}

export interface BillingSchema {
  provider: AppConfigPayments;
  products: BillingSchemaProduct[];
}