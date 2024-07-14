'use client';

import { Button } from '@/lib/components/ui/button';
import { updateEmail } from '@/lib/actions/account';
import { Input } from '@/lib/components/ui/input';
import { Text } from '@/lib/components/ui/text';
import { Card, CardContent, CardFooter, CardHeader } from '@/lib/components/ui/card';
import { Heading } from '@/lib/components/ui/heading';
import toast from 'react-hot-toast';
import { useAction } from 'next-safe-action/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/lib/components/ui/form';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { updateEmailSchema } from '@/lib/schemas/updateEmailSchema';

interface EmailFormProps {
  email: string;
}

export default function EmailForm({
  email
}: EmailFormProps) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: email
    },
  });

  const { execute, isExecuting } = useAction(updateEmail, {
    onSuccess: ({data}) => {
      if (data?.message) {
        toast.success(data.message);
      }
    },
    onError: ({error, input}) => {
      if (error.serverError) {
        toast.error(error.serverError);
      }
    }
  });

  function onSubmit() {
    const values = form.getValues();
    if (values.email === email) {
      return;
    }

    execute(form.getValues());
    router.refresh();
  }

  return (
    <Card className="shadow-none mx-0">
      <CardHeader>
        <Heading className="mb-1 font-medium" as="h3" variant="h3">Your Email</Heading>
        <Text>Please enter the email address you want to use to login.</Text>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-semibold">
          <Form {...form}>
            <form id="emailForm" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <Text className="pb-4 sm:pb-0" variant="muted">We will email you to verify the change.</Text>
          <Button
            type="submit"
            form="emailForm"
            disabled={isExecuting}
          >
            Update Email
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
