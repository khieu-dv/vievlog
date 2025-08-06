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

