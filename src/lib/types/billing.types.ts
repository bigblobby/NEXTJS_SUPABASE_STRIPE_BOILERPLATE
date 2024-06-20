import { AppConfigPayments } from '@/lib/config/app-config';

export type BillingIntervalType = 'month' | 'year' | 'life_time' | 'one_time';
export type BillingPaymentType = 'recurring' | 'one_time';
export type BillingLineItemPaymentType = 'flat';

export interface BillingSchemaLineItem {
  id: string;
  name: string;
  cost: number;
  type: BillingLineItemPaymentType;
}

export interface BillingSchemaPlan {
  name: string;
  id: string;
  trialDays?: number;
  paymentType: BillingPaymentType;
  interval: BillingIntervalType | null;
  lineItems: BillingSchemaLineItem[];
}

export interface BillingSchemaProduct {
  id: string;
  name: string;
  description: string;
  currency: 'USD' | 'GBP';
  isFeatured: boolean;
  features: { name: string }[];
  plans: BillingSchemaPlan[];
}

export interface BillingSchema {
  provider: AppConfigPayments;
  products: BillingSchemaProduct[];
}