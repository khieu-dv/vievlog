// lib/types.ts
export interface Message {
    id: string;
    content: string; // Đảm bảo trường này khớp với 'content' trong các chỗ khác
    sender: string;
    roomId: string;
    timestamp: number;
  }
  
  // Thêm interface cho Server IO
  export interface NextApiResponseServerIO extends Response {
    socket: {
      server: any;
    };
  }
  
  export interface User {
    id: string;
    name: string;
  }
  
  export interface Room {
    id: string;
    name: string;
  }


  // app/types/index.ts

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  created: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  coverImage: string;
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
}

export interface PopularTopic {
  icon: React.ReactNode;
  title: string;
  count: number;
  color: string;
}

export interface Resource {
  icon: React.ReactNode;
  title: string;
  description: string;
  url: string;
}

export interface TrendingTech {
  name: string;
  growthPercentage: number;
  description: string;
}

export interface UpcomingEvent {
  title: string;
  date: string;
  type: string;
}