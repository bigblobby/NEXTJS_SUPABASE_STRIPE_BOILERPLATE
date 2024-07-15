import { useContext } from 'react';
import { CurrentAccountContext } from '@/lib/providers/current-account-provider';

export function useCurrentAccount() {
  return useContext(CurrentAccountContext);
}