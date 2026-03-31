'use client';

import { useUser } from '@/app/(pages)/(private)/user-context';
import { logoutAction } from '@/app/(pages)/(private)/dashboard/actions';

function MaleAvatar() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="20" cy="20" r="20" fill="#3B82F6" />
      <circle cx="20" cy="15" r="6" fill="#BFDBFE" />
      <path
        d="M8 34c0-6.627 5.373-10 12-10s12 3.373 12 10"
        fill="#BFDBFE"
      />
    </svg>
  );
}

function FemaleAvatar() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="20" cy="20" r="20" fill="#EC4899" />
      <circle cx="20" cy="15" r="6" fill="#FCE7F3" />
      <path
        d="M8 34c0-6.627 5.373-10 12-10s12 3.373 12 10"
        fill="#FCE7F3"
      />
      <path
        d="M14 12 Q15 9 20 9 Q25 9 26 12"
        stroke="#FCE7F3"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function DashboardHeader() {
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
              {isFemale ? <FemaleAvatar /> : <MaleAvatar />}
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
