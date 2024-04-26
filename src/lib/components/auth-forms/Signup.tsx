'use client';

import React from 'react';
import Link from 'next/link';
import { signUp } from '@/src/lib/utils/auth-helpers/server';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/src/lib/components/ui/button';
import { Input } from '@/src/lib/components/ui/input';
import { Text } from '@/src/lib/components/ui/text';
import toast from 'react-hot-toast';

// Define prop type with allowEmail boolean
interface SignUpProps {
  allowEmail: boolean;
  redirectMethod: string;
}

export default function SignUp({ allowEmail, redirectMethod }: SignUpProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable the button while the request is being handled

    const formData = new FormData(e.currentTarget);
    const result = await signUp(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result?.message ?? '');
      router?.push('/');
    }

    setIsSubmitting(false);
  };

  return (
    <div>
      <form
        noValidate={true}
        className="mb-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Text as="label" htmlFor="email">Email</Text>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
            />
            <Text as="label" htmlFor="password">Password</Text>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              name="password"
              autoComplete="current-password"
            />
          </div>
          <Button
            variant="default"
            type="submit"
            className="mt-1"
            disabled={isSubmitting}
          >
            Sign up
          </Button>
        </div>
      </form>
      <Text>Already have an account?</Text>
      <Text>
        <Link href="/signin/password_signin" className="font-light text-sm">
          Sign in with email and password
        </Link>
      </Text>
      {allowEmail && (
        <Text>
          <Link href="/signin/email_signin" className="font-light text-sm">
            Sign in via magic link
          </Link>
        </Text>
      )}
    </div>
  );
}
