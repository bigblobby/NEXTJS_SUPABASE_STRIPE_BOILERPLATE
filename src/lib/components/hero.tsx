import { Heading } from '@/lib/components/ui/heading';
import { Text } from '@/lib/components/ui/text';
import Link from 'next/link';
import { Button } from '@/lib/components/ui/button';
import { Container } from '@/lib/components/ui/container';

export default function Hero() {
  return (
    <section>
      <Container size={5} className="text-center py-8 md:py-20 lg:py-28">
        <a href="#" className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-zinc-100 rounded-full dark:bg-card dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700" role="alert">
          <span className="text-xs bg-primary rounded-full text-white px-4 py-1.5 mr-3">New</span>
          <span className="text-sm font-medium">v1.6 is out! See whats new</span>
          <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
          </svg>
        </a>
        <Heading className="mb-4" as="h1" variant="h1">Effortless Programming for CrossFit Coaches</Heading>
        <Text className="max-w-3xl mx-auto mb-8" variant="leading">Streamline coaching with easy WOD creation. Focus on guiding athletes. Elevate your coaching game effortlessly. Join now!</Text>

        <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <Link href="#" className="inline-flex justify-center items-center py-3 px-5 font-medium text-black dark:text-white">
            Learn more
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </Link>
          <Button asChild size="lg">
            <Link href="#">
              Get Started
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}