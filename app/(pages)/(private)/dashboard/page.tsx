import { Suspense } from 'react';
import DashboardHeader from '@/app/src/components/DashboardHeader';
import DashboardContent from './components/dashboard-content';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tagId?: string; dateFrom?: string; dateTo?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const tagId = params.tagId;
  const dateFrom = params.dateFrom;
  const dateTo = params.dateTo;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100 dark:bg-zinc-900">
      <DashboardHeader />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Suspense
          fallback={
            <div className="flex flex-col gap-6 animate-pulse">
              <div className="h-16 bg-white dark:bg-zinc-800 rounded-xl" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-40 bg-white dark:bg-zinc-800 rounded-xl" />
                ))}
              </div>
            </div>
          }
        >
          <DashboardContent page={page} tagId={tagId} dateFrom={dateFrom} dateTo={dateTo} />
        </Suspense>
      </main>
    </div>
  );
}
