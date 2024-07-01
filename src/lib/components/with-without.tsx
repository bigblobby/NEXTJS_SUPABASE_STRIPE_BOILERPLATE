import { Container } from '@/lib/components/ui/container';
import { Heading } from '@/lib/components/ui/heading';
import { Check, X } from 'lucide-react';

export default function WithWithout() {
  const comparisonData = [
    { with: "100's of hours saved", without: "100's of hours spent on the initial setup" },
    { with: "Cost savings", without: "Higher expenses" },
    { with: "Improved quality", without: "Inconsistent results" },
    { with: "Enhanced user experience", without: "User frustration" },
  ];

  // TODO refactor this whole component

  return (
    <Container size={10} className="py-20 lg:py-28">
      <Heading className="text-center mb-8">Tired of all the initial setup?</Heading>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-green-100 dark:bg-green-900 rounded-lg p-10 transition-colors duration-200">
          <Heading as="h4" variant="h6" className="text-green-800 dark:text-green-100 mb-4">Life <em>with</em> Next Boilerplate</Heading>
          <ul className="space-y-2">
            {comparisonData.map((item, index) => (
              <li key={index} className="flex text-green-700 dark:text-green-200">
                <span>
                  <Check className="h-5 w-5 mr-2 mt-0.5" />
                </span>
                {item.with}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 bg-red-100 dark:bg-red-900 rounded-lg p-10 transition-colors duration-200">
          <Heading as="h4" variant="h6" className="text-red-800 dark:text-red-100 mb-4">Life <em>without</em> Next Boilerplate</Heading>
          <ul className="space-y-2">
            {comparisonData.map((item, index) => (
              <li key={index} className="flex text-red-700 dark:text-red-200">
                <span>
                  <X className="h-5 w-5 mr-2 mt-0.5" />
                </span>
                {item.without}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
}