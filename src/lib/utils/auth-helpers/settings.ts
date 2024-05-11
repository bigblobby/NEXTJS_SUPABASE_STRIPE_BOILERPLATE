import { AppConfig } from '@/lib/config/app-config';

if (!AppConfig.auth.allowPassword && !AppConfig.auth.allowEmail) throw new Error('At least one of allowPassword and allowEmail must be true');

export const getAuthTypes = () => {
  return {
    allowOauth: AppConfig.auth.allowOauth,
    allowEmail: AppConfig.auth.allowEmail,
    allowPassword: AppConfig.auth.allowPassword
  };
};

export const getViewTypes = () => {
  const viewTypes: string[] = [];

  if (AppConfig.auth.allowEmail) {
    viewTypes.push('email_signin');
  }

  if (AppConfig.auth.allowPassword) {
    viewTypes.push(
      'password_signin',
      'forgot_password',
      'update_password',
      'signup'
    );
  }

  return viewTypes;
};

export const getDefaultSignInView = (preferredSignInView: string | null) => {
  let defaultView = AppConfig.auth.allowPassword ? 'password_signin' : 'email_signin';
  if (preferredSignInView && getViewTypes().includes(preferredSignInView)) {
    defaultView = preferredSignInView;
  }

  return defaultView;
};
