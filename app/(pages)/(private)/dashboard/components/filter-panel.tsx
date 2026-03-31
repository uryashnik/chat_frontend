'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import type { Tag } from '@/app/src/types/message';

interface FilterPanelProps {
  tags: Tag[];
}

export default function FilterPanel({ tags }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentTag = searchParams.get('tagId') ?? '';
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

  const hasActiveFilters = currentTag || currentDateFrom || currentDateTo;

  const inputClass =
    'h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition';

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl px-5 py-4 shadow-sm border border-zinc-200 dark:border-zinc-700">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-date-from"
            className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide"
          >
            С (дата и время)
          </label>
          <input
            id="filter-date-from"
            type="datetime-local"
            value={currentDateFrom}
            onChange={(e) => updateParam('dateFrom', e.target.value)}
            disabled={isPending}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-date-to"
            className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide"
          >
            По (дата и время)
          </label>
          <input
            id="filter-date-to"
            type="datetime-local"
            value={currentDateTo}
            min={currentDateFrom || undefined}
            onChange={(e) => updateParam('dateTo', e.target.value)}
            disabled={isPending}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-tag"
            className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide"
          >
            Тег
          </label>
          <select
            id="filter-tag"
            value={currentTag}
            onChange={(e) => updateParam('tagId', e.target.value)}
            disabled={isPending}
            className="h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition appearance-none pr-8 cursor-pointer"
          >
            <option value="">Все теги</option>
            {tags.map((tag) => (
              <option key={tag.id} value={String(tag.id)}>
                #{tag.name}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            disabled={isPending}
            className="h-9 px-4 rounded-lg text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-zinc-200 dark:border-zinc-600 transition disabled:opacity-50 cursor-pointer"
          >
            Сбросить
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
