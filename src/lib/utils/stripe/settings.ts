import { StripeCheckoutView } from '@/lib/enums/stripe.enums';
import { AppConfig } from '@/lib/config/app-config';

export function getCheckoutView(): StripeCheckoutView {
  return AppConfig.stripe.useEmbeddedCheckout ? StripeCheckoutView.Embedded : StripeCheckoutView.Hosted;
}