'use client';

import { usePaddle } from '@/lib/hooks/usePaddle';
import { Button } from '@/lib/components/ui/button';

export default function Page(){
  const paddle = usePaddle();

  const initialised = paddle?.Initialized;

  console.log(initialised);

  function test() {
    const itemsList = [
      {
        priceId: 'pri_01hxwf4m1nfv9jp5f2mecrd66w',
        quantity: 1
      },
    ];

    paddle?.Checkout.open({
      settings: {
        displayMode: "overlay",
        theme: "light",
        locale: "en"
      },
      items: itemsList,
    })
  }

  return (
    <div>
      <Button onClick={test}>Checkout</Button>
      Test page
    </div>
  )
}