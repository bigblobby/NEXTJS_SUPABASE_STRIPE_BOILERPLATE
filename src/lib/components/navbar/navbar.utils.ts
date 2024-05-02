'use client';

import toast from 'react-hot-toast';
import { createClient } from '@/lib/utils/supabase/client';

export async function handleSignOut(e: React.FormEvent<HTMLFormElement>, router: any) {
  e.preventDefault();

  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    toast.error('You could not be signed out.');
  } else {
    toast.success('Successfully signed out.');
    router.refresh();
  }
}