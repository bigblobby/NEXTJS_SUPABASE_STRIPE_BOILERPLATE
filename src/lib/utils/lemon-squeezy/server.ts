'use server';

import {
  listProducts,
  createCheckout,
  createCustomer,
  type NewCustomer,
  getCustomer,
} from '@lemonsqueezy/lemonsqueezy.js';
import { setupLemonSqueezy } from '@/lib/utils/lemon-squeezy/config';
import { createClient } from '@/lib/utils/supabase/server';
import { createOrRetrieveLsCustomer } from '@/lib/utils/supabase/admin/lemon-squeezy';

setupLemonSqueezy();

async function getProducts() {
  const { data, error } = await listProducts({include: ['variants']});

  if (error) {
    return { error: error.message };
  }

  return { data };
}

async function createLsCustomer(storeId: string, customerData: NewCustomer) {
  const { data, error } = await createCustomer(storeId, customerData);

  if (error) {
    return { error: error.message };
  }

  return { data };
}

async function getCustomerById(customerId: string) {
  const { data, error } = await getCustomer(customerId);

  if (error) {
    return { error: error.message };
  }

  return { data };
}

async function checkoutWithLS(product: any) {
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

    await createOrRetrieveLsCustomer({
      storeId: product.attributes.store_id,
      uuid: user.id || '',
      email: user.email || ''
    });

    const { data, error: checkoutError } = await createCheckout(
      product.attributes.store_id,
      product.variant.id,
      {
        checkoutOptions: {
          embed: false
        },
        checkoutData: {
          email: user.email ?? '',
        }
      }
    );

    if (checkoutError) {
      return { data: null, error: checkoutError.message };
    }

    return { data: data.data.attributes.url, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: 'An unknown error occurred. Please try again later or contact a system administrator.' };
    }
  }
}

export {
  getProducts,
  checkoutWithLS,
  createLsCustomer,
  getCustomerById,
}