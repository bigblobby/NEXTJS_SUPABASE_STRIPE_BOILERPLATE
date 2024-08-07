'use client';

import { Button } from '@/lib/components/ui/button';
import { Text } from '@/lib/components/ui/text';
import Link from 'next/link';
import { signInWithEmail } from '@/lib/actions/auth';
import { useState } from 'react';
import { Input } from '@/lib/components/ui/input';
import toast from 'react-hot-toast';

interface EmailSignInProps {
  allowPassword: boolean;
}

export default function EmailSignIn({
  allowPassword,
}: EmailSignInProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable the button while the request is being handled

    const formData = new FormData(e.currentTarget);
    const result = await signInWithEmail(formData);

    if (result.error) {
      toast.error(result.error, {duration: 5000});
    } else {
      toast.success(result?.message ?? '', {duration: 5000});
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
      {allowPassword && (
        <>
          <Text>
            <Link href="/signin/password_signin" className="font-light text-sm">
              Sign in with email and password
            </Link>
          </Text>
          <Text>
            <Link href="/signin/signup" className="font-light text-sm">
              Don't have an account? Sign up
            </Link>
          </Text>
        </>
      )}
    </div>
  );
}
