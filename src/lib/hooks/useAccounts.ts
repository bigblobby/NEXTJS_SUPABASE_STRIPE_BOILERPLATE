import { useContext } from 'react';
import { AccountsContext } from '@/lib/providers/accounts-provider';

export function useAccounts() {
  return useContext(AccountsContext);
}