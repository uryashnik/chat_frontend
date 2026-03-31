import DashboardHeader from '@/app/src/components/DashboardHeader';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-100 dark:bg-zinc-900">
      <DashboardHeader />
      <main className="flex-1 flex items-center justify-center">
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Dashboard — coming soon</p>
      </main>
    </div>
  );
}
