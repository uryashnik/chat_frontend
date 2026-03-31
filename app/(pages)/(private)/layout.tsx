import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserProvider, type User } from './user-context';
import Header from '@/app/src/components/header';

async function getAuthUser(): Promise<User | null> {
  const cookieHeader = (await headers()).get('cookie') ?? '';

  try {
    const res = await fetch('http://localhost:3000/auth/profile', {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });

    if (res.status === 401) return null;
    if (!res.ok) return null;

    return (await res.json()) as User;
  } catch {
    return null;
  }
}

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <UserProvider user={user}>
      <div className="min-h-screen flex flex-col bg-zinc-100 dark:bg-zinc-900">
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>
      </div>
    </UserProvider>
  );
}
