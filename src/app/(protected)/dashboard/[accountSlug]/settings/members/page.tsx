import type { Metadata } from 'next';
import SettingsTeamsPageContents from '@/app/(protected)/dashboard/[accountSlug]/settings/members/page-content';
import { getURL } from '@/lib/utils/helpers';
import { getAccountBySlug, getAccountMembers } from '@/lib/queries/account';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'NextBoilerplate - Settings Teams page',
    description: 'The settings page',
    metadataBase: new URL(getURL()),
  };
}

export default async function SettingsMembersPage({params: {accountSlug}}: {params: {accountSlug: string}}) {
  const account = await getAccountBySlug(accountSlug);
  const members = await getAccountMembers(account.id);

  return <SettingsTeamsPageContents members={members} />
}
