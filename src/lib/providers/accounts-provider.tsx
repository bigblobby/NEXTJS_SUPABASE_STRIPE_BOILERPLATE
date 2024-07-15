'use client';

import { createContext, ReactNode } from 'react';

export const AccountsContext = createContext<any[]>([]);

export function AccountsProvider({ children, data }: { children: ReactNode; data: any[] }) {
  return <AccountsContext.Provider value={data}>{children}</AccountsContext.Provider>;
}