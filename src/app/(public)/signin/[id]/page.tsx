import Logo from '@/lib/components/icons/Logo';
import { createClient } from '@/lib/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  getAuthTypes,
  getViewTypes,
  getDefaultSignInView,
} from '@/lib/utils/auth-helpers/settings';
import PasswordSignIn from '@/lib/components/auth-forms/PasswordSignIn';
import EmailSignIn from '@/lib/components/auth-forms/EmailSignIn';
import Separator from '@/lib/components/auth-forms/Separator';
import OauthSignIn from '@/lib/components/auth-forms/OauthSignIn';
import ForgotPassword from '@/lib/components/auth-forms/ForgotPassword';
import UpdatePassword from '@/lib/components/auth-forms/UpdatePassword';
import SignUp from '@/lib/components/auth-forms/Signup';
import { Card, CardContent, CardHeader } from '@/lib/components/ui/card';
import { Heading } from '@/lib/components/ui/heading';

interface SignInProps {
  params: {
    id: string;
  }
}

export default async function SignIn({
  params,
}: SignInProps) {
  const { allowOauth, allowEmail, allowPassword } = getAuthTypes();
  const viewTypes = getViewTypes();

  // Declare 'viewProp' and initialize with the default value
  let viewProp: string;

  // Assign url id to 'viewProp' if it's a valid string and ViewTypes includes it
  if (viewTypes.includes(params.id)) {
    viewProp = params.id;
  } else {
    const preferredSignInView = cookies().get('preferredSignInView')?.value || null;
    viewProp = getDefaultSignInView(preferredSignInView);
    return redirect(`/signin/${viewProp}`);
  }

  // Check if the user is already logged in and redirect to the account page if so
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user && viewProp !== 'update_password') {
    return redirect('/');
  } else if (!user && viewProp === 'update_password') {
    return redirect('/signin');
  }

  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
        <div className="flex justify-center pb-12 ">
          <Logo width="64px" height="64px" />
        </div>

        <Card>
          <CardHeader>
            <Heading className="mb-1 font-medium" as="h3" variant="h3">
              {viewProp === 'forgot_password'
                ? 'Reset Password'
                : viewProp === 'update_password'
                  ? 'Update Password'
                  : viewProp === 'signup'
                    ? 'Sign Up'
                    : 'Sign In'
              }
            </Heading>
          </CardHeader>
          <CardContent>
            {viewProp === 'password_signin' && (
              <PasswordSignIn allowEmail={allowEmail} />
            )}
            {viewProp === 'email_signin' && (
              <EmailSignIn allowPassword={allowPassword} />
            )}
            {viewProp === 'forgot_password' && (
              <ForgotPassword allowEmail={allowEmail} />
            )}
            {viewProp === 'update_password' && (
              <UpdatePassword />
            )}
            {viewProp === 'signup' && (
              <SignUp allowEmail={allowEmail} />
            )}
            {viewProp !== 'update_password' &&
              viewProp !== 'signup' &&
              allowOauth && (
                <>
                  <Separator text="OR" />
                  <OauthSignIn />
                </>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
