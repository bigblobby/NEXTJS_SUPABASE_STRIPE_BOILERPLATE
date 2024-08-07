'use server';

import { cookies } from 'next/headers';
import { getURL } from '@/lib/utils/helpers';
import { createClient } from '@/lib/utils/supabase/server';
import { getAuthTypes } from '@/lib/utils/auth-helpers/settings';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const emailSchema = z.string().email();

export async function signInWithEmail(formData: FormData) {
  const cookieStore = cookies();
  const callbackURL = getURL('/auth/callback');

  const email = String(formData.get('email')).trim();

  if (!emailSchema.safeParse(email)) {
    return { error: 'Invalid email address.' };
  }

  const supabase = createClient();
  let options = {
    emailRedirectTo: callbackURL,
    shouldCreateUser: true
  };

  // If allowPassword is true, do not create a new user this is
  // because these one time email links also act as a sign up and we
  // don't want to sign a user up that has already signed up with password
  const { allowPassword } = getAuthTypes();
  if (allowPassword) options.shouldCreateUser = false;
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: options
  });

  if (error) {
    return { error: 'You could not be signed in.' };
  } else if (data) {
    cookieStore.set('preferredSignInView', 'email_signin', { path: '/' });
    return { message: 'Please check your email for a magic link. You may now close this tab.' }
  } else {
    return { error: 'Hmm... Something went wrong.' };
  }
}

export async function signInWithPassword(formData: FormData) {
  const cookieStore = cookies();
  const email = String(formData.get('email')).trim();
  const password = String(formData.get('password')).trim();

  const supabase = createClient();
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return { error: error.message };
  } else if (data.user) {
    cookieStore.set('preferredSignInView', 'password_signin', { path: '/' });
    return { error: null, message: 'Success' };
  } else {
    return { error: 'something went wrong' };
  }
}

export async function signUp(formData: FormData) {
  const callbackURL = getURL('/auth/callback');

  const email = String(formData.get('email')).trim();
  const password = String(formData.get('password')).trim();

  if (!emailSchema.safeParse(email)) {
    return { error: 'Invalid email address.' };
  }

  const supabase = createClient();
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackURL
    }
  });

  if (error) {
    return { error: error.message };
  } else if (data.session) {
    return { message: 'You are now signed in.' };
  } else if (
    data.user &&
    data.user.identities &&
    data.user.identities.length == 0
  ) {
    return { error: 'There is already an account associated with this email address. Try resetting your password.' };
  } else if (data.user) {
    return { message: 'Success! Please check your email for a confirmation link. You may now close this tab.' };
  } else {
    return { message: 'You could not be signed up.' };
  }
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
  }

  redirect('/signin');
}

export async function requestPasswordUpdate(formData: FormData) {
  const email = String(formData.get('email')).trim();

  if (!emailSchema.safeParse(email)) {
    return { error: 'Invalid email address.' };
  }

  const supabase = createClient();

  const callbackURL = getURL('/auth/reset_password');

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackURL
  });

  if (error) {
    return { error: 'Please try again' };
  } else if (data) {
    return { message: 'Please check your email for a password reset link. You may now close this tab.' }
  } else {
    return { error: 'Hmm... Something went wrong.' };
  }
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get('password')).trim();
  const passwordConfirm = String(formData.get('passwordConfirm')).trim();

  if (password !== passwordConfirm) {
    return { error: 'Passwords do not match.' };
  }

  const supabase = createClient();

  const { error, data } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    return { error: error.message };
  } else if (data.user) {
    return { message: 'Your password has been updated.' };
  } else {
    return { error: 'Your password could not be updated.' };
  }
}