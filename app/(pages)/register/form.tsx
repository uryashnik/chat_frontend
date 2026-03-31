'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerAction, type RegisterState } from './actions';

const REDIRECT_DELAY_MS = 2000;

const initialState: RegisterState = {};

const inputBase =
  'w-full rounded-lg border px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white bg-white dark:bg-zinc-700 outline-none transition placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-offset-0';
const inputValid = 'border-zinc-300 dark:border-zinc-600 focus:ring-zinc-400 dark:focus:ring-zinc-500';
const inputError = 'border-red-400 focus:ring-red-300 dark:border-red-500 dark:focus:ring-red-700';

function fieldClass(hasError: boolean) {
  return `${inputBase} ${hasError ? inputError : inputValid}`;
}

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export function Form() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  useEffect(() => {
    if (!state.success) return;

    setShowSnackbar(true);
    const timer = setTimeout(() => {
      router.push('/login');
    }, REDIRECT_DELAY_MS);

    return () => clearTimeout(timer);
  }, [state.success, router]);

  return (
    <>
      {state.errors?.general && (
        <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 px-4 py-3 text-sm text-red-600 dark:text-red-300">
          {state.errors.general}
        </div>
      )}

      <form action={formAction} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
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
            className={fieldClass(!!state.errors?.email)}
          />
          {state.errors?.email && (
            <p className="text-xs text-red-500 dark:text-red-400">{state.errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="8–16 characters"
            className={fieldClass(!!state.errors?.password)}
          />
          {state.errors?.password && (
            <p className="text-xs text-red-500 dark:text-red-400">{state.errors.password}</p>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor="firstName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={fieldClass(!!state.errors?.firstName)}
            />
            {state.errors?.firstName && (
              <p className="text-xs text-red-500 dark:text-red-400">{state.errors.firstName}</p>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor="lastName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={fieldClass(!!state.errors?.lastName)}
            />
            {state.errors?.lastName && (
              <p className="text-xs text-red-500 dark:text-red-400">{state.errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="gender" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={`${fieldClass(!!state.errors?.gender)} cursor-pointer`}
          >
            <option value="" disabled>
              Select gender
            </option>
            {GENDER_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {state.errors?.gender && (
            <p className="text-xs text-red-500 dark:text-red-400">{state.errors.gender}</p>
          )}
        </div>

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
              Creating account…
            </span>
          ) : (
            'Sign up'
          )}
        </button>
      </form>

      {/* Snackbar */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 px-5 py-3.5 text-sm font-medium text-white dark:text-zinc-900 shadow-lg transition-all duration-300 ${
          showSnackbar ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <svg
          className="h-4 w-4 shrink-0 text-green-400 dark:text-green-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        Account created! Redirecting to login…
      </div>
    </>
  );
}
