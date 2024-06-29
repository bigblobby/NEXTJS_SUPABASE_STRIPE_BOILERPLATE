import { AppConfig } from '@/lib/config/app-config';
import StripePurchaseConfirmation from '@/app/(public)/(main)/purchase-confirmation/stripe-purchase-confirmation';
import PaddlePurchaseConfirmation from '@/app/(public)/(main)/purchase-confirmation/paddle-purchase-confirmation';

interface PurchaseConfirmationPageProps {
  searchParams: {
    session_id?: string;
    transaction_id?: string;
    type?: string;
  }
}

export default function PurchaseConfirmationPage({searchParams}: PurchaseConfirmationPageProps) {
  if (AppConfig.payments === 'stripe'){
    return <StripePurchaseConfirmation sessionId={searchParams.session_id} type={searchParams.type} />
  } else if (AppConfig.payments === 'paddle'){
    return <PaddlePurchaseConfirmation transactionId={searchParams.transaction_id} />
  }

  return null;
}