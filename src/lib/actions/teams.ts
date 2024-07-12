'use server';

import { actionClient } from '@/lib/utils/safe-action';
import { createTeamSchema } from '@/lib/schemas/createTeamSchema';
import { redirect } from 'next/navigation';
export const createTeam = actionClient
  .schema(createTeamSchema)
  .action(async ({ parsedInput: { name, slug } }) => {
    // TODO: Implement the create team action
    console.log('Creating team with name:', name, 'and slug:', slug);

    redirect(`/dashboard/${slug}`);
  });