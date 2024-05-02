import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/lib/components/ui/dropdown-menu';
import { Button } from '@/lib/components/ui/button';
import { User } from 'lucide-react';
import * as React from 'react';
import Link from 'next/link';
import { handleSignOut } from '@/lib/components/navbar/navbar.utils';
import { useRouter } from 'next/navigation';

export default function ProfileMenu() {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <User className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle profile dropdown</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link className="w-full inline-block text-left" href="/account">
            Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <form className="w-full px-0 py-0" onSubmit={(e) => handleSignOut(e, router)}>
            <button className="w-full inline-block text-left cursor-default" type="submit" autoFocus={false}>
              Sign out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}