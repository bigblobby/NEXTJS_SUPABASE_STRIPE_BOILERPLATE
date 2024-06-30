import { Container } from '@/lib/components/ui/container';
import { Text } from '@/lib/components/ui/text';
import { Heading } from '@/lib/components/ui/heading';

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
          <h3 className="text-xl font-bold text-green-800 dark:text-green-100 mb-4">Life <em>with</em> Next Boilerplate</h3>
          <ul className="space-y-2">
            {comparisonData.map((item, index) => (
              <li key={index} className="text-green-700 dark:text-green-200 flex items-center">
                <svg className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {item.with}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 bg-red-100 dark:bg-red-900 rounded-lg p-10 transition-colors duration-200">
          <h3 className="text-xl font-bold text-red-800 dark:text-red-100 mb-4">Life <em>without</em> Next Boilerplate</h3>
          <ul className="space-y-2">
            {comparisonData.map((item, index) => (
              <li key={index} className="text-red-700 dark:text-red-200 flex items-center">
                <svg className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                {item.without}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
}