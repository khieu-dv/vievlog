// Common types used across the application

export type SessionUser = {
  id: string;
  name?: string;
  username?: string;
  image?: string;
  email?: string;
} | null;

export type Session = {
  user: SessionUser;
} | null;

export type DateFormatter = (date: string | number | Date) => string;

export type CategoryWithCount = {
  id: string;
  name: string;
  slug: string;
  color: string;
  postCount?: number;
};

export type ApiResponse<T> = {
  items: T[];
  totalItems: number;
  page: number;
  perPage: number;
};

export type LoadingState = {
  isLoading: boolean;
  error?: string | null;
};