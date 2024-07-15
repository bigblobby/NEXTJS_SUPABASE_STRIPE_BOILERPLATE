'use client';

import { Card } from '@/lib/components/ui/card';
import { Heading } from '@/lib/components/ui/heading';
import { Text } from '@/lib/components/ui/text';
import { Button } from '@/lib/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/lib/components/ui/table';
import Link from 'next/link';
import { Badge } from '@/lib/components/ui/badge';
import { useAccounts } from '@/lib/hooks/useAccounts';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/lib/components/ui/dialog';
import NewTeamForm from '@/lib/components/forms/account/new-team-form';
import { useState } from 'react';

export default function SettingsTeamsPageContents(){
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false)
  const accounts = useAccounts();
  const teamAccounts = accounts.filter((account: any) => account.personal_account === false);

  return (
    <div>
      <Card className="p-4 shadow-none">
        <Heading variant="h4" className="mb-3">Teams</Heading>
        {teamAccounts.length > 0 ? (
          <>
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
          </>
        ) : (
          <>
            <Text>You currently have no teams. Create one below.</Text>

            <Button onClick={() => setShowNewTeamDialog(true)} variant="outline" className="mt-4">Create a new team</Button>
            <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a new team</DialogTitle>
                  <DialogDescription>
                    Create a team to collaborate with others.
                  </DialogDescription>
                </DialogHeader>
                <NewTeamForm />
              </DialogContent>
            </Dialog>
          </>
        )}
      </Card>
    </div>
  );
}