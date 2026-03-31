'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  const pages = buildPageRange(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-1.5 py-2">
      <PaginationButton
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1 || isPending}
        aria-label="Предыдущая страница"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </PaginationButton>

      {pages.map((item, idx) =>
        item === '…' ? (
          <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-sm text-zinc-400">
            …
          </span>
        ) : (
          <PaginationButton
            key={item}
            onClick={() => goToPage(item as number)}
            disabled={isPending}
            active={item === currentPage}
          >
            {item}
          </PaginationButton>
        ),
      )}

      <PaginationButton
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages || isPending}
        aria-label="Следующая страница"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </PaginationButton>
    </div>
  );
}

interface PaginationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  'aria-label'?: string;
  children: React.ReactNode;
}

function PaginationButton({ onClick, disabled, active, children, ...rest }: PaginationButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition cursor-pointer',
        active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700',
        'disabled:opacity-40 disabled:cursor-not-allowed',
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}

function buildPageRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | '…')[] = [1];

  if (current > 3) pages.push('…');

  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push('…');

  pages.push(total);

  return pages;
}
