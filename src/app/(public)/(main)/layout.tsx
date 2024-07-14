import Navbar from '@/lib/components/nav/navbar';
import Navlinks from '@/lib/components/nav/main/navlinks';
import Footer from '@/lib/components/footers/footer';
import { PropsWithChildren } from 'react';
import { createClient } from '@/lib/utils/supabase/server';

export default async function Layout({ children }: PropsWithChildren){
  const supabase = createClient();

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    console.log(userError);
  }

  return (
    <>
      <Navbar>
        <Navlinks user={user} />
      </Navbar>
      <main id="skip">
        {children}
      </main>
      <Footer />
    </>
  )
}