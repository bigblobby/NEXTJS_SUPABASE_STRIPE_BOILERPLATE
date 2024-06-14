import { BillingConfigLineItem } from '@/lib/config/billing-config';

export function formatLineItems(lineItems: BillingConfigLineItem[]) {
  return lineItems.map((lineItem: BillingConfigLineItem) => {
    return {
      priceId: lineItem.id,
      quantity: 1,
    }
  });
}