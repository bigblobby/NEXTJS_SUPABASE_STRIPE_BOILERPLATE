// This is where the various config options sit
export const AppConfig = {
  trialPeriodDays: 7, // Change to control trial period length
  trialPeriodCollectCard: false, // Choose whether to collect credit card details or not on checkout for initial trial period
  auth: {
    allowOauth: true, // Allow users to sign in with 0auth
    allowEmail: true, // Allow users to sign in via magic link (at least one of the two options allowEmail/allowPassword must be true)
    allowPassword: true, // Allow users to sign in using a password (at least one of the two options allowEmail/allowPassword must be true)
  },
  stripe: {
    useEmbeddedCheckout: true, // Show the checkout on the site itself, rather than going to a stripe hosted page
  },
  paddle: {
    useOverlayCheckout: true, // Show the checkout as an overlay rather than inline.
  }
}