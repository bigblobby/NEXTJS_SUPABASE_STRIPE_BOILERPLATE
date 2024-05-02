'use client';

import { Button } from '@/lib/components/ui/button';
import { signInWithOAuth } from '@/lib/utils/auth-helpers/client';
import { type Provider } from '@supabase/supabase-js';
import { useState } from 'react';
import Image from 'next/image';

type OAuthProviders = {
  name: Provider;
  displayName: string;
  icon: React.ReactElement;
};

export default function OauthSignIn() {
  const oAuthProviders: OAuthProviders[] = [
    {
      name: 'google',
      displayName: 'Google',
      icon: <Image src="/google.svg" alt="google logo" width={20} height={20} />
    }
    /* Add desired OAuth providers here */
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await signInWithOAuth(e);
    setIsSubmitting(false);
  };

  return (
    <div className="mt-2">
      {oAuthProviders.map((provider) => (
        <form
          key={provider.name}
          onSubmit={(e) => handleSubmit(e)}
        >
          <input type="hidden" name="provider" value={provider.name} />
          <Button
            variant="outline"
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            <span className="mr-2">{provider.icon}</span>
            <span>{provider.displayName}</span>
          </Button>
        </form>
      ))}
    </div>
  );
}
