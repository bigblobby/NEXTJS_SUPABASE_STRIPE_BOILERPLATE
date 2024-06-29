import { createClient } from '@/lib/utils/supabase/server';
import SessionProvider from '@/lib/providers/session-provider';

export default async function Layout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const supabase = createClient();

  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession();

  return (
    <div>
      <SessionProvider session={session}>
        {children}
      </SessionProvider>
    </div>
  )
}