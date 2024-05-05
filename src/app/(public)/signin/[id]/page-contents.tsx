import Logo from '@/lib/components/icons/logo';
import { Card, CardContent, CardHeader } from '@/lib/components/ui/card';
import { Heading } from '@/lib/components/ui/heading';
import PasswordSignIn from '@/lib/components/forms/auth/password-sign-in';
import EmailSignIn from '@/lib/components/forms/auth/email-sign-in';
import ForgotPassword from '@/lib/components/forms/auth/forgot-password';
import UpdatePassword from '@/lib/components/forms/auth/update-password';
import SignUp from '@/lib/components/forms/auth/sign-up';
import Separator from '@/lib/components/forms/auth/separator';
import OauthSignIn from '@/lib/components/forms/auth/oauth-sign-in';

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