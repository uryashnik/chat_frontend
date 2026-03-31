import Image from 'next/image';
import { Gender } from '@/app/src/enums/gender.enum';
import type { Message } from '@/app/src/types/message';

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

interface MessageCardProps {
  message: Message;
  onClick?: () => void;
}

export default function MessageCard({ message, onClick }: MessageCardProps) {
  return (
    <article
      onClick={onClick}
      className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-700 flex flex-col gap-4 hover:shadow-md transition-shadow cursor-pointer select-none"
    >
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

        {message.tag && (
          <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
            #{message.tag.label}
          </span>
        )}
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-4">{message.text}</p>
    </article>
  );
}
