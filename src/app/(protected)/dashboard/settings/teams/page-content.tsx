'use client';

import { Card } from '@/lib/components/ui/card';
import { Heading } from '@/lib/components/ui/heading';
import { Text } from '@/lib/components/ui/text';
import { Button } from '@/lib/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/lib/components/ui/table';
import Link from 'next/link';
import { Badge } from '@/lib/components/ui/badge';
import { useAccounts } from '@/lib/providers/accounts-provider';

export default function SettingsTeamsPageContents(){
  const accounts = useAccounts();
  const teamAccounts = accounts.filter((account: any) => account.personal_account === false);

  return (
    <div>
      <Card className="p-4 shadow-none">
        <Heading variant="h4">Teams</Heading>
        <Text>These are the teams you belong to</Text>

        <Table className="mt-4">
          <TableBody>
            {teamAccounts.map((account: any) => (
              <TableRow key={account.id}>
                <TableCell>
                  <div className="flex gap-x-2">
                    {account.name}
                    <Badge variant={account.role === 'owner' ? 'outline' : 'default'}>
                      {account.is_primary_owner ? 'Primary Owner' : account.role}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/${account.slug}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}