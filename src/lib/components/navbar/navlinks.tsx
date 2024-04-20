'use client';

import Link from 'next/link';
import { signOut } from '@/src/lib/utils/auth-helpers/server';
import Logo from '@/src/lib/components/icons/Logo';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectMethod } from '@/src/lib/utils/auth-helpers/settings';
import s from './navbar.module.css';
import { ThemeToggle } from '@/src/lib/components/theme-toggle';
import toast from 'react-hot-toast';

interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  const router = getRedirectMethod() === 'client' ? useRouter() : null;

  async function handleSignOut(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = await signOut();

    if (result.error) {
      toast.error(result.error, {duration: 5000});
    } else {
      toast.success(result?.message ?? '', {duration: 5000});
      router?.push('/')
    }
  }

  return (
    <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
      <div className="flex items-center flex-1">
        <Link href="/public" className={s.logo} aria-label="Logo">
          <Logo />
        </Link>
        <nav className="ml-6 space-x-2 lg:block">
          <Link href="/" className={s.link}>
            Pricing
          </Link>
          {user && (
            <Link href="/account" className={s.link}>
              Account
            </Link>
          )}
        </nav>
      </div>
      <div>
        <ThemeToggle />
      </div>
      <div className="flex justify-end items-center space-x-8 ml-3">
        {user ? (
          <form onSubmit={(e) => handleSignOut(e)}>
            <button type="submit" className={s.link}>
              Sign out
            </button>
          </form>
        ) : (
          <Link href="/signin" className={s.link}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
