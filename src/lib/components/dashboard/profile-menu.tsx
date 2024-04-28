import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/src/lib/components/ui/dropdown-menu';
import { Button } from '@/src/lib/components/ui/button';
import { User } from 'lucide-react';
import * as React from 'react';
import Link from 'next/link';

export default function ProfileMenu({
  handleSignOut,
}: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <User className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle profile dropdown</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link href="/account">
            Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <form onSubmit={(e) => handleSignOut(e)}>
            <button type="submit" autoFocus={false}>
              Sign out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}