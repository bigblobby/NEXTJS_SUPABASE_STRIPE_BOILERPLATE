'use server';

import { actionClient } from '@/lib/utils/safe-action';
import { createTeamSchema } from '@/lib/schemas/createTeamSchema';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/server';

export const createTeam = actionClient
  .schema(createTeamSchema)
  .action(async ({ parsedInput: { name, slug } }) => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('accounts')
      .insert({
        name,
        slug,
      });


    if (error) {
      return {
        message: error.message,
      };
    }

    console.log(data);
    console.log('Creating team with name:', name, 'and slug:', slug);

    // redirect(`/dashboard/${slug}`);
  });