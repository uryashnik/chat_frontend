import { Suspense } from 'react';
import FilterPanel from './filter-panel';
import Messages from './messages';
import Pagination from './navigation';
import { getTags, getUsers, getMessages } from '../actions';

interface IProps {
  page: number;
  tagId?: string;
  authorId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export default async function Content({ page, tagId, authorId, dateFrom, dateTo }: IProps) {
  const [tags, users, messagesData] = await Promise.all([
    getTags(),
    getUsers(),
    getMessages(page, tagId, authorId, dateFrom, dateTo),
  ]);

  const totalPages = messagesData.meta?.totalPages ?? 1;

  return (
    <div className="flex flex-col gap-6">
      <Suspense>
        <FilterPanel tags={tags} users={users} />
      </Suspense>

      <Messages messages={messagesData.data} tags={tags} />

      <Suspense>
        <Pagination currentPage={page} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
