'use server';

import { createClient } from '@/lib/utils/supabase/server';
import { getURL } from '@/lib/utils/helpers';
import { z } from 'zod';
import { actionClient } from '@/lib/utils/safe-action';
import { updateNameSchema } from '@/lib/schemas/updateNameSchema';

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
    { emailRedirectTo: callbackUrl }
  );

  if (error) {
    return { error: error.message };
  } else {
    return { message: 'You will need to confirm the update by clicking the links sent to both the old and new email addresses.' };
  }
}

export const updateName = actionClient
  .schema(updateNameSchema)
  .action(async ({ parsedInput: { name }}) => {
    const supabase = createClient();

    const { data: { user }, error: userError} = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw Error('Your name could not be updated');

    const { data, error } = await supabase
      .from('users')
      .update({
        full_name: name
      })
      .eq('id', user.id)
      .select('*')
      .single();

    if (error) {
      throw error;
    } else if (data) {
      return { message: 'Success! Your name has been updated.' };
    } else {
      throw Error('Your name could not be updated');
    }
  });