'use client';

import { Heading } from '@/src/lib/components/ui/heading';
import { Text } from '@/src/lib/components/ui/text';
import { Button } from '@/src/lib/components/ui/button';
import { Input } from '@/src/lib/components/ui/input';
import { Container } from '@/src/lib/components/ui/container';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function Newsletter() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function onSubmit(e: any){
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
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div className="bg-primary">
      <Container size={11} className="py-8 md:py-20 lg:py-28">
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
                  <Input type="email" name="email" />
                </div>
                <div className="md:w-1/5">
                  <Button className="w-full" type="submit" variant="black" disabled={isSubmitting}>Subscribe</Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </Container>
    </div>
  )
}