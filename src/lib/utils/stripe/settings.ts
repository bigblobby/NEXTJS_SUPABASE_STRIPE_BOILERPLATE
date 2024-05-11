import { CheckoutView } from '@/lib/enums/stripe.enums';
import { AppConfig } from '@/lib/config/app-config';

export function getCheckoutView(): CheckoutView {
  return AppConfig.stripe.useEmbeddedCheckout ? CheckoutView.Embedded : CheckoutView.Hosted;
}