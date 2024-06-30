'use client';

import { Heading } from '@/lib/components/ui/heading';
import { Text } from '@/lib/components/ui/text';
import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { Container } from '@/lib/components/ui/container';
import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { BackgroundBeams } from '@/lib/components/ui/background-beams';

export default function Newsletter() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/mail/subscribe', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result?.message ?? '');
        setIsSubmitted(true);
      }
    } catch (err) {
      let errorMesssage = 'An unknown error occurred. Please try again.';

      if (err instanceof Error) errorMesssage = err.message;

      console.error('Subscription error:', err);
      toast.error(errorMesssage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-zinc-900 relative">
      <BackgroundBeams />
      <Container size={10} className="relative z-10 py-20 lg:py-28 my-20 lg:my-28">
        <Heading className="text-white text-center mb-3" as="h2" variant="h2">Subscribe to our newsletter</Heading>
        <div className="max-w-md mx-auto">
          <Text className="text-white text-center mb-6">Do you want the best newsletters hitting your inbox? <br /> Of course you do.</Text>
          {isSubmitted ? (
            <div>
              <Text className="text-black text-center">Congrats! You are now part of the mailing list.</Text>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="md:w-4/5">
                  <Input className="text-zinc-200 bg-accent-dark border-accent-dark" type="email" name="email" />
                </div>
                <div className="md:w-1/5">
                  <Button className="w-full" type="submit" variant="primary" disabled={isSubmitting}>Subscribe</Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </Container>
    </div>
  )
}