export interface Tag {
  id: number;
  label: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface MessageAuthor {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
}

export interface Message {
  id: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  author: MessageAuthor;
  tag: Tag;
}

export interface MessagesMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MessagesResponse {
  data: Message[];
  meta: MessagesMeta;
}
