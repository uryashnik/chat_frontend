'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Tag } from '@/app/src/types/message';
import Select from '@/app/src/components/select';
import ModalShell from '@/app/src/components/modal-shell';
import { apiFetch } from '@/app/src/utils/api-fetch.util';

export function createMessage(data: { text: string; tag?: { id: number } }) {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_BASE}/messages`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

interface CreateMessageModalProps {
  tags: Tag[];
  onClose: () => void;
}

export default function CreateMessageModal({ tags, onClose }: CreateMessageModalProps) {
  const router = useRouter();
  const [isPending, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [tagId, setTagId] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  async function handleCreate() {
    setError(null);
    setLoading(true);

    const result = await createMessage({
      text: text.trim(),
      tag: tagId ? { id: Number(tagId) } : undefined,
    });

    if (result.status === 401) {
      router.push('/login');
      return;
    }

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
      title="Create message"
      onClose={onClose}
      footer={
        <button
          onClick={handleCreate}
          disabled={isPending || !text.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium transition cursor-pointer"
        >
          {isPending && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          Create
        </button>
      }
    >
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          Text
        </label>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          disabled={isPending}
          className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none transition"
        />
      </div>

      <Select
        label="Tag"
        value={tagId}
        onChange={setTagId}
        options={tags.map((tag) => ({ id: tag.id, label: tag.label }))}
        placeholder="No tag"
        disabled={isPending}
      />

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </ModalShell>
  );
}
