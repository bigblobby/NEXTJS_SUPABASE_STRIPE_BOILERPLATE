import { useContext } from 'react';
import { IUserContextState, UserContext } from '@/lib/providers/user-provider';

export function useUser() {
  return useContext<IUserContextState>(UserContext);
}