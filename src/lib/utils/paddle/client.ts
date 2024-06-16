import { BillingConfigLineItem } from '@/lib/types/billing.types';

export function formatLineItems(lineItems: BillingConfigLineItem[]) {
  return lineItems.map((lineItem: BillingConfigLineItem) => {
    return {
      priceId: lineItem.id,
      quantity: 1,
    }
  });
}