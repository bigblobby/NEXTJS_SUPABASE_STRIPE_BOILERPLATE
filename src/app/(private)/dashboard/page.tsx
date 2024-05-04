import DashboardPageContent from '@/app/(private)/dashboard/page-content';
import type { Metadata } from 'next';
import { getURL } from '@/lib/utils/helpers';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'NextBoilerplate - Dashboard Home',
    description: 'The dashboard home page',
    metadataBase: new URL(getURL()),
  };
}

export default DashboardPageContent;