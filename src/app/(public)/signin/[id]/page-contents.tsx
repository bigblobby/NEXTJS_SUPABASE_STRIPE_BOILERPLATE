import Logo from '@/lib/components/icons/Logo';
import { Card, CardContent, CardHeader } from '@/lib/components/ui/card';
import { Heading } from '@/lib/components/ui/heading';
import PasswordSignIn from '@/lib/components/auth-forms/PasswordSignIn';
import EmailSignIn from '@/lib/components/auth-forms/EmailSignIn';
import ForgotPassword from '@/lib/components/auth-forms/ForgotPassword';
import UpdatePassword from '@/lib/components/auth-forms/UpdatePassword';
import SignUp from '@/lib/components/auth-forms/Signup';
import Separator from '@/lib/components/auth-forms/Separator';
import OauthSignIn from '@/lib/components/auth-forms/OauthSignIn';

interface SignInPageContentsProps {
  view: string;
  allowOauth: boolean;
  allowEmail: boolean;
  allowPassword: boolean;
}

export default function SignInPageContents({
  view,
  allowOauth,
  allowEmail,
  allowPassword,
}: SignInPageContentsProps) {
  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
        <div className="flex justify-center pb-12 ">
          <Logo width="64px" height="64px" />
        </div>

        <Card>
          <CardHeader>
            <Heading className="mb-1 font-medium" as="h3" variant="h3">
              {view === 'forgot_password'
                ? 'Reset Password'
                : view === 'update_password'
                  ? 'Update Password'
                  : view === 'signup'
                    ? 'Sign Up'
                    : 'Sign In'
              }
            </Heading>
          </CardHeader>
          <CardContent>
            {view === 'password_signin' && (
              <PasswordSignIn allowEmail={allowEmail} />
            )}
            {view === 'email_signin' && (
              <EmailSignIn allowPassword={allowPassword} />
            )}
            {view === 'forgot_password' && (
              <ForgotPassword allowEmail={allowEmail} />
            )}
            {view === 'update_password' && (
              <UpdatePassword />
            )}
            {view === 'signup' && (
              <SignUp allowEmail={allowEmail} />
            )}
            {view !== 'update_password' &&
              view !== 'signup' &&
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