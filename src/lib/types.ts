import type React from 'react';

// Export common types
export * from './types/common';



export type BasicUser = {
  id: string;
  email: string;
  username: string;
  image?: string | null;
  created: Date;
  updated: Date;
  status?: boolean; // Premium account status: true = premium, false/null = free
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
  mainName?: string; // "Languages", "DSA", "Frameworks", "Interview", or "Soft Skills"
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






