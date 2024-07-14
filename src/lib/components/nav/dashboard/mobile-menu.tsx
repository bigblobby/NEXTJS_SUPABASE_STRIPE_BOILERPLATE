'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/lib/components/ui/sheet';
import { Button } from '@/lib/components/ui/button';
import { AlignJustify } from 'lucide-react';
import Logo from '@/lib/components/icons/logo';
import { useState } from 'react';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

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
              {/* Nav goes here */}
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}