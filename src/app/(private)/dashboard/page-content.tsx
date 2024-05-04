'use client'

import { Container } from '@/lib/components/ui/container';
import { Heading } from '@/lib/components/ui/heading';
import { Text } from '@/lib/components/ui/text';

export default function DashboardPageContent() {
  return (
    <Container size={10} className="flex flex-col align-center justify-center min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-80px)]">
      <Heading as="h1" variant="h1" className="text-center">The dashboard</Heading>
      <Text variant="leading" className="text-center mt-4 mx-auto max-w-xl">This is where your user can do stuff. The dashboard is only viewable if they have an active subscription.</Text>
    </Container>
  )
}