import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { useEffect, useState } from 'react';

export function usePaddle() {
  // Create a local state to store Paddle instance
  const [paddle, setPaddle] = useState<Paddle>();

  // Download and initialize Paddle instance from CDN
  useEffect(() => {
    initializePaddle({ environment: 'sandbox', token: process.env.PADDLE_CLIENT_TOKEN as string }).then(
      (paddleInstance: Paddle | undefined) => {
        if (paddleInstance) {
          setPaddle(paddleInstance);
        }
      },
    );
  }, []);

 return paddle;
}