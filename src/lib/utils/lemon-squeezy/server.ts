'use server';

import { listStores, listProducts, getOrder, getVariant } from '@lemonsqueezy/lemonsqueezy.js';
import { setupLemonSqueezy } from '@/lib/utils/lemon-squeezy/config';

setupLemonSqueezy();

async function getStores() {
  return await listStores();
}

async function getProducts() {
  const { statusCode, error, data } = await listProducts({include: ['variants']});
  return data;
}

async function getOrderById(orderId: string) {
  return await getOrder(orderId, {include: ['subscriptions']});
}

async function getVariantById(variantId: string) {
  const { statusCode, error, data } = await getVariant(variantId);

  return data;
}

export {
  getStores,
  getProducts,
  getOrderById,
  getVariantById,
}