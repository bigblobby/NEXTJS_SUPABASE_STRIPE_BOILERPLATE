import { createClient } from '@/lib/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  getAuthTypes,
  getViewTypes,
  getDefaultSignInView,
} from '@/lib/utils/auth-helpers/settings';
import SignInPageContents from '@/app/(public)/(main)/signin/[id]/page-contents';

interface SignInPageProps {
  params: {
    id: string;
  }
}

export function generateMetadata({ params }: SignInPageProps) {
  let page;

  switch (params.id) {
    case 'password_signin':
      page = 'Sign in with password';
      break;
    case 'email_signin':
      page = 'Sign in with email';
      break;
    case 'signup':
      page = 'Sign up';
      break;
    case 'forgot_password':
      page = 'Reset password';
      break;
    case 'update_password':
      page = 'Update password';
      break;
    default:
      page = 'Your business motto'
      break;
  }

  return {
    title: `NextBoilerplate - ${page}`,
  };
}

export default async function SignInPage({
  params,
}: SignInPageProps) {
  const { allowOauth, allowEmail, allowPassword } = getAuthTypes();
  const viewTypes = getViewTypes();

  let view: string;

  if (viewTypes.includes(params.id)) {
    view = params.id;
  } else {
    const preferredSignInView = cookies().get('preferredSignInView')?.value || null;
    view = getDefaultSignInView(preferredSignInView);
    return redirect(`/signin/${view}`);
  }

  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user && view !== 'update_password') {
    return redirect('/account');
  } else if (!user && view === 'update_password') {
    return redirect('/signin');
  }

  return <SignInPageContents
    view={view}
    allowOauth={allowOauth}
    allowEmail={allowEmail}
    allowPassword={allowPassword}
  />
}
