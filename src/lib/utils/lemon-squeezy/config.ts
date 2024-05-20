import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

const key = process.env.LEMONSQUEEZY_API_KEY!

export const setupLemonSqueezy = () => {
  //@ts-ignore
  lemonSqueezySetup({ apiKey: key });
}