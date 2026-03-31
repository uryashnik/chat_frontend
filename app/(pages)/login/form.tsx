'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { loginAction, type LoginState } from './actions';

const initialState: LoginState = {};

export function Form() {
  const [email, setEmail] = useState('');
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <>
      {state.errors?.general && (
        <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 px-4 py-3 text-sm text-red-600 dark:text-red-300">
          {state.errors.general}
        </div>
      )}

      <form action={formAction} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white bg-white dark:bg-zinc-700 outline-none transition placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-offset-0 ${
              state.errors?.email
                ? 'border-red-400 focus:ring-red-300 dark:border-red-500 dark:focus:ring-red-700'
                : 'border-zinc-300 dark:border-zinc-600 focus:ring-zinc-400 dark:focus:ring-zinc-500'
            }`}
          />
          {state.errors?.email && (
            <p className="text-xs text-red-500 dark:text-red-400">{state.errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white bg-white dark:bg-zinc-700 outline-none transition placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-offset-0 ${
              state.errors?.password
                ? 'border-red-400 focus:ring-red-300 dark:border-red-500 dark:focus:ring-red-700'
                : 'border-zinc-300 dark:border-zinc-600 focus:ring-zinc-400 dark:focus:ring-zinc-500'
            }`}
          />
          {state.errors?.password && (
            <p className="text-xs text-red-500 dark:text-red-400">{state.errors.password}</p>
          )}
        </div>

        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-medium text-zinc-900 dark:text-white underline underline-offset-2 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
          >
            Registration
          </Link>
        </p>

        <button
          type="submit"
          disabled={isPending}
          className="mt-1 flex h-10 w-full items-center justify-center rounded-lg bg-zinc-900 dark:bg-white text-sm font-semibold text-white dark:text-zinc-900 transition hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Signing in…
            </span>
          ) : (
            'Log in'
          )}
        </button>
      </form>
    </>
  );
}
