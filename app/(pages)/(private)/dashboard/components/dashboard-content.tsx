import { headers } from 'next/headers';
import { Suspense } from 'react';
import FilterPanel from './filter-panel';
import MessagesList from './messages-list';
import type { Tag, MessagesResponse } from '@/app/src/types/message';
import Pagination from './pagination';

const API_BASE = 'http://localhost:3000';
const MESSAGES_LIMIT = 2;

async function getCookieHeader(): Promise<string> {
  return (await headers()).get('cookie') ?? '';
}

async function getTags(cookieHeader: string): Promise<Tag[]> {
  try {
    const res = await fetch(`${API_BASE}/messages/tags`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    console.log('data: ', data);
    return Array.isArray(data) ? data : (data.data ?? []);
  } catch {
    return [];
  }
}

async function getMessages(
  page: number,
  tagId: string | undefined,
  dateFrom: string | undefined,
  dateTo: string | undefined,
  cookieHeader: string,
): Promise<MessagesResponse> {
  const url = new URL(`${API_BASE}/messages`);
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

function emptyResponse(page: number): MessagesResponse {
  return {
    data: [],
    meta: { total: 0, page, limit: MESSAGES_LIMIT, totalPages: 0 },
  };
}

interface DashboardContentProps {
  page: number;
  tagId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export default async function DashboardContent({ page, tagId, dateFrom, dateTo }: DashboardContentProps) {
  const cookieHeader = await getCookieHeader();

  const [tags, messagesData] = await Promise.all([
    getTags(cookieHeader),
    getMessages(page, tagId, dateFrom, dateTo, cookieHeader),
  ]);

  const totalPages = messagesData.meta?.totalPages ?? 1;

  return (
    <div className="flex flex-col gap-6">
      <Suspense>
        <FilterPanel tags={tags} />
      </Suspense>

      <MessagesList messages={messagesData.data} tags={tags} />

      <Suspense>
        <Pagination currentPage={page} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
