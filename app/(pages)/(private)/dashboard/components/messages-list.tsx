'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Message, Tag } from '@/app/src/types/message';
import MessageCard from './message-card';
import MessageModal from './message-modal';

const NoMessages = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center mb-4">
      <Image src="/chat-bubble.svg" alt="" width={28} height={28} className="opacity-40" />
    </div>
    <p className="text-zinc-500 dark:text-zinc-400 font-medium">No messages found</p>
    <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-1">Try adjusting your filters</p>
  </div>
);

interface IProps {
  messages: Message[];
  tags: Tag[];
}

export default function MessagesList({ messages, tags }: IProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  return (
    <>
      {selectedMessage && (
        <MessageModal message={selectedMessage} tags={tags} onClose={() => setSelectedMessage(null)} />
      )}
      {!!messages.length ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {messages.map((message) => (
            <MessageCard key={message.id} message={message} onClick={() => setSelectedMessage(message)} />
          ))}
        </div>
      ) : (
        <NoMessages />
      )}
    </>
  );
}
