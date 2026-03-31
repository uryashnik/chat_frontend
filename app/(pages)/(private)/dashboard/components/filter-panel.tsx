'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import type { Tag, User } from '@/app/src/types/message';
import DatePicker from '@/app/src/components/date-picker';
import Select from '@/app/src/components/select';

interface FilterPanelProps {
  tags: Tag[];
  users: User[];
}

export default function FilterPanel({ tags, users }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentTag = searchParams.get('tagId') ?? '';
  const currentUser = searchParams.get('authorId') ?? '';
  const currentDateFrom = searchParams.get('dateFrom') ?? '';
  const currentDateTo = searchParams.get('dateTo') ?? '';

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  function clearFilters() {
    startTransition(() => {
      router.push('?page=1');
    });
  }

  const userOptions = users.map((u) => ({
    id: u.id,
    label: `${u.firstName} ${u.lastName}`,
  }));

  const hasActiveFilters = currentTag || currentUser || currentDateFrom || currentDateTo;

    return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl px-5 py-4 shadow-sm border border-zinc-200 dark:border-zinc-700">
      <div className="flex flex-wrap items-end gap-4">
        <DatePicker
          id="filter-date-from"
          label="From (date & time)"
          value={currentDateFrom}
          onChange={(value) => updateParam('dateFrom', value)}
          disabled={isPending}
        />
        <DatePicker
          id="filter-date-to"
          label="To (date & time)"
          value={currentDateTo}
          min={currentDateFrom || undefined}
          onChange={(value) => updateParam('dateTo', value)}
          disabled={isPending}
        />

        <Select
          id="filter-tag"
          label="Tag"
          value={currentTag}
          onChange={(value) => updateParam('tagId', value)}
          options={tags}
          placeholder="All tags"
          disabled={isPending}
        />

        <Select
          id="filter-user"
          label="User"
          value={currentUser}
          onChange={(value) => updateParam('authorId', value)}
          options={userOptions}
          placeholder="All users"
          prefix=""
          disabled={isPending}
        />

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            disabled={isPending}
            className="h-9 px-4 rounded-lg text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-zinc-200 dark:border-zinc-600 transition disabled:opacity-50 cursor-pointer"
          >
            Reset
          </button>
        )}

        {isPending && (
          <div className="h-9 flex items-center">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
