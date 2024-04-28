import { useContext } from 'react';
import { ISessionContextState, SessionContext } from '@/src/lib/providers/session-provider';

export function useSession() {
  return useContext<ISessionContextState>(SessionContext);
}