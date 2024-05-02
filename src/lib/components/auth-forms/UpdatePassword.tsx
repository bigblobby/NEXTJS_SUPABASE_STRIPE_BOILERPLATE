'use client';

import { Button } from '@/lib/components/ui/button';
import { updatePassword } from '@/lib/utils/auth-helpers/server';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Input } from '@/lib/components/ui/input';
import { Text } from '@/lib/components/ui/text';
import toast from 'react-hot-toast';

export default function UpdatePassword() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable the button while the request is being handled

    const formData = new FormData(e.currentTarget);
    const result = await updatePassword(formData);

    if (result.error) {
      toast.error(result.error, {duration: 5000});
    } else {
      toast.success(result?.message ?? '', {duration: 5000});
      router?.push('/');
    }

    setIsSubmitting(false);
  };

  return (
    <div>
      <form
        noValidate={true}
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
