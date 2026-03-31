import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserProvider, type User } from './user-context';

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

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  return <UserProvider user={user}>{children}</UserProvider>;
}
