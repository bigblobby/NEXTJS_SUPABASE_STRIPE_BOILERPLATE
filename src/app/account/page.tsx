import CustomerPortalForm from '@/src/lib/components/account-forms/CustomerPortalForm';
import EmailForm from '@/src/lib/components/account-forms/EmailForm';
import NameForm from '@/src/lib/components/account-forms/NameForm';
import { Heading } from '@/src/lib/components/ui/heading';
import { Text } from '@/src/lib/components/ui/text';
import { createClient } from '@/src/lib/utils/supabase/server';
import { redirect } from 'next/navigation';
import SearchParamsToast from '@/src/lib/components/search-params-toast';

export default async function Account({
  searchParams
}: { searchParams: { disable_button: boolean, status?: string, status_description?: string }; }) {
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
    <>
      <SearchParamsToast status={searchParams.status} desc={searchParams.status_description} searchParams={searchParams} />
      <section className="mb-32">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
          <div className="sm:align-center sm:flex sm:flex-col">
            <Heading className="sm:text-center sm:text-6xl">Account</Heading>
            <Text className="max-w-2xl m-auto mt-5 text-xl sm:text-center sm:text-2xl">We partnered with Stripe for a simplified billing.</Text>
          </div>
        </div>
        <div className="p-4 space-y-8">
          <CustomerPortalForm subscription={subscription} />
          <NameForm userName={userDetails?.full_name ?? ''} />
          <EmailForm userEmail={user.email} />
        </div>
      </section>
    </>
  );
}
