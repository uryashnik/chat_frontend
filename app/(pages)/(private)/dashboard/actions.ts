'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const API_BASE = 'http://localhost:3000';

async function getCookieHeader(): Promise<string> {
  return (await headers()).get('cookie') ?? '';
}

export async function logoutAction(): Promise<void> {
  const cookieHeader = await getCookieHeader();

  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });
  } catch {
    // ignore
  }

  redirect('/login');
}

export async function deleteMessageAction(id: number): Promise<{ error?: string }> {
  const cookieHeader = await getCookieHeader();

  try {
    const res = await fetch(`${API_BASE}/messages/${id}`, {
      method: 'DELETE',
      headers: { Cookie: cookieHeader },
    });

    if (!res.ok) return { error: 'Не удалось удалить сообщение' };

    revalidatePath('/dashboard');
    return {};
  } catch {
    return { error: 'Ошибка сети' };
  }
}

export async function updateMessageAction(
  id: number,
  data: { text?: string; tagId?: number },
): Promise<{ error?: string }> {
  const cookieHeader = await getCookieHeader();

  try {
    const res = await fetch(`${API_BASE}/messages/${id}`, {
      method: 'PATCH',
      headers: {
        Cookie: cookieHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) return { error: 'Не удалось обновить сообщение' };

    revalidatePath('/dashboard');
    return {};
  } catch {
    return { error: 'Ошибка сети' };
  }
}
