'use client';

import Image from 'next/image';

import { useUser } from '@/app/(pages)/(private)/user-context';
import { logoutAction } from '@/app/(pages)/(private)/dashboard/actions';

export default function Header() {
  const user = useUser();
  const isFemale = user.gender?.toLowerCase() === 'female';

  return (
    <header className="w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">
          Dashboard
        </span>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-sm">
              <Image
                src={isFemale ? '/female.svg' : '/male.svg'}
                alt={'Avatar'}
                width={40}
                height={40}
              />
            </div>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
              {user.firstName} {user.lastName}
            </span>
          </div>

          <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-700" />

          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
            >
              Log Out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
