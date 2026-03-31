'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Message } from '@/app/src/types/message';
import ModalShell from '@/app/src/components/modal-shell';
import {apiFetch} from '@/app/src/utils/api-fetch.util';

export function deleteMessage(id: number) {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_BASE}/messages/${id}`, {
    method: 'DELETE',
  });
}

interface DeleteMessageModalProps {
  message: Message;
  isLastOnPage: boolean;
  onClose: () => void;
}

export default function DeleteMessageModal({ message, isLastOnPage, onClose }: DeleteMessageModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    setLoading(true);
  
    const result = await deleteMessage(message.id);
  
    if (result.status === 401) {
      router.push('/login');
      return;
    }

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
  
    const currentPage = Number(searchParams.get('page') ?? 1);
  
    if (isLastOnPage && currentPage > 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(currentPage - 1));
      router.push(`?${params.toString()}`);
    } else {
      router.refresh();
    }
  
    onClose();
  }

  return (
    <ModalShell
      title="Delete message"
      maxWidth="md"
      onClose={onClose}
      footer={
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-medium transition cursor-pointer"
        >
          {isPending && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          Delete
        </button>
      }
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-zinc-800 dark:text-zinc-100">Delete this message?</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">This action is irreversible</p>
        </div>
        <p className="w-full text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg px-4 py-3 italic line-clamp-3 text-left">
          «{message.text}»
        </p>
        {error && (
          <p className="w-full text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 text-left">
            {error}
          </p>
        )}
      </div>
    </ModalShell>
  );
}
