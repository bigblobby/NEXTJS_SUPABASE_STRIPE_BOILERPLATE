import Link from 'next/link';
import Logo from '@/lib/components/icons/logo';
import s from '../navbar.module.css';
import { ThemeToggle } from '@/lib/components/theme-toggle';
import MobileMenu from '@/lib/components/nav/dashboard/mobile-menu';
import ProfileMenu from '@/lib/components/dashboard/profile-menu';
import AccountSelector from '@/lib/components/dashboard/account-selector';

interface NavlinksProps {
  accounts: any[];
  accountId: string;
}

export default function Navlinks({
  accounts,
  accountId,
}: NavlinksProps) {
  return (
    <div className="relative flex flex-row justify-between items-center h-full">
      <div className="flex items-center flex-1">
        <Link href="/" className={s.logo} aria-label="Logo">
          <Logo />
        </Link>
        <nav className="ml-6 space-x-2 hidden md:block">
          {/* Nav items here */}
          <AccountSelector accounts={accounts} accountId={accountId} />
        </nav>
      </div>
      <div className="flex items-center ml-3">
        <ThemeToggle />
      </div>
      <div className="flex items-center ml-3">
        <ProfileMenu />
      </div>
      <MobileMenu />
    </div>
  );
}
