'use client';

import { createContext } from 'react';
import { User } from '@supabase/supabase-js';

export interface IUserContextState {
  user: User | null;
}

export const UserContext = createContext<IUserContextState>({
  user: null
});

export default function UserProvider({
  user,
  children
}: any) {
  return (
    <UserContext.Provider value={{user: user}}>
      {children}
    </UserContext.Provider>
  )
}