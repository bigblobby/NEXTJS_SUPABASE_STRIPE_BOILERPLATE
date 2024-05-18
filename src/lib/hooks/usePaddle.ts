import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function usePaddle() {
  // Create a local state to store Paddle instance
  const [paddle, setPaddle] = useState<Paddle>();
  const router = useRouter();

  // Download and initialize Paddle instance from CDN
  useEffect(() => {
    initializePaddle({
      environment: process.env.NODE_ENV === 'development' ? 'sandbox' : 'production',
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN as string,
      eventCallback: function(data) {
        if (data.name == "checkout.completed") {
          router.push(`/purchase-confirmation?transaction_id=${data.data?.transaction_id}`);
        }
      }
    }).then(
      (paddleInstance: Paddle | undefined) => {
        if (paddleInstance) {
          setPaddle(paddleInstance);
        }
      },
    );
  }, []);

 return paddle;
}