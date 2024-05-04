import { Heading } from '@/lib/components/ui/heading';
import { Text } from '@/lib/components/ui/text';
import CustomerPortalForm from '@/lib/components/account-forms/CustomerPortalForm';
import NameForm from '@/lib/components/account-forms/NameForm';
import EmailForm from '@/lib/components/account-forms/EmailForm';
import { type SubscriptionWithProduct, User } from '@/lib/types/supabase/table.types';
import { type User as AuthUser } from '@supabase/supabase-js';

interface AccountPageContentProps {
  authUser: AuthUser;
  user: User;
  subscription: SubscriptionWithProduct;
}

export default function AccountPageContent({
  authUser,
  user,
  subscription,
}: AccountPageContentProps){
  return (
    <section className="mb-32">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <Heading className="sm:text-center sm:text-6xl">Account</Heading>
          <Text className="max-w-2xl m-auto mt-5 text-xl sm:text-center sm:text-2xl">We partnered with Stripe for a simplified billing.</Text>
        </div>
      </div>
      <div className="p-4 space-y-8">
        <CustomerPortalForm subscription={subscription} />
        <NameForm userName={user?.full_name ?? ''} />
        <EmailForm userEmail={authUser.email} />
      </div>
    </section>
  );
}