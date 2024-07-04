'use client';

import { Button } from '@/lib/components/ui/button';
import { updateName } from '@/lib/actions/account';
import { useState } from 'react';
import { Input } from '@/lib/components/ui/input';
import { Text } from '@/lib/components/ui/text';
import { Card, CardContent, CardFooter, CardHeader } from '@/lib/components/ui/card';
import { Heading } from '@/lib/components/ui/heading';
import toast from 'react-hot-toast';

export default function NameForm({ userName }: { userName: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Check if the new name is the same as the old name
    if (e.currentTarget.fullName.value === userName) {
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const result = await updateName(formData);

    if (result.error) {
      toast.error(result.error, {duration: 5000});
    } else {
      toast.success(result?.message ?? '', {duration: 5000});
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <Heading className="mb-1 font-medium" as="h3" variant="h3">Your Name</Heading>
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
