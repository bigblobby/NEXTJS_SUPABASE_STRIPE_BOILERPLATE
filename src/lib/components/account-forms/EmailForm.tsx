'use client';

import { Button } from '@/src/lib/components/ui/button';
import { updateEmail } from '@/src/lib/utils/auth-helpers/server';
import { handleRequest } from '@/src/lib/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/src/lib/components/ui/input';
import { Text } from '@/src/lib/components/ui/text';
import { Card, CardContent, CardFooter, CardHeader } from '@/src/lib/components/ui/card';
import { Heading } from '@/src/lib/components/ui/heading';

export default function EmailForm({
  userEmail
}: {
  userEmail: string | undefined;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Check if the new email is the same as the old email
    if (e.currentTarget.newEmail.value === userEmail) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    handleRequest(e, updateEmail, router);
    setIsSubmitting(false);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <Heading className="mb-1 font-medium" as="h3" variant="h3">Your Email</Heading>
        <Text>Please enter the email address you want to use to login.</Text>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-semibold">
          <form id="emailForm" onSubmit={(e) => handleSubmit(e)}>
            <Input
              type="text"
              name="newEmail"
              defaultValue={userEmail ?? ''}
              placeholder="Your email"
              maxLength={64}
            />
          </form>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <Text className="pb-4 sm:pb-0" variant="muted">We will email you to verify the change.</Text>
          <Button
            type="submit"
            form="emailForm"
            disabled={isSubmitting}
          >
            Update Email
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}