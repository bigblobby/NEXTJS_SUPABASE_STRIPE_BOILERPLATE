import type { Metadata } from 'next';
import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from 'next/navigation';
import SettingsTeamsPageContents from '@/app/(protected)/dashboard/settings/teams/page-content';
import { getURL } from '@/lib/utils/helpers';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'NextBoilerplate - Settings Teams page',
    description: 'The settings page',
    metadataBase: new URL(getURL()),
  };
}

export default async function SettingsTeamsPage() {
  const supabase = createClient();

  const {
    data: { user: authUser },
    error: authError
  } = await supabase.auth.getUser();

  if (authError) {
    console.log(authError);
  }

  const { data: user, error: userError } = await supabase
    .from('accounts')
    .select('*')
    .eq('personal_account', true)
    .single();

  if (userError) {
    console.log('Account user error:', userError);
  }

  if (!user) {
    return redirect('/signin');
  }

  if (authUser && user) {
    return <SettingsTeamsPageContents />
  }

  return null;
}
