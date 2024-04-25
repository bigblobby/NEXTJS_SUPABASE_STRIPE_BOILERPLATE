import Link from 'next/link';
import { Button } from '@/src/lib/components/ui/button';
import { Heading } from '@/src/lib/components/ui/heading';
import { Text } from '@/src/lib/components/ui/text';

export default function CTA() {
  return (
    <section className="">
      <div className="py-8 px-4 mx-auto max-w-7xl md:py-20 lg:py-28 lg:px-6">
        <div className="mx-auto max-w-screen-lg text-center">
          <Heading className="mb-4" as="h4" variant="h2">Start your free trial today</Heading>
          <Text className="md:text-lg mb-6">Try ChalkWOD for 7 days. No credit card required.</Text>
          <Button asChild>
            <Link href="#" className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
              Free trial for 7 days
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}