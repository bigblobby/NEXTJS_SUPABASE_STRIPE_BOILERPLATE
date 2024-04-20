import { createClient } from '@/src/lib/utils/supabase/server';
import s from './navbar.module.css';
import Navlinks from './navlinks';

export default async function Navbar() {
  const supabase = createClient();
  let sub = null;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .eq('user_id', user.id)
      .maybeSingle();

    sub = subscription;
  }

  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="max-w-6xl px-6 mx-auto">
        <Navlinks user={user} subscription={sub} />
      </div>
    </nav>
  );
}
