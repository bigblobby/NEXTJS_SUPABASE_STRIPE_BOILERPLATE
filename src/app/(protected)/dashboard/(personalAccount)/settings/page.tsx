import type { Metadata } from 'next';
import SettingsPageContent from '@/app/(protected)/dashboard/(personalAccount)/settings/page-content';
import { getURL } from '@/lib/utils/helpers';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'NextBoilerplate - Account page',
    description: 'The settings page',
    metadataBase: new URL(getURL()),
  };
}

interface AccountPageProps {
  searchParams: {
    _ptxn: string;
  }
}

export default async function SettingsPage({ searchParams }: AccountPageProps) {
  return <SettingsPageContent
    transactionId={searchParams._ptxn}
  />
}
