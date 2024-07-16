'use client';

import { Card } from '@/lib/components/ui/card';
import { Heading } from '@/lib/components/ui/heading';

interface SettingsMembersPageContentsProps {
  members: any[];
}

export default function SettingsMembersPageContents({
  members
}: SettingsMembersPageContentsProps){
  console.log(members)
  return (
    <div>
      <Card className="p-4 shadow-none">
        <Heading variant="h4" className="mb-3">Members</Heading>
      </Card>
    </div>
  );
}