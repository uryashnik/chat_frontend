import { Suspense } from 'react';
import FilterPanel from './filter-panel';
import MessagesList from './messages-list';
import Pagination from './navigation';
import { getTags, getMessages } from '../actions';

interface IProps {
  page: number;
  tagId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export default async function Content({ page, tagId, dateFrom, dateTo }: IProps) {
  const [tags, messagesData] = await Promise.all([
    getTags(),
    getMessages(page, tagId, dateFrom, dateTo),
  ]);

  const totalPages = messagesData.meta?.totalPages ?? 1;

  return (
    <div className="flex flex-col gap-6">
      <Suspense>
        <FilterPanel tags={tags} />
      </Suspense>

      <MessagesList messages={messagesData.data} tags={tags} />

      <Suspense>
        <Pagination currentPage={page} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
