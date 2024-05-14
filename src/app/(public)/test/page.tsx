'use client';

import { usePaddle } from '@/lib/hooks/usePaddle';

export default function Page(){
  const paddle = usePaddle();

  const initialised = paddle?.Initialized;

  console.log(initialised);

  return (
    <div>
      Test page
    </div>
  )
}