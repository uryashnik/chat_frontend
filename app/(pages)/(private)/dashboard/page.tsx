import { Suspense } from 'react';
import Content from './components/content';

const Skeleton = () => (
  <div className="flex flex-col gap-6 animate-pulse">
    <div className="h-16 bg-white dark:bg-zinc-800 rounded-xl" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-40 bg-white dark:bg-zinc-800 rounded-xl" />
      ))}
    </div>
  </div>
);

interface IProps {
  searchParams: Promise<SearchParams>;
}

interface SearchParams {
  page?: string;
  tagId?: string;
  authorId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export default async function DashboardPage({ searchParams }: IProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const { tagId, authorId, dateFrom, dateTo } = params;

  return (
    <Suspense fallback={<Skeleton />}>
      <Content page={page} tagId={tagId} authorId={authorId} dateFrom={dateFrom} dateTo={dateTo} />
    </Suspense>
  );
}
