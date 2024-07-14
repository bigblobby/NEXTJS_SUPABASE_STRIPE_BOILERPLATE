'use server';

import { createClient } from '@/lib/utils/supabase/server';

export async function getAccounts() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not found');
  }

  const { data, error } = await supabase
    .from('accounts')
    .select(`
      *,
      account_user (*)
    `)
    .eq('account_user.user_id', user.id);

  if (error) {
    console.log(error);
    throw error;
  }

  return data?.map((account: any) => {
    return {
      account_id: account.account_user[0].account_id,
      account_role: account.account_user[0].account_role,
      is_primary_owner: account.primary_owner_user_id === user.id,
      name: account.name,
      slug: account.slug,
      personal_account: account.personal_account,
      created_at: account.created_at,
      updated_at: account.updated_at
    };
  });
}