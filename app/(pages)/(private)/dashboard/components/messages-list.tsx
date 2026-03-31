'use client';

import { useState } from 'react';
import type { Message, Tag } from '@/app/src/types/message';
import MessageCard from './message-card';
import MessageModal from './message-modal';

interface MessagesListProps {
  messages: Message[];
  tags: Tag[];
}

export default function MessagesList({ messages, tags }: MessagesListProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center mb-4">
          <svg
            className="w-7 h-7 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
          </svg>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">Сообщения не найдены</p>
        <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-1">
          Попробуйте изменить фильтры
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            onClick={() => setSelectedMessage(message)}
          />
        ))}
      </div>

      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          tags={tags}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </>
  );
}
