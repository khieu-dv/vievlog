// Updated PostsPage.jsx with components
"use client";

import { useEffect, useState, useRef } from "react";
import { Header } from "~/ui/components/header";
import { Footer } from "~/ui/components/footer";
import { useTranslation } from "react-i18next";
import axios from "axios";
import PocketBase from 'pocketbase';
import { Code, Book, Server, Monitor, Cpu, Database, GitBranch, Coffee, FileCode } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "../../lib/auth-client";
import PostComponent from "../components/PostComponent";
import { Comment, Category, Post, PopularTopic, Resource, TrendingTech } from '../../lib/types';

export default function PostsPage() {
  const { t } = useTranslation();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://pocketbase.vietopik.com');

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [submittingComment, setSubmittingComment] = useState<{ [key: string]: boolean }>({});
  const postsPerPage = 20;
  const [commentPages, setCommentPages] = useState<{ [key: string]: number }>({});
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // Sample data for the sidebars
  const popularTopics: PopularTopic[] = [
    { icon: <Code size={16} />, title: "JavaScript", count: 157, color: "#F7DF1E" },
    { icon: <Server size={16} />, title: "Node.js", count: 124, color: "#68A063" },
    { icon: <Monitor size={16} />, title: "React", count: 109, color: "#61DAFB" },
    { icon: <Database size={16} />, title: "SQL", count: 87, color: "#00758F" },
    { icon: <Cpu size={16} />, title: "Python", count: 76, color: "#3776AB" },
    { icon: <GitBranch size={16} />, title: "Git", count: 62, color: "#F05032" },
  ];

  const learningResources: Resource[] = [
    {
      icon: <Book size={18} />,
      title: "Free Online Courses",
      description: "Start learning today with our collection of free courses",
      url: "/resources/courses"
    },
    {
      icon: <FileCode size={18} />,
      title: "Code Challenges",
      description: "Practice your skills with interactive exercises",
      url: "/resources/challenges"
    },
    {
      icon: <Coffee size={18} />,
      title: "Developer Meetups",
      description: "Connect with local developers in your area",
      url: "/events/meetups"
    },
    {
      icon: <Coffee size={18} />,
      title: "Quick Tips",
      description: "Short, actionable development tips for busy coders",
      url: "/resources/tips"
    }
  ];

  const trendingTechnologies: TrendingTech[] = [
    { name: "TypeScript", growthPercentage: 28, description: "Strongly typed JavaScript" },
    { name: "Next.js", growthPercentage: 35, description: "React framework for production" },
    { name: "Tailwind CSS", growthPercentage: 42, description: "Utility-first CSS framework" },
    { name: "Docker", growthPercentage: 21, description: "Container platform" },
    { name: "Kubernetes", growthPercentage: 18, description: "Container orchestration" }
  ];

  const upcomingEvents = [
    { title: "TypeScript Workshop", date: "May 25, 2025", type: "Workshop" },
    { title: "React Conference 2025", date: "June 12-15, 2025", type: "Conference" },
    { title: "Web Performance Summit", date: "July 8, 2025", type: "Summit" }
  ];

  const fetchPosts = async (pageNumber: number, categoryId: string = "") => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Build filter params
      let params: any = {
        page: pageNumber,
        perPage: postsPerPage,
        sort: '-publishedAt',
        //expand: 'category'
      };

      // Add category filter if selected
      if (categoryId) {
        params.filter = `categoryId="${categoryId}"`;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/collections/posts_tbl/records`,
        // { params }
      );

      const result = response.data;

      const mappedPosts = result.items.map((item: any) => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt,
        publishedAt: item.created || item.publishedAt,
        coverImage: item.coverImage || "",
        author: {
          name: item.author?.name || "Anonymous",
          avatar: item.author?.avatar || "/default-avatar.png",
        },
        likes: item.likes || 0,
        commentCount: item.commentCount || 0,
        tags: item.tags || [],
        comments: [],
        categoryId: item.categoryId || "",
        category: item.expand?.category ? {
          id: item.expand.category.id,
          name: item.expand.category.name,
          slug: item.expand.category.slug,
          color: item.expand.category.color || "#3B82F6"
        } : undefined
      }));

      if (pageNumber === 1) {
        setPosts(mappedPosts);
      } else {
        setPosts(prevPosts => [...prevPosts, ...mappedPosts]);
      }

      setHasMore(mappedPosts.length === postsPerPage);

      // Fetch comments for each post
      mappedPosts.forEach((post: Post) => {
        fetchCommentsForPost(post.id);
      });

    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch comments for post with pagination support
  const fetchCommentsForPost = async (postId: string, reset: boolean = false) => {
    try {
      const currentPage = reset ? 1 : (commentPages[postId] || 1);

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections/comments_tbl/records`, {
        params: {
          page: currentPage,
          perPage: 5,
          filter: `postId="${postId}"`,
          sort: '-created'
        }
      });

      // Update comment page for this post
      setCommentPages(prev => ({
        ...prev,
        [postId]: currentPage + 1
      }));

      // Update comments for post
      setPosts(prevPosts => {
        return prevPosts.map(post => {
          if (post.id === postId) {
            // If reset or first page, replace comments
            // Otherwise, add new comments to existing list
            const updatedComments = currentPage === 1 || reset
              ? response.data.items.map(mapCommentFromApi)
              : [...(post.comments || []), ...response.data.items.map(mapCommentFromApi)];

            return {
              ...post,
              comments: updatedComments,
              commentCount: response.data.totalItems
            };
          }
          return post;
        });
      });
    } catch (error) {
      console.error(`Failed to fetch comments for post ${postId}:`, error);
    }
  };

  // Helper function to map API comment data
  const mapCommentFromApi = (item: any): Comment => ({
    id: item.id,
    postId: item.postId,
    userId: item.userId,
    userName: item.userName,
    userAvatar: item.userAvatar,
    content: item.content,
    created: item.created,
  });

  const handleCommentInputChange = (postId: string, value: string) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  const handleSubmitComment = async (postId: string) => {
    const content = commentInputs[postId];
    if (!content?.trim() || submittingComment[postId]) return;

    // Check if user is logged in
    if (!session?.user) {
      alert("Please log in to comment.");
      return;
    }

    setSubmittingComment(prev => ({
      ...prev,
      [postId]: true
    }));

    try {
      const commentData = {
        postId: postId,
        userId: session.user.id,
        userName: session.user.name || "User",
        userAvatar: session.user.image || "/default-avatar.png",
        content: content,
        lessonId: "" // Leave empty if not applicable
      };

      const record = await pb.collection('comments_tbl').create(commentData);

      // Clear input
      setCommentInputs(prev => ({
        ...prev,
        [postId]: ""
      }));

      // Refresh comments for this post
      fetchCommentsForPost(postId, true);

      // Update comment count
      setPosts(prevPosts => {
        return prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              commentCount: (post.commentCount || 0) + 1
            };
          }
          return post;
        });
      });
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmittingComment(prev => ({
        ...prev,
        [postId]: false
      }));
    }
  };

  // Toggle sidebar visibility for mobile
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    fetchPosts(1);

    // Detect screen size for mobile responsiveness
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarVisible(true);
      } else {
        setSidebarVisible(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (date: string | number | Date): string => {
    const dateObj = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;

    return dateObj.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Mobile sidebar toggle button (visible only on small screens) */}
      <div className="fixed bottom-4 right-4 z-50 lg:hidden">
        <button
          onClick={toggleSidebar}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
        >
          <Code size={24} />
        </button>
      </div>

      {/* Main content with sidebars */}
      <div className="container mx-auto px-4 pt-16 pb-10">
        <div className="flex flex-col lg:flex-row">
          {/* Left Sidebar - Only visible on lg screens and above by default */}
          <aside className={`lg:w-1/4 xl:w-1/5 pr-0 lg:pr-4 ${sidebarVisible ? 'fixed inset-0 z-40 bg-white p-4 overflow-y-auto lg:static lg:inset-auto lg:p-0 lg:bg-transparent' : 'hidden lg:block'}`}>
            {/* Close button for mobile sidebar */}
            {sidebarVisible && (
              <div className="flex justify-end lg:hidden">
                <button
                  onClick={toggleSidebar}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Popular Programming Topics */}
            <div className="mb-6 rounded-lg bg-white p-4 shadow">
              <h3 className="mb-3 border-b border-gray-200 pb-2 text-lg font-semibold">Popular Topics</h3>
              <ul className="space-y-2">
                {popularTopics.map((topic, index) => (
                  <li key={index}>
                    <a
                      // href={`/topics/${topic.title.toLowerCase()}`}
                      className="flex items-center justify-between rounded-md p-2 hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <div
                          className="mr-3 flex h-8 w-8 items-center justify-center rounded-md"
                          style={{ backgroundColor: `${topic.color}20`, color: topic.color }}
                        >
                          {topic.icon}
                        </div>
                        <span className="font-medium">{topic.title}</span>
                      </div>
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">{topic.count}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <button className="mt-3 w-full rounded-md bg-gray-100 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                View All Topics
              </button>
            </div>

            {/* Trending Technologies */}
            <div className="mb-6 rounded-lg bg-white p-4 shadow">
              <h3 className="mb-3 border-b border-gray-200 pb-2 text-lg font-semibold">Trending Technologies</h3>
              <ul className="space-y-3">
                {trendingTechnologies.map((tech, index) => (
                  <li key={index} className="rounded-md p-2 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{tech.name}</span>
                      <span className="text-green-500">+{tech.growthPercentage}%</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{tech.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main content */}
          <main className="w-full lg:w-1/2 px-0 lg:px-4">
            {/* Page Header with Category Filter */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">IT Language Learning</h1>
              </div>
              <p className="mt-2 text-gray-600">
                Explore our latest articles, tips and techniques for mastering IT
              </p>
            </div>

            {/* Posts Feed */}
            {posts.length === 0 && isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="mb-4 rounded-lg bg-white p-4 shadow">
                  <div className="flex items-center">
                    <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
                    <div className="ml-3">
                      <div className="h-4 w-40 animate-pulse rounded bg-gray-200"></div>
                      <div className="mt-1 h-3 w-24 animate-pulse rounded bg-gray-200"></div>
                    </div>
                  </div>
                  <div className="mt-4 h-4 w-full animate-pulse rounded bg-gray-200"></div>
                  <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                  <div className="mt-4 h-64 w-full animate-pulse rounded bg-gray-200"></div>
                </div>
              ))
            ) : posts.length === 0 ? (
              <div className="rounded-lg bg-white p-8 text-center shadow">
                <p className="text-lg text-gray-600">No posts found in this category.</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostComponent
                  key={post.id}
                  post={post}
                  session={session}
                  formatRelativeTime={formatRelativeTime}
                  commentInputs={commentInputs}
                  handleCommentInputChange={handleCommentInputChange}
                  handleSubmitComment={handleSubmitComment}
                  submittingComment={submittingComment[post.id] ?? false}
                  fetchCommentsForPost={fetchCommentsForPost}
                />
              ))
            )}

            {/* Load More Button */}
            {hasMore && posts.length > 0 && (
              <div className="mt-4 text-center" ref={loadMoreRef}>
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="rounded-md bg-white px-6 py-2.5 text-sm font-medium text-blue-600 shadow hover:bg-gray-50 disabled:opacity-70"
                >
                  {isLoading ? 'Loading...' : 'See More Posts'}
                </button>
              </div>
            )}
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
}