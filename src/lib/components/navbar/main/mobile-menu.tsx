import { Sheet, SheetContent, SheetTrigger } from '@/src/lib/components/ui/sheet';
import { Button } from '@/src/lib/components/ui/button';
import { AlignJustify } from 'lucide-react';
import Logo from '@/src/lib/components/icons/Logo';
import Link from 'next/link';
import s from '../navbar.module.css';
import { Separator } from '@/src/lib/components/ui/separator';
import { useState } from 'react';
import { handleSignOut } from '@/src/lib/components/navbar/navbar.utils';

interface MobileMenuProps {
  user: any;
  handleSignOut: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function MobileMenu({
  user,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={(open) => setOpen(open)}>
      <SheetTrigger className="block md:hidden">
        <Button variant="outline" size="icon" className="flex items-center justify-center text-black ml-3  relative dark:text-white" onClick={() => setOpen((open) => !open)}>
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
                <form onSubmit={(e) => handleSignOut(e)}>
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