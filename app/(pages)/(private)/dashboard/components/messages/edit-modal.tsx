'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Message, Tag } from '@/app/src/types/message';
import Select from '@/app/src/components/select';
import ModalShell from '@/app/src/components/modal-shell';
import {apiFetch} from '@/app/src/utils/api-fetch.util';

export function updateMessage(
  id: number,
  data: { text?: string; tagId?: number },
) {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_BASE}/messages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

interface EditMessageModalProps {
  message: Message;
  tags: Tag[];
  onClose: () => void;
}

export default function EditMessageModal({ message, tags, onClose }: EditMessageModalProps) {
  const router = useRouter();
  const [isPending, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editText, setEditText] = useState(message.text);
  const [editTagId, setEditTagId] = useState<string>(String(message.tag?.id ?? ''));
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  async function handleSave() {
    setError(null);
    setLoading(true);
  
    const result = await updateMessage(message.id, {
      text: editText.trim() || undefined,
      tagId: editTagId ? Number(editTagId) : undefined,
    });
  
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
  
    router.refresh();
    onClose();
  }

  return (
    <ModalShell
      title="Edit message"
      onClose={onClose}
      footer={
        <button
          onClick={handleSave}
          disabled={isPending || !editText.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium transition cursor-pointer"
        >
          {isPending && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          Save
        </button>
      }
    >
      <div>
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          {message.author.firstName} {message.author.lastName}
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
          {formatDate(message.createdAt)}
          {message.updatedAt !== message.createdAt && (
            <span className="ml-1 text-zinc-300 dark:text-zinc-600">
              · edited {formatDate(message.updatedAt)}
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          Text
        </label>
        <textarea
          ref={textareaRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          rows={5}
          disabled={isPending}
          className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none transition"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          Tag
        </label>
        <Select
          value={editTagId}
          onChange={setEditTagId}
          options={tags.map((tag) => ({ id: tag.id, label: tag.label }))}
          placeholder="No tag"
          disabled={isPending}
          className="h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition appearance-none cursor-pointer"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </ModalShell>
  );
}
