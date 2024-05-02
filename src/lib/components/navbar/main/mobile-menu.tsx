'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/lib/components/ui/sheet';
import { Button } from '@/lib/components/ui/button';
import { AlignJustify } from 'lucide-react';
import Logo from '@/lib/components/icons/Logo';
import Link from 'next/link';
import s from '../navbar.module.css';
import { Separator } from '@/lib/components/ui/separator';
import { useState } from 'react';
import { handleSignOut } from '@/lib/components/navbar/navbar.utils';
import { useRouter } from 'next/navigation';

interface MobileMenuProps {
  user: any;
}

export default function MobileMenu({
  user,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Sheet open={open} onOpenChange={(open) => setOpen(open)}>
      <SheetTrigger asChild className="flex md:hidden" onClick={() => setOpen((open) => !open)}>
          <Button variant="outline" size="icon" className="flex items-center justify-center text-black ml-3 relative dark:text-white">
            <AlignJustify width={16} height={16} />
          </Button>
      </SheetTrigger>
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <div>
          <Logo />
          <div className="mt-4">
            <nav className="flex flex-col">
              <Link href="/" className={s.link} onClick={() => setOpen(false)}>
                Pricing
              </Link>
              <Link href="/blog" className={s.link} onClick={() => setOpen(false)}>
                Blog
              </Link>
              {user && (
                <Link href="/account" className={s.link} onClick={() => setOpen(false)}>
                  Account
                </Link>
              )}

              <Separator className="my-4" />

              {user ? (
                <form onSubmit={(e) => handleSignOut(e, router)}>
                  <button type="submit" className={s.link} onClick={() => setOpen(false)}>
                    Sign out
                  </button>
                </form>
              ) : (
                <Link href="/signin" className={s.link} onClick={() => setOpen(false)}>
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}