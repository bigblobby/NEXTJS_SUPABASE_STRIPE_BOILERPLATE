'use client';

import { createContext, useContext, ReactNode } from 'react';

const AccountsContext = createContext<any[]>([]);

export function AccountsProvider({ children, data }: { children: ReactNode; data: any[] }) {
  return <AccountsContext.Provider value={data}>{children}</AccountsContext.Provider>;
}

export function useAccounts() {
  return useContext(AccountsContext);
}