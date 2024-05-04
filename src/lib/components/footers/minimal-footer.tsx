import { Container } from '@/lib/components/ui/container';
import { Text } from '@/lib/components/ui/text';
import { Card } from '@/lib/components/ui/card';
import Link from 'next/link';

export default function MinimalFooter() {
  return (
    <footer>
      <Card className="bg-zinc-100 dark:bg-card m-4 border-none">
        <Container size={10} className="p-4 md:flex md:items-center md:justify-between">
          <Text as="span" className="text-sm sm:text-center">&copy; {new Date().getFullYear()} NextJS Boilerplate. All Rights Reserved.</Text>
          <ul className="flex flex-wrap items-center mt-3 text-sm font-medium sm:mt-0">
            <li>
              <Link href="#" className="hover:underline me-4 md:me-6"><Text as="span">Privacy Policy</Text></Link>
            </li>
            <li>
              <Link href="/terms-conditions" className="hover:underline me-4 md:me-6"><Text as="span">Terms &amp; Conditions</Text></Link>
            </li>
            <li>
              <Link href="#" className="hover:underline"><Text as="span">Contact</Text></Link>
            </li>
          </ul>
        </Container>
      </Card>
    </footer>
  )
}