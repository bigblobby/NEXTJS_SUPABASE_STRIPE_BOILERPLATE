export enum CheckoutView {
  Embedded = 'embedded',
  Hosted = 'hosted',
}

const useEmbeddedCheckout = true;

export function getCheckoutView(): CheckoutView {
  return useEmbeddedCheckout ? CheckoutView.Embedded : CheckoutView.Hosted;
}