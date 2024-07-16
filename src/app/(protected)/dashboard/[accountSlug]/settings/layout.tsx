import SettingsNavigation from '@/lib/components/nav/dashboard/settings-navigation';
import { Heading } from '@/lib/components/ui/heading';
import { Text } from '@/lib/components/ui/text';
import { Separator } from '@/lib/components/ui/separator';
import { Container } from '@/lib/components/ui/container';

export default async function SettingsLayout({children, params: {accountSlug}}: {children: React.ReactNode, params: {accountSlug: string}}) {
  const items = [
    { name: 'Account', href: `/dashboard/${accountSlug}/settings` },
    { name: 'Billing', href: `/dashboard/${accountSlug}/settings/billing` },
    { name: 'Members', href: `/dashboard/${accountSlug}/settings/members` }
  ];

  return (
    <div>
      <Container size={10}>
        <div className="mt-6 sm:align-center sm:flex sm:flex-col">
          <Heading variant="h4">Settings</Heading>
          <Text className="max-w-2xl mt-2">Manage your account settings</Text>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 w-full max-w-6xl mx-auto">
          <aside className="lg:w-1/4">
            <SettingsNavigation items={items} />
          </aside>

          <div className="flex-1">{children}</div>
        </div>
      </Container>
    </div>
  )
}