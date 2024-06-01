'use server';

import { listStores, listProducts, getOrder, getVariant, createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import { setupLemonSqueezy } from '@/lib/utils/lemon-squeezy/config';

setupLemonSqueezy();

async function getStores() {
  return await listStores();
}

async function getProducts() {
  const { data } = await listProducts({include: ['variants']});
  return data;
}

async function getOrderById(orderId: string) {
  return await getOrder(orderId, {include: ['subscriptions']});
}

async function getVariantById(variantId: string) {
  const { data } = await getVariant(variantId);

  return data;
}

async function checkoutWithLS(product: any, email?: string) {
  const { data, error } = await createCheckout(
    product.attributes.store_id,
    product.variant.id,
    {
      checkoutOptions: {
        embed: false
      },
      checkoutData: {
        email: email ?? '',
      }
    }
  );

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data.data.attributes.url, error: null };
}

export {
  getStores,
  getProducts,
  getOrderById,
  getVariantById,
  checkoutWithLS,
}