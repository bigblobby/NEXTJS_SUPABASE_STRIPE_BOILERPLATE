import Navbar from '@/lib/components/navbar/navbar';
import Navlinks from '@/lib/components/navbar/main/navlinks';
import { PropsWithChildren } from 'react';
import { createClient } from '@/lib/utils/supabase/server';
import { getSubscription } from '@/lib/utils/supabase/queries/server/subscription';

export default async function Layout({ children }: PropsWithChildren){
  const supabase = createClient();
  let subscription = null;

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    console.log(userError);
  }

  if (user) {
    subscription = await getSubscription(user);
  }

  return (
    <>
      <Navbar>
        <Navlinks user={user} subscription={subscription} />
      </Navbar>
      <main>
        {children}
      </main>
    </>
  )
}