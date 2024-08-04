'use server';

import { createClient } from '@/lib/utils/supabase/server';
import { User } from '@supabase/supabase-js';

export async function getPersonalAccount() {
  const supabase = createClient();

  const { data: account } = await supabase.rpc('get_personal_account');

  return account;
}

export async function getAccounts() {
  const supabase = createClient();

  const { data: accounts } = await supabase.rpc('get_accounts');

  return accounts;
}

export async function getAccountBySlug(slug: string) {
  const supabase = createClient();

  const { data: account } = await supabase.rpc('get_account_by_slug', {
    slug
  });

  return account;
}

export async function getAccountMembers(accountId: string) {
  const supabase = createClient();

  const { data: members } = await supabase.rpc('get_account_members', {
    account_id: accountId
  });

  return members as any[];
}