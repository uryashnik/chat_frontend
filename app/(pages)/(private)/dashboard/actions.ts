'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutAction(): Promise<void> {
  const cookieHeader = (await headers()).get('cookie') ?? '';

  try {
    await fetch('http://localhost:3000/auth/logout', {
      method: 'POST',
      headers: { Cookie: cookieHeader},
      cache: 'no-store',
    });
  } catch {
   
  }

  redirect('/login');
}
