import { BillingSchemaLineItem } from '@/lib/types/billing.types';

export function formatLineItems(lineItems: BillingSchemaLineItem[]) {
  return lineItems.map((lineItem: BillingSchemaLineItem) => {
    return {
      priceId: lineItem.id,
      quantity: 1,
    }
  });
}