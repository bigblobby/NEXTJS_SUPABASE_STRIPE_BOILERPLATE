'use client';

import { Button } from '@/src/lib/components/ui/button';
import { updatePassword } from '@/src/lib/utils/auth-helpers/server';
import { handleRequest } from '@/src/lib/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Input } from '@/src/lib/components/ui/input';
import { Text } from '@/src/lib/components/ui/text';

interface UpdatePasswordProps {
  redirectMethod: string;
}

export default function UpdatePassword({
  redirectMethod
}: UpdatePasswordProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, updatePassword, router);
    setIsSubmitting(false);
  };

  return (
    <div className="my-8">
      <form
        noValidate={true}
        className="mb-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Text as="label" htmlFor="password">New Password</Text>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              name="password"
              autoComplete="current-password"
            />
            <Text as="label" htmlFor="passwordConfirm">Confirm New Password</Text>
            <Input
              id="passwordConfirm"
              placeholder="Password"
              type="password"
              name="passwordConfirm"
              autoComplete="current-password"
            />
          </div>
          <Button
            type="submit"
            className="mt-1"
            disabled={isSubmitting}
          >
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}