'use client';

import { useEffect, useRef } from 'react';

interface ModalShellProps {
  title: string;
  onClose: () => void;
  footer: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'md' | 'lg';
}

export default function ModalShell({
  title,
  onClose,
  footer,
  children,
  maxWidth = 'lg',
}: ModalShellProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose();
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div className={`w-full ${maxWidth === 'md' ? 'max-w-md' : 'max-w-lg'} bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 flex flex-col overflow-hidden`}>
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-700">
          <span className="font-semibold text-zinc-800 dark:text-zinc-100 text-sm">{title}</span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition cursor-pointer text-lg leading-none"
          >
            ×
          </button>
        </div>

        
        <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
          {children}
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-700 flex items-center gap-2">
          {footer}
        </div>
      </div>
    </div>
  );
}
