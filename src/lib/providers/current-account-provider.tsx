'use client';

import { createContext, ReactNode } from 'react';

export const CurrentAccountContext = createContext<any>(null);

export function CurrentAccountProvider({ children, data }: { children: ReactNode; data: any }) {
  return <CurrentAccountContext.Provider value={data}>{children}</CurrentAccountContext.Provider>;
}