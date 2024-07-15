'use client';

import { Button } from '@/lib/components/ui/button';
import { updateName } from '@/lib/actions/account';
import { Input } from '@/lib/components/ui/input';
import { Text } from '@/lib/components/ui/text';
import { Card, CardContent, CardFooter, CardHeader } from '@/lib/components/ui/card';
import { Heading } from '@/lib/components/ui/heading';
import toast from 'react-hot-toast';
import { useForm } from "react-hook-form"
import { useAction } from 'next-safe-action/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/lib/components/ui/form';
import { updateNameSchema } from '@/lib/schemas/updateNameSchema';
import { useRouter } from 'next/navigation';
import { useCurrentAccount } from '@/lib/hooks/useCurrentAccount';

interface NameFormProps {
  title?: string;
  subTitle?: string;
  name: string;
}

export default function NameForm({
  title = 'Your Name',
  subTitle = 'Please enter your full name, or a display name you are comfortable with.',
  name
}: NameFormProps) {
  const router = useRouter();
  const currentAccount = useCurrentAccount();
  const form = useForm({
    resolver: zodResolver(updateNameSchema),
    defaultValues: {
      name: name,
      accountId: currentAccount?.account_id,
    },
  });

  const { execute, isExecuting } = useAction(updateName, {
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

  async function onSubmit(){
    execute(form.getValues());
    router.refresh();
  }

  return (
    <Card className="shadow-none mx-0">
      <CardHeader>
        <Heading className="mb-1 font-medium" as="h3" variant="h3">{title}</Heading>
        <Text>{subTitle}</Text>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-semibold">
          <Form {...form}>
            <form id="nameForm" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
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
          <Text className="pb-4 sm:pb-0" variant="muted">64 characters maximum</Text>
          <Button
            type="submit"
            form="nameForm"
            disabled={isExecuting}
          >
            Update Name
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
