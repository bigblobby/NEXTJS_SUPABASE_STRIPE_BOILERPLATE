'use server';

import {
  createCheckout,
  createCustomer,
  type NewCustomer,
  getCustomer,
  getProduct,
  getVariant,
} from '@lemonsqueezy/lemonsqueezy.js';
import { setupLemonSqueezy } from '@/lib/utils/lemon-squeezy/config';
import { createClient } from '@/lib/utils/supabase/server';
import { createOrRetrieveLsCustomer } from '@/lib/utils/supabase/admin/lemon-squeezy';
import { AppConfig } from '@/lib/config/app-config';
import { BillingSchemaPlan } from '@/lib/types/billing.types';

setupLemonSqueezy();

async function getProductById(productId: number) {
  const { data, error } = await getProduct(productId);

  if (error) {
    return { error: error.message };
  }

  return { data };
}

async function getProductVariantById(variantId: number) {
  const { data, error } = await getVariant(variantId);

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

async function checkoutWithLS(plan: BillingSchemaPlan) {
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
      storeId: AppConfig.lemonSqueezy.storeId,
      uuid: user.id || '',
      email: user.email || ''
    });

    const { data, error: checkoutError } = await createCheckout(
      AppConfig.lemonSqueezy.storeId,
      plan.lineItems[0].id,
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
  getProductById,
  getProductVariantById,
  checkoutWithLS,
  createLsCustomer,
  getCustomerById,
}