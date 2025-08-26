import type React from 'react';

// Export common types
export * from './types/common';


export type Comment = {
  id: string;
  postId: string;
  userId?: string;
  userName: string;
  userAvatar?: string;
  content: string;
  created: string;
}

export type BasicUser = {
  id: string;
  email: string;
  username: string;
  image?: string | null;
  created: Date;
  updated: Date;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
  postCount?: number;
  mainName?: string; // "Languages", "DSA", "Frameworks", or "Soft Skills"
}

export type Post = {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  code?: string;
  publishedAt: string;
  coverImage?: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  commentCount: number;
  tags: string[];
  comments?: Comment[];
  categoryId?: string;
  category?: Category;
  created?: string;
  status?: number; // 0 = hidden, 1 = published
  expand?: {
      author?: {
        avatar: string;
        name: string;
      };
  };
  originalData?: any;
}

export type PopularTopic = {
  id?: string; 
  icon: React.ReactNode;
  title: string;
  count: number;
  color: string;
}

export type Resource = {
  icon: React.ReactNode;
  title: string;
  description: string;
  url: string;
}

export type TrendingTech = {
  name: string;
  growthPercentage: number;
  description: string;
}





