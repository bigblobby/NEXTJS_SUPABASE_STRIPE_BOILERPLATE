import CustomerPortalForm from '@/src/lib/components/ui/AccountForms/CustomerPortalForm';
import EmailForm from '@/src/lib/components/ui/AccountForms/EmailForm';
import NameForm from '@/src/lib/components/ui/AccountForms/NameForm';
import { Heading } from '@/src/lib/components/ui/heading';
import { Text } from '@/src/lib/components/ui/text';
import { createClient } from '@/src/lib/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Account() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single();

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  if (error) {
    console.log(error);
  }

  if (!user) {
    return redirect('/signin');
  }

  return (
    <section className="mb-32">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <Heading className="sm:text-center sm:text-6xl">Account</Heading>
          <Text className="max-w-2xl m-auto mt-5 text-xl sm:text-center sm:text-2xl">We partnered with Stripe for a simplified billing.</Text>
        </div>
      </div>
      <div className="p-4">
        <CustomerPortalForm subscription={subscription} />
        <NameForm userName={userDetails?.full_name ?? ''} />
        <EmailForm userEmail={user.email} />
      </div>
    </section>
  );
}