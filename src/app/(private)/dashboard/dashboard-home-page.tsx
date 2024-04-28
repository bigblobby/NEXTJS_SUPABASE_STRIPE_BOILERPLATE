'use client'

import { useSession } from '@/src/lib/hooks/useSession';

export default function DashboardHomePage() {
  const { session, supabase } = useSession();

  return (
    <div>Home</div>
  )
}