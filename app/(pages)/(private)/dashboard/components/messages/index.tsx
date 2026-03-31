'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Message, Tag } from '@/app/src/types/message';
import MessageCard from './card';
import EditMessageModal from './edit-modal';
import DeleteMessageModal from './delete-modal';
import CreateMessageModal from './create-modal';

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

export default function Messages({ messages, tags }: IProps) {
  const [editMessage, setEditMessage] = useState<Message | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<Message | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  return (
    <>
      {isCreating && (
        <CreateMessageModal
          tags={tags}
          onClose={() => setIsCreating(false)}
        />
      )}
      {editMessage && (
        <EditMessageModal
          message={editMessage}
          tags={tags}
          onClose={() => setEditMessage(null)}
        />
      )}
      {deleteMessage && (
        <DeleteMessageModal
          message={deleteMessage}
          isLastOnPage={messages.length === 1}
          onClose={() => setDeleteMessage(null)}
        />
      )}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition cursor-pointer"
        >
          Add new
        </button>
      </div>
      {!!messages.length ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onEdit={() => setEditMessage(message)}
              onDelete={() => setDeleteMessage(message)}
            />
          ))}
        </div>
      ) : (
        <NoMessages />
      )}
    </>
  );
}
