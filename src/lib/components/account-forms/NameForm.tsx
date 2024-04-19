'use client';

import { Button } from '@/src/lib/components/ui/button';
import { updateName } from '@/src/lib/utils/auth-helpers/server';
import { handleRequest } from '@/src/lib/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/src/lib/components/ui/input';
import { Text } from '@/src/lib/components/ui/text';
import { Card, CardContent, CardFooter, CardHeader } from '@/src/lib/components/ui/card';
import { Heading } from '@/src/lib/components/ui/heading';

export default function NameForm({ userName }: { userName: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Check if the new name is the same as the old name
    if (e.currentTarget.fullName.value === userName) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    handleRequest(e, updateName, router);
    setIsSubmitting(false);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <Heading className="mb-1 font-medium" as="h3" variant="h3">Your Plan</Heading>
        <Text>Please enter your full name, or a display name you are comfortable with.</Text>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-semibold">
          <form id="nameForm" onSubmit={(e) => handleSubmit(e)}>
            <Input
              type="text"
              name="fullName"
              defaultValue={userName}
              placeholder="Your name"
              maxLength={64}
            />
          </form>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <Text className="pb-4 sm:pb-0" variant="muted">64 characters maximum</Text>
          <Button
            type="submit"
            form="nameForm"
            disabled={isSubmitting}
          >
            Update Name
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
