'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PASSWORD_REGEX } from '@/app/src/constants/validation';

export interface LoginState {
  errors?: {
    email?: string;
    password?: string;
    general?: string;
  };
}

async function forwardSetCookies(response: Response): Promise<void> {
  const cookieStore = await cookies();

  const setCookieStrings: string[] =
    typeof response.headers.getSetCookie === 'function'
      ? response.headers.getSetCookie()
      : response.headers.get('set-cookie')
        ? [response.headers.get('set-cookie')!]
        : [];

  for (const raw of setCookieStrings) {
    const parts = raw.split(';').map((s) => s.trim());
    const eqIdx = parts[0].indexOf('=');
    if (eqIdx === -1) continue;

    const name = parts[0].slice(0, eqIdx);
    const value = parts[0].slice(eqIdx + 1);

    const opts: Parameters<typeof cookieStore.set>[2] = { path: '/' };
    for (const part of parts.slice(1)) {
      const lower = part.toLowerCase();
      if (lower === 'httponly') opts.httpOnly = true;
      else if (lower === 'secure') opts.secure = true;
      else if (lower.startsWith('samesite='))
        opts.sameSite = part.split('=')[1].trim().toLowerCase() as 'lax' | 'strict' | 'none';
      else if (lower.startsWith('max-age=')) opts.maxAge = Number(part.split('=')[1]);
      else if (lower.startsWith('path=')) opts.path = part.split('=')[1].trim();
    }

    cookieStore.set(name, value, opts);
  }
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = (formData.get('email') as string) ?? '';
  const password = (formData.get('password') as string) ?? '';

  const errors: NonNullable<LoginState['errors']> = {};

  if (!email.trim()) {
    errors.email = 'Email is required';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (!PASSWORD_REGEX.test(password)) {
    errors.password =
      'Password must contain at least one uppercase letter and one special character !@#$%^&*';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const body = { email, password };

    const res = await fetch(`${process.env.API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const responseText = await res.text();

    if (!res.ok) {
      let data: Record<string, unknown> = {};
      try { data = JSON.parse(responseText); } catch { /* empty */ }
      return { errors: { general: (data?.message as string) ?? 'Invalid credentials' } };
    }

    await forwardSetCookies(res);
  } catch (err) {
    return { errors: { general: 'Unable to connect to server. Please try again.' } };
  }

  redirect('/dashboard');
}
