'use server';

import { listStores, listProducts } from '@lemonsqueezy/lemonsqueezy.js';
import { setupLemonSqueezy } from '@/lib/utils/lemon-squeezy/config';

setupLemonSqueezy();

async function getStores() {
  return await listStores();
}

async function getProducts() {
  return await listProducts({include: ['variants']});
}

export {
  getStores,
  getProducts,
}