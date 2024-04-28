import { signOut } from '@/src/lib/utils/auth-helpers/server';
import toast from 'react-hot-toast';
import { getRedirectMethod } from '@/src/lib/utils/auth-helpers/settings';
import Router from 'next/router'

export async function handleSignOut(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const router = getRedirectMethod() === 'client' ? Router : null;
  const result = await signOut();

  if (result.error) {
    toast.error(result.error);
  } else {
    toast.success(result?.message ?? '');
    router?.push('/');
  }
}