'use client';

import Link from 'next/link';
import Logo from '@/src/lib/components/icons/Logo';
import s from '../navbar.module.css';
import { ThemeToggle } from '@/src/lib/components/theme-toggle';
import { Button } from '@/src/lib/components/ui/button';
import MobileMenu from '@/src/lib/components/navbar/main/mobile-menu';
import { handleSignOut } from '@/src/lib/components/navbar/navbar.utils';

interface NavlinksProps {
  user?: any;
  subscription?: any;
}

export default function Navlinks({ user, subscription }: NavlinksProps) {
  return (
    <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
      <div className="flex items-center flex-1">
        <Link href="/" className={s.logo} aria-label="Logo">
          <Logo />
        </Link>
        <nav className="ml-6 space-x-2 hidden md:block">
          <Link href="/public" className={s.link}>
            Pricing
          </Link>
          <Link href="/blog" className={s.link}>
            Blog
          </Link>
          {user && (
            <Link href="/account" className={s.link}>
              Account
            </Link>
          )}
        </nav>
      </div>
      {subscription && (
        <Link href="/dashboard" className={s.link}>
          <Button type="button">Dashboard</Button>
        </Link>
      )}
      <div className="flex items-center ml-3">
        <ThemeToggle />
      </div>
      <div className="justify-end items-center space-x-8 ml-3 hidden md:flex">
        {user ? (
          <form onSubmit={(e) => handleSignOut(e)}>
            <button type="submit" className={s.link} autoFocus={false}>
              Sign out
            </button>
          </form>
        ) : (
          <Link href="/signin" className={s.link}>
            Sign In
          </Link>
        )}
      </div>
      <MobileMenu user={user} handleSignOut={handleSignOut} />
    </div>
  );
}
