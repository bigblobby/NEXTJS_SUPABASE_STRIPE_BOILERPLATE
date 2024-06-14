type AppConfigPayments = 'stripe' | 'paddle' | 'ls';

interface IAppConfig {
  locale: string;
  auth: {
    allowOauth: boolean;
    allowEmail: boolean;
    allowPassword: boolean;
  },
  payments: AppConfigPayments;
  stripe: {
    useEmbeddedCheckout: boolean;
    trialPeriodDays: number;
    trialPeriodCollectCard: boolean;
  },
  paddle: {
    useOverlayCheckout: boolean;
  },
  lemonSqueezy: {
    storeNameUrl: string;
    storeId: string;
    currency: string;
  }
}

export const AppConfig: IAppConfig = {
  locale: 'en-US',
  payments: 'stripe',
  auth: {
    allowOauth: true, // Allow users to sign in with 0auth
    allowEmail: true, // Allow users to sign in via magic link (at least one of the two options allowEmail/allowPassword must be true)
    allowPassword: true, // Allow users to sign in using a password (at least one of the two options allowEmail/allowPassword must be true)
  },
  stripe: {
    useEmbeddedCheckout: true, // Show the checkout on the site itself, rather than going to a stripe hosted page
    trialPeriodDays: 0, // Change to control trial period length
    trialPeriodCollectCard: false, // Choose whether to collect credit card details or not on checkout for initial trial period
  },
  paddle: {
    useOverlayCheckout: true, // Show the checkout as an overlay rather than inline.
  },
  lemonSqueezy: {
    storeNameUrl: 'nextjsboilerplate',
    storeId: '89767',
    currency: 'GBP',
  }
}