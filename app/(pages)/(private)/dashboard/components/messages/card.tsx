'use client';

import Image from 'next/image';
import { Gender } from '@/app/src/enums/gender.enum';
import type { Message } from '@/app/src/types/message';

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

const buttonClasses = "w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-100/40 dark:bg-zinc-600/80 transition cursor-pointer hover:opacity-100"

interface MessageCardProps {
  message: Message;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MessageCard({ message, onEdit, onDelete }: MessageCardProps) {
  return (
    <article className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-700 flex flex-col gap-4 hover:shadow-md transition-shadow select-none">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-sm">
            <Image
              src={message.author.gender === Gender.Female ? '/female.svg' : '/male.svg'}
              alt="Avatar"
              width={40}
              height={40}
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">
              {message.author.firstName} {message.author.lastName}
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{formatDate(message.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onEdit}
            title="Edit"
            className={`${buttonClasses} hover:bg-blue-100 dark:hover:bg-blue-900/40`}
          >
            <Image src="/pencil.svg" alt="Edit" width={14} height={14} />
          </button>
          <button
            onClick={onDelete}
            title="Delete"
            className={`${buttonClasses} hover:bg-red-100 dark:hover:bg-red-900/40`}
          >
            <Image src="/trash.svg" alt="Delete" width={14} height={14} />
          </button>
        </div>
      </div>

      {message.tag && (
        <span className="self-start text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
          #{message.tag.label}
        </span>
      )}

      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-4">{message.text}</p>
    </article>
  );
}
