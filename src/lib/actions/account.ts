'use server';

import { createClient } from '@/lib/utils/supabase/server';
import { getURL } from '@/lib/utils/helpers';
import { z } from 'zod';

const emailSchema = z.string().email();

export async function updateEmail(formData: FormData) {
  const newEmail = String(formData.get('newEmail')).trim();

  if (!emailSchema.safeParse(newEmail)) {
    return { error: 'Invalid email address.' };
  }

  const supabase = createClient();

  const callbackUrl = getURL('/account');

  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    {
      emailRedirectTo: callbackUrl
    }
  );

  if (error) {
    return { error: error.message };
  } else {
    return { message: 'You will need to confirm the update by clicking the links sent to both the old and new email addresses.' };
  }
}

export async function updateName(formData: FormData) {
  const supabase = createClient();

  const fullName = String(formData.get('fullName')).trim();

  const { data: { user }, error: userError} = await supabase.auth.getUser();

  if (userError) {
    return { error: userError.message };
  }

  if (user) {
    const { data, error } = await supabase
      .from('users')
      .update({
        full_name: fullName
      })
      .eq('id', user.id)
      .select('*')
      .single();

    if (error) {
      return { error: error.message };
    } else if (data) {
      return { message: 'Success! Your name has been updated.' };
    } else {
      return { error: 'Your name could not be updated.' };
    }
  } else {
    return { error: 'Your name could not be updated.' };
  }
}