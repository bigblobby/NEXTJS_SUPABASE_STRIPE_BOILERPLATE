import { AppConfig } from '@/lib/config/app-config';
import { PaddleCheckoutView } from '@/lib/enums/paddle.enums';

export function getCheckoutView(): PaddleCheckoutView {
  return AppConfig.paddle.useOverlayCheckout ? PaddleCheckoutView.Overlay : PaddleCheckoutView.Inline;
}