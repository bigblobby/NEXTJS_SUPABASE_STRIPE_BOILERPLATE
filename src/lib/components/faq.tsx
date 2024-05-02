import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/lib/components/ui/accordion';
import { Heading } from '@/lib/components/ui/heading';
import { Container } from '@/lib/components/ui/container';

export default function FAQ() {
  return (
    <section>
      <Container size={10} className="py-20 lg:py-28">
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 lg:gap-26 xl:gap-30">
          <div className="md:w-1/2">
            <Heading className="text-primary text-center text-lg md:text-left md:text-lg lg:text-lg dark:text-primary">FAQ</Heading>
            <Heading className="text-center md:text-left">Frequently asked questions</Heading>
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
      </Container>
    </section>
  );
}