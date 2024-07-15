'use client';

import { createContext } from 'react';
import { User } from '@supabase/supabase-js';

export type IUserContextState = User | null;

export const UserContext = createContext<IUserContextState>(null);

export default function UserProvider({
  user,
  children
}: any) {
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  )
}