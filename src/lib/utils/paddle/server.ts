'use server';

import { createClient } from '@/lib/utils/supabase/server';
import { createOrRetrievePaddleCustomer } from '@/lib/utils/supabase/admin/paddle';
import { paddle } from '@/lib/utils/paddle/config';

interface CheckoutResponse {
  error?: string;
  customer?: string;
}

async function checkoutWithPaddle(): Promise<CheckoutResponse> {
  try {
    const supabase = createClient();
    const {
      error,
      data: { user }
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(error);
      throw new Error('Could not get user session.');
    }

    let customer: string;

    try {
      customer = await createOrRetrievePaddleCustomer({
        uuid: user?.id || '',
        email: user?.email || ''
      });
    } catch (err) {
      console.error(err);
      throw new Error('Unable to access customer record.');
    }

    return { customer: customer };
  } catch (error) {
    if (error instanceof Error) {
      return { error: 'An unknown error occurred. Please try again later or contact a system administrator.' };
    } else {
      return { error: 'An unknown error occurred. Please try again later or contact a system administrator.' };
    }
  }
}

async function getCustomerIdAndTransactionStatusByTransactionById(transactionId: string) {
  const transaction = await paddle.transactions.get(transactionId);
  return {
    customerId: transaction.customerId,
    status: transaction.status,
  };
}

async function getCustomerById(customerId: string) {
  const customer = await paddle.customers.get(customerId);
  return JSON.parse(JSON.stringify(customer));
}

export {
  checkoutWithPaddle,
  getCustomerIdAndTransactionStatusByTransactionById,
  getCustomerById,
}