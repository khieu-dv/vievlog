"use client";

import { useEffect, useState, useRef } from "react";
import { Header } from "~/ui/components/header";
import { Footer } from "~/ui/components/footer";
import { useTranslation } from "react-i18next";
import axios from "axios";
import PocketBase from 'pocketbase';
import { Code } from "lucide-react";
import { useSession } from "../../lib/auth-client";
import PostComponent from "../components/PostComponent";
import { Comment, Post, Category } from '../../lib/types';
import { LeftSidebar } from "../components/LeftSidebar";
import { RightSidebar } from "../components/RightSidebar";
import { useLocalizedContent } from "../../utils/multilingual";

// Import dữ liệu hard-coded từ file riêng biệt
import {
  trendingTechnologies,
  topContributors,
  popularCourses,
  recentAnnouncements,
  upcomingEvents,
  POSTS_PER_PAGE,
  COMMENTS_PER_PAGE,
  DEFAULT_AVATAR,
  DEFAULT_CATEGORY_COLOR
} from "../../constants/mockData";

export default function PostsPage() {
  const { t, i18n } = useTranslation();
  const { getContent, currentLanguage } = useLocalizedContent();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://pocketbase.vietopik.com');

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [submittingComment, setSubmittingComment] = useState<{ [key: string]: boolean }>({});
  const [commentPages, setCommentPages] = useState<{ [key: string]: number }>({});
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // Fetch categories from database
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/collections/categories_tbl/records`,
        {
          params: {
            page: 1,
            perPage: 50,
            sort: 'name'
          }
        }
      );

      const categoriesData = response.data.items.map((item: any) => ({
        id: item.id,
        name: getContent(item, 'name'), // Use localized name
        slug: item.slug,
        color: item.color || DEFAULT_CATEGORY_COLOR,
        description: getContent(item, 'description'), // Use localized description
        postCount: 0, // Will be updated when we get post counts
        // Keep original data for reference
        originalData: item
      }));

      // Get post counts for each category
      const categoriesWithCounts = await Promise.all(
        categoriesData.map(async (category: Category) => {
          try {
            const countResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/collections/posts_tbl/records`,
              {
                params: {
                  page: 1,
                  perPage: 1,
                  filter: `categoryId="${category.id}"`
                }
              }
            );
            return {
              ...category,
              postCount: countResponse.data.totalItems || 0
            };
          } catch (error) {
            return {
              ...category,
              postCount: 0
            };
          }
        })
      );

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      // Fallback to empty array if fetch fails
      setCategories([]);
    }
  };

  const fetchPosts = async (pageNumber: number, categoryId: string = "") => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Build filter params
      let params: any = {
        page: pageNumber,
        perPage: POSTS_PER_PAGE,
        sort: '-created',
        expand: 'categoryId'
      };

      // Add category filter if selected
      if (categoryId) {
        params.filter = `categoryId="${categoryId}"`;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/collections/posts_tbl/records`,
        { params }
      );

      const result = response.data;

      const mappedPosts = result.items.map((item: any) => ({
        id: item.id,
        title: getContent(item, 'title'), // Use localized title
        excerpt: getContent(item, 'excerpt'), // Use localized excerpt
        content: getContent(item, 'content'), // Use localized content
        publishedAt: item.created || item.publishedAt,
        coverImage: item.coverImage || "",
        author: {
          name: item.author?.name || "Anonymous",
          avatar: item.author?.avatar || DEFAULT_AVATAR,
        },
        likes: item.likes || 0,
        commentCount: item.commentCount || 0,
        tags: item.tags || [],
        comments: [],
        categoryId: item.categoryId || "",
        category: item.expand?.category ? {
          id: item.expand.category.id,
          name: getContent(item.expand.category, 'name'), // Use localized category name
          slug: item.expand.category.slug,
          color: item.expand.category.color || DEFAULT_CATEGORY_COLOR
        } : undefined,
        // Keep original data for reference
        originalData: item
      }));

      if (pageNumber === 1) {
        setPosts(mappedPosts);
      } else {
        setPosts(prevPosts => [...prevPosts, ...mappedPosts]);
      }

      setHasMore(mappedPosts.length === POSTS_PER_PAGE);

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

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setPage(1);
    setPosts([]);
    setHasMore(true);
    fetchPosts(1, categoryId);
  };

  // Clear category filter
  const handleClearCategory = () => {
    setSelectedCategoryId("");
    setPage(1);
    setPosts([]);
    setHasMore(true);
    fetchPosts(1);
  };

  // Fetch comments for post with pagination support
  const fetchCommentsForPost = async (postId: string, reset: boolean = false) => {
    try {
      const currentPage = reset ? 1 : (commentPages[postId] || 1);

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections/comments_tbl/records`, {
        params: {
          page: currentPage,
          perPage: COMMENTS_PER_PAGE,
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
        userName: session.user.username || "User",
        userAvatar: session.user.image || DEFAULT_AVATAR,
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
    fetchCategories();
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

  // Re-fetch data when language changes
  useEffect(() => {
    fetchCategories();
    fetchPosts(1, selectedCategoryId);
  }, [currentLanguage]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, selectedCategoryId);
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

  // Convert categories to popularTopics format that LeftSidebar expects
  const popularTopics = categories.map(category => ({
    icon: <Code size={16} />,
    title: category.name, // Already localized
    count: category.postCount || 0,
    color: category.color,
    id: category.id
  }));

  // Get selected category name for display
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Mobile sidebar toggle buttons (visible only on small screens) */}
      <div className="fixed bottom-4 right-4 z-50 flex space-x-3 lg:hidden">
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
          {/* Left Sidebar Component */}
          <LeftSidebar
            sidebarVisible={sidebarVisible}
            toggleSidebar={toggleSidebar}
            popularTopics={popularTopics}
            trendingTechnologies={trendingTechnologies}
            onCategorySelect={handleCategorySelect}
            selectedCategoryId={selectedCategoryId}
          />

          {/* Main content */}
          <main className="w-full lg:w-1/2 px-0 lg:px-4">
            {/* Page Header with Category Filter */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">
                  {selectedCategory ? selectedCategory.name : t("IT Language Learning")}
                </h1>
                {selectedCategoryId && (
                  <button
                    onClick={handleClearCategory}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    {t("Clear Filter")}
                  </button>
                )}
              </div>
              <p className="mt-2 text-gray-600">
                {selectedCategory
                  ? t("Posts in {{categoryName}} category", { categoryName: selectedCategory.name })
                  : t("Explore our latest articles, tips and techniques for mastering IT")
                }
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
                <p className="text-lg text-gray-600">
                  {selectedCategory
                    ? t("No posts found in {{categoryName}} category.", { categoryName: selectedCategory.name })
                    : t("No posts found.")
                  }
                </p>
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
                  {isLoading ? t('Loading...') : t('See More Posts')}
                </button>
              </div>
            )}
          </main>

          {/* Right Sidebar Component */}
          <RightSidebar
            topContributors={topContributors}
            popularCourses={popularCourses}
            recentAnnouncements={recentAnnouncements}
            upcomingEvents={upcomingEvents}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}