'use server';

import { EMAIL_REGEX, PASSWORD_REGEX } from '@/app/src/constants/validation';

export interface RegisterState {
  errors?: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
    general?: string;
  };
  success?: boolean;
}

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const email = (formData.get('email') as string) ?? '';
  const password = (formData.get('password') as string) ?? '';
  const firstName = (formData.get('firstName') as string) ?? '';
  const lastName = (formData.get('lastName') as string) ?? '';
  const gender = (formData.get('gender') as string) ?? '';

  const errors: NonNullable<RegisterState['errors']> = {};

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else if (password.length > 16) {
    errors.password = 'Password must be at most 16 characters';
  } else if (!PASSWORD_REGEX.test(password)) {
    errors.password =
      'Password must contain at least one uppercase letter and one special character !@#$%^&*';
  }

  if (!firstName.trim()) {
    errors.firstName = 'First name is required';
  } else if (firstName.length > 40) {
    errors.firstName = 'First name must be at most 40 characters';
  }

  if (!lastName.trim()) {
    errors.lastName = 'Last name is required';
  } else if (lastName.length > 40) {
    errors.lastName = 'Last name must be at most 40 characters';
  }

  if (!gender) {
    errors.gender = 'Gender is required';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const res = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName, lastName, gender }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { errors: { general: data?.message ?? 'Registration failed. Please try again.' } };
    }

    return { success: true };
  } catch {
    return { errors: { general: 'Unable to connect to server. Please try again.' } };
  }
}
