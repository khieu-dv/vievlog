// mockData.ts - File chứa tất cả dữ liệu hard-coded

import { Code } from "lucide-react";

export const trendingTechnologies = [
  { name: "TypeScript", growthPercentage: 28, description: "Strongly typed JavaScript" },
  { name: "Next.js", growthPercentage: 35, description: "React framework for production" },
  { name: "Tailwind CSS", growthPercentage: 42, description: "Utility-first CSS framework" },
  { name: "Docker", growthPercentage: 21, description: "Container platform" },
  { name: "Kubernetes", growthPercentage: 18, description: "Container orchestration" }
];

export const topContributors = [
  { name: "Jane Smith", avatar: "/avatars/jane.avif", points: 1453, badge: "Expert" },
  { name: "Alex Johnson", avatar: "/avatars/alex.avif", points: 1287, badge: "Mentor" },
  { name: "Sam Wilson", avatar: "/avatars/sam.avif", points: 1142, badge: "Specialist" },
  { name: "Taylor Kim", avatar: "/avatars/taylor.avif", points: 978, badge: "Contributor" }
];

export const popularCourses = [
  {
    title: "Modern JavaScript from Scratch",
    rating: 4.8,
    students: 5240,
    image: "/courses/javascript.png"
  },
  {
    title: "React & Next.js for Production",
    rating: 4.9,
    students: 4870,
    image: "/courses/react.png"
  },
  {
    title: "Full Stack Development Bootcamp",
    rating: 4.7,
    students: 3650,
    image: "/courses/fullstack.jpeg"
  }
];

export const recentAnnouncements = [
  {
    title: "New Python Course Released",
    date: "May 13, 2025",
    excerpt: "Learn Python 3.12 with our latest comprehensive course."
  },
  {
    title: "Community Hackathon",
    date: "May 10, 2025",
    excerpt: "Join us for a weekend of coding and collaboration."
  },
  {
    title: "Platform Updates",
    date: "May 5, 2025",
    excerpt: "We've improved the code editor and added new features."
  }
];

export const upcomingEvents = [
  { title: "TypeScript Workshop", date: "May 25, 2025", type: "Workshop" },
  { title: "React Conference 2025", date: "June 12-15, 2025", type: "Conference" },
  { title: "Web Performance Summit", date: "July 8, 2025", type: "Summit" }
];

// Configuration constants
export const POSTS_PER_PAGE = 20;
export const COMMENTS_PER_PAGE = 5;

// Default values
export const DEFAULT_AVATAR = "/default-avatar.png";
export const DEFAULT_CATEGORY_COLOR = "#3B82F6";