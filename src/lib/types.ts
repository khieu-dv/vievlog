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
  userId?: string;
  userName: string;
  userAvatar?: string;
  content: string;
  created: string;
}

export interface Video {
id: string;
    title: string;
    description: string;
    author: string;
    video_url: string;
    thumbnail_url: string;
    tags: string;
    views: number;
    likes: number;
}



export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
  postCount?: number;

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
  created: string;
  expand?: {
      author?: {
        avatar: string;
        name: string;
      };
  };
}


export interface PopularTopic {
    icon: React.ReactNode;
    title: string;
    count: number;
    color: string;
    id?: string; // Thêm field id
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

export interface Video {
  id: string;
  title: string;
  description: string;
  author: string;
  video_url: string;
  thumbnail_url: string;
  tags: string;
  views: number;
  likes: number;
}


export interface TopContributor {
    name: string;
    avatar: string;
    points: number;
    badge: string;
}

export interface PopularCourse {
    title: string;
    rating: number;
    students: number;
    image: string;
}

export interface Announcement {
    title: string;
    date: string;
    excerpt: string;
}

export interface Event {
    title: string;
    date: string;
    type: string;
}

export interface RightSidebarProps {
    topContributors: TopContributor[];
    popularCourses: PopularCourse[];
    recentAnnouncements: Announcement[];
    upcomingEvents: Event[];
}