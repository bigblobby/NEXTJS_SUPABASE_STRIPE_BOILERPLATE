const allowOauth = true;
const allowEmail = true;
const allowPassword = true;

if (!allowPassword && !allowEmail) throw new Error('At least one of allowPassword and allowEmail must be true');

export const getAuthTypes = () => {
  return { allowOauth, allowEmail, allowPassword };
};

export const getViewTypes = () => {
  const viewTypes: string[] = [];

  if (allowEmail) {
    viewTypes.push('email_signin');
  }

  if (allowPassword) {
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
  let defaultView = allowPassword ? 'password_signin' : 'email_signin';
  if (preferredSignInView && getViewTypes().includes(preferredSignInView)) {
    defaultView = preferredSignInView;
  }

  return defaultView;
};
