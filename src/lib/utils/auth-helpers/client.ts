'use client';

import { type Provider } from '@supabase/supabase-js';
import { createClient } from '@/lib/utils/supabase/client';
import { getURL } from '@/lib/utils/helpers';

export async function signInWithOAuth(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const provider = String(formData.get('provider')).trim() as Provider;

  const supabase = createClient();
  const redirectURL = getURL('/auth/callback');

  const {data, error} = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: redirectURL
    }
  });

  if (error){
    console.error(error);
  }
}
