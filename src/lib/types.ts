export type Message = {
  id: string;
  content: string; 
  sender: string;
  roomId: string;
  timestamp: number;
}



export type Room = {
  id: string;
  name: string;
}

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

}


export type Post = {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
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
  expand?: {
      author?: {
        avatar: string;
        name: string;
      };
  };
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

export type Video = {
  id: string;
  title: string;
  description?: string;
  author?: string;
  video_url: string;
  thumbnail_url?: string;
  thumbnail?: string;
  tags?: string;
  views?: number;
  likes?: number;
  duration?: string;
  created: string;
}




export type TopContributor = {
    name: string;
    avatar: string;
    points: number;
    badge: string;
}

export type PopularCourse = {
    title: string;
    rating: number;
    students: number;
    image: string;
}

export type Announcement = {
    title: string;
    date: string;
    excerpt: string;
}

export type Event = {
    title: string;
    date: string;
    type: string;
}

export type RightSidebarProps = {
    topContributors: TopContributor[];
    popularCourses: PopularCourse[];
    recentAnnouncements: Announcement[];
    upcomingEvents: Event[];
}