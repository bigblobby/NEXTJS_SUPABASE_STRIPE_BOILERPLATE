'use server';

import { createClient } from '@/lib/utils/supabase/server';
import { User } from '@supabase/supabase-js';

export async function getAccounts(user: User) {
  const supabase = createClient();

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

export async function getAccountBySlug(slug: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('accounts')
    .select(`
      *
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.log(error);
    throw error;
  }

  return data;
}

// TODO fix this
export async function getAccountMembers(accountId: string, resultsLimit = 50, resultsOffset = 0) {
  const supabase = createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  return {}
  // const { data, error } = await supabase
  //   .from('account_user')
  //   .select(`
  //     *,
  //     accounts (*)
  //   `)
  //   .eq('account_id', accountId);

  // console.log(accountId);
  // const { data, error } = await supabase
  //   .from('account_user')
  //   .select(`
  //   user_id,
  //   account_role,
  //   accounts:account_id (
  //     *
  //   )
  // `)
  //   .eq('account_id', accountId)
  //   // .eq('accounts.personal_account', true)
  //
  // if (error) {
  //   console.log(error);
  //   throw error;
  // }
  //
  // return data?.map((accountUser: any) => {
  //   console.log(accountUser)
  //   return {};
  //   return {
  //     user_id: accountUser.user_id,
  //     account_role: accountUser.account_role,
  //     name: accountUser.accounts.name,
  //     email: userData.user?.email,
  //     is_primary_owner: accountUser.accounts.primary_owner_user_id === accountUser.user_id
  //   };
  // });
}