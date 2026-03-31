'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Tag, MessagesResponse } from '@/app/src/types/message';

const MESSAGES_LIMIT = 2;

async function getCookieHeader(): Promise<string> {
  return (await headers()).get('cookie') ?? '';
}

function emptyResponse(page: number): MessagesResponse {
  return {
    data: [],
    meta: { total: 0, page, limit: MESSAGES_LIMIT, totalPages: 0 },
  };
}

export async function getTags(): Promise<Tag[]> {
  const cookieHeader = await getCookieHeader();
  try {
    const res = await fetch(`${process.env.API_BASE}/messages/tags`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data ?? []);
  } catch {
    return [];
  }
}

export async function getMessages(
  page: number,
  tagId?: string,
  dateFrom?: string,
  dateTo?: string,
): Promise<MessagesResponse> {
  const cookieHeader = await getCookieHeader();
  const url = new URL(`${process.env.API_BASE}/messages`);
  url.searchParams.set('limit', String(MESSAGES_LIMIT));
  url.searchParams.set('page', String(page));
  if (tagId) url.searchParams.set('tagId', tagId);
  if (dateFrom) url.searchParams.set('dateFrom', new Date(dateFrom).toISOString());
  if (dateTo) url.searchParams.set('dateTo', new Date(dateTo).toISOString());

  try {
    const res = await fetch(url.toString(), {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });
    if (!res.ok) return emptyResponse(page);
    const data = await res.json();

    if (Array.isArray(data)) {
      return {
        data,
        meta: {
          total: data.length,
          page,
          limit: MESSAGES_LIMIT,
          totalPages: 1,
        },
      };
    }

    return data as MessagesResponse;
  } catch {
    return emptyResponse(page);
  }
}

export async function logoutAction(): Promise<void> {
  const cookieHeader = await getCookieHeader();

  try {
    await fetch(`${process.env.API_BASE}/auth/logout`, {
      method: 'POST',
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });
  } catch {}

  redirect('/login');
}

