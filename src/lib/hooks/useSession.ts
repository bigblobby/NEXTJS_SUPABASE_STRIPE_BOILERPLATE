import { useContext } from 'react';
import { ISessionContextState, SessionContext } from '@/lib/providers/session-provider';

export function useSession() {
  return useContext<ISessionContextState>(SessionContext);
}