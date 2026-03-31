import { Form } from './form';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900 px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-800 shadow-lg p-8">
        <h1 className="mb-6 text-center text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Create account
        </h1>
        <Form />
      </div>
    </div>
  );
}
