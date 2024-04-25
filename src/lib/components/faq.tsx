import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/src/lib/components/ui/accordion';
import { Heading } from '@/src/lib/components/ui/heading';

export default function FAQ() {
  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-10 lg:gap-26 xl:gap-30 py-8 px-4 mx-auto max-w-7xl md:py-20 lg:py-28 lg:px-6">
      <div className="md:w-1/2">
        <Heading className="text-primary text-lg md:text-lg lg:text-lg dark:text-primary">FAQ</Heading>
        <Heading>Frequently asked questions</Heading>
      </div>
      <div className="md:w-1/2">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              Yes. It comes with default styles that matches the other
              components&apos; aesthetic.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it animated?</AccordionTrigger>
            <AccordionContent>
              Yes. It's animated by default, but you can disable it if you prefer.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}