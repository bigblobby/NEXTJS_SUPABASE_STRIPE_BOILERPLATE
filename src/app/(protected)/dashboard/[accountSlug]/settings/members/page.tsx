import type { Metadata } from 'next';
import SettingsTeamsPageContents from '@/app/(protected)/dashboard/[accountSlug]/settings/members/page-content';
import { getURL } from '@/lib/utils/helpers';
import { getAccountBySlug, getAccountMembers } from '@/lib/queries/account';
import { Alert } from '@/lib/components/ui/alert';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'NextBoilerplate - Settings Teams page',
    description: 'The settings page',
    metadataBase: new URL(getURL()),
  };
}

export default async function SettingsMembersPage({params: {accountSlug}}: {params: {accountSlug: string}}) {
  const account: any  = await getAccountBySlug(accountSlug);
  const members = await getAccountMembers(account.account_id);

  if (!account?.is_primary_owner) {
    return <Alert variant="destructive">You do not have permission to access this page</Alert>
  }

  return <SettingsTeamsPageContents members={members} />
}
