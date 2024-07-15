import type { Metadata } from 'next';
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
  return <SettingsTeamsPageContents />
}
