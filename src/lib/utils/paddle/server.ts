'use server';

import { createClient } from '@/lib/utils/supabase/server';
import { createOrRetrievePaddleCustomer } from '@/lib/utils/supabase/admin/paddle';
import { paddle } from '@/lib/utils/paddle/config';
import { Product } from '@paddle/paddle-node-sdk/dist/types/entities';

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

    if (!user.email) {
      console.error('No email attached to user. You must only allow email signups.')
      throw new Error('No email attached to user');
    }

    try {
      let customer = await createOrRetrievePaddleCustomer(user.id, user.email);
      return { customer };
    } catch (error) {
      console.error(error);
      throw error;
    }

  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
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

async function getAddressById(customerId: string, addressId: string) {
  const address = await paddle.addresses.get(customerId, addressId);
  return JSON.parse(JSON.stringify(address));
}

async function getProductById(productId: string): Promise<Product> {
  const product = await paddle.products.get(productId);
  return JSON.parse(JSON.stringify(product));
}

export {
  checkoutWithPaddle,
  getCustomerIdAndTransactionStatusByTransactionById,
  getCustomerById,
  getAddressById,
  getProductById,
}