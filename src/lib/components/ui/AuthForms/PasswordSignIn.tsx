'use client';

import { Button } from '@/src/lib/components/ui/button';
import Link from 'next/link';
import { signInWithPassword } from '@/src/lib/utils/auth-helpers/server';
import { handleRequest } from '@/src/lib/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Input } from '@/src/lib/components/ui/input';
import { Text } from '@/src/lib/components/ui/text';

// Define prop type with allowEmail boolean
interface PasswordSignInProps {
  allowEmail: boolean;
  redirectMethod: string;
}

export default function PasswordSignIn({
  allowEmail,
  redirectMethod
}: PasswordSignInProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, signInWithPassword, router);
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
            type="submit"
            className="mt-1"
            disabled={isSubmitting}
          >
            Sign in
          </Button>
        </div>
      </form>
      <Text>
        <Link href="/signin/forgot_password" className="font-light text-sm">
          Forgot your password?
        </Link>
      </Text>
      {allowEmail && (
        <Text>
          <Link href="/signin/email_signin" className="font-light text-sm">
            Sign in via magic link
          </Link>
        </Text>
      )}
      <Text>
        <Link href="/signin/signup" className="font-light text-sm">
          Don't have an account? Sign up
        </Link>
      </Text>
    </div>
  );
}
