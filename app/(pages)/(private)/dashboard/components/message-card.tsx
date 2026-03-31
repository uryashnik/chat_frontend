import type { Message } from '@/app/src/types/message';

function UserAvatar({ gender }: { gender: string }) {
  const isFemale = gender?.toLowerCase() === 'female';

  if (isFemale) {
    return (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="20" cy="20" r="20" fill="#EC4899" />
        <circle cx="20" cy="15" r="6" fill="#FCE7F3" />
        <path d="M8 34c0-6.627 5.373-10 12-10s12 3.373 12 10" fill="#FCE7F3" />
        <path d="M14 12 Q15 9 20 9 Q25 9 26 12" stroke="#FCE7F3" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="20" cy="20" r="20" fill="#3B82F6" />
      <circle cx="20" cy="15" r="6" fill="#BFDBFE" />
      <path d="M8 34c0-6.627 5.373-10 12-10s12 3.373 12 10" fill="#BFDBFE" />
    </svg>
  );
}

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
            <UserAvatar gender={message.author.gender} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">
              {message.author.firstName} {message.author.lastName}
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
              {formatDate(message.createdAt)}
            </p>
          </div>
        </div>

        {message.tag && (
          <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
            #{message.tag.name}
          </span>
        )}
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-4">
        {message.text}
      </p>
    </article>
  );
}
