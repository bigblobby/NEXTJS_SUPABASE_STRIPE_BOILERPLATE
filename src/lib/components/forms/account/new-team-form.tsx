import { Input } from '@/lib/components/ui/input';
import { Button } from '@/lib/components/ui/button';
import { Text } from '@/lib/components/ui/text';
import { createTeam } from '@/lib/actions/teams';
import { useAction } from 'next-safe-action/hooks';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/lib/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTeamSchema } from '@/lib/schemas/createTeamSchema';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';

export default function NewTeamForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const form = useForm<z.infer<typeof createTeamSchema>>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: '',
      slug: '',
    }
  });

  const { execute, isExecuting } = useAction(createTeam, {
    onSuccess: ({data}) => {
      toast.success('Team created successfully');
      void queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: ({error, input}) => {
      if (error.serverError) {
        toast.error(error.serverError);
      }
    }
  });

  function onSubmit() {
    execute(form.getValues());
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="animate-in flex-1 flex flex-col w-full justify-center gap-y-6 text-foreground">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Team name
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Identifier
              </FormLabel>
              <div className="flex flex-row items-center gap-3">
                <div className="">
                  <Text>https://test.com/</Text>
                </div>
                <div className="flex-1">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isExecuting}>Create team</Button>
        </div>
      </form>
    </Form>
  )
}