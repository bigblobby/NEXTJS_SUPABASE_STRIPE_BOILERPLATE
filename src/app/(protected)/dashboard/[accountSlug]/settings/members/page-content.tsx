'use client';

import { Card } from '@/lib/components/ui/card';
import { Heading } from '@/lib/components/ui/heading';

interface SettingsMembersPageContentsProps {
  members: any[];
}

export default function SettingsMembersPageContents({
  members
}: SettingsMembersPageContentsProps){
  return (
    <div>
      <Card className="p-4 shadow-none">
        <Heading variant="h4" className="mb-3">Members</Heading>

        <div>
          {members.map((member: any) => (
            <div key={member.user_id} className="flex items-center justify-between p-3 border-b border-gray-200">
              <div>
                {member.name}
              </div>
              <div>
                {member.is_primary_owner ? 'Primary Owner' : member.account_role}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}