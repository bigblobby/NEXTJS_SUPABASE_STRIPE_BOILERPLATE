'use server';

import { createClient } from '@/lib/utils/supabase/server';
import { getURL } from '@/lib/utils/helpers';
import { actionClient } from '@/lib/utils/safe-action';
import { updateNameSchema } from '@/lib/schemas/updateNameSchema';
import { updateEmailSchema } from '@/lib/schemas/updateEmailSchema';

export const updateEmail = actionClient
  .schema(updateEmailSchema)
  .action(async ({ parsedInput: { email } }) => {
    const callbackUrl = getURL('/account');
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser(
      { email: email },
      { emailRedirectTo: callbackUrl }
    );

    if (error) throw error;

    return { message: 'You will need to confirm the update by clicking the links sent to both the old and new email addresses.' };
  });

export const updateName = actionClient
  .schema(updateNameSchema)
  .action(async ({ parsedInput: { name }}) => {
    const supabase = createClient();

    const { data: { user }, error: userError} = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error('Your name could not be updated');

    const { data, error } = await supabase
      .from('accounts')
      .update({
        name: name
      })
      .eq('id', user.id)
      .select('*')
      .single();

    if (error) throw error;

    return { message: 'Success! Your name has been updated.' };
  });