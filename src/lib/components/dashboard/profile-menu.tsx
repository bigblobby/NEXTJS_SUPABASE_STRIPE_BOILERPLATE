'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/lib/components/ui/dropdown-menu';
import { Button } from '@/lib/components/ui/button';
import { User } from 'lucide-react';
import * as React from 'react';
import Link from 'next/link';
import { signOut } from '@/lib/actions/auth';

interface ProfileMenuProps {
  settingsLink: string;
}

export default function ProfileMenu({
  settingsLink,
}: ProfileMenuProps) {
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
          <Link className="w-full inline-block text-left" href={settingsLink}>
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
            <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full inline-block text-left" onClick={() => signOut()}>
              Sign out
            </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}