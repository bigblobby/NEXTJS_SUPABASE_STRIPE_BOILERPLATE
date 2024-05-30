import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

const key = process.env.LEMONSQUEEZY_API_KEY!

export const setupLemonSqueezy = () => {
  lemonSqueezySetup({ apiKey: key });
}