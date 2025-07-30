"use client";

import { useEffect, useState, useRef } from "react";
import { Header } from "~/components/common/Header";
import { Footer } from "~/components/common/Footer";
import { useTranslation } from "react-i18next";
import axios from "axios";
import PocketBase from 'pocketbase';
import { Code, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "~/components/ui/Button";
import { useSession } from "../../lib/authClient";
import PostComponent from "~/components/features/posts/Post";
import { Comment, Post, Category } from '../../lib/types';
import { Sidebar } from "~/components/common/Sidebar";
import { ActivitySidebar } from "~/components/common/ActivitySidebar";
import {
  useLocalizedContent,
  getSupportedLanguageCodes
} from "~/lib/multilingual";

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
} from "../../constants/MOCK_DATA";

export default function PostsPage() {
  const { t, i18n } = useTranslation();
  const {
    getContent,
    currentLanguage,
    getSupportedLanguages,
    getCurrentLanguageInfo,
    isLanguageSupported: checkLanguageSupport
  } = useLocalizedContent();

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://pocketbase.vietopik.com');

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<Record<string, boolean>>({});
  const [commentPages, setCommentPages] = useState<Record<string, number>>({});
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

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

  const fetchPosts = async (pageNumber: number, categoryId = "") => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Build filter params
      const params: any = {
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
        category: item.expand?.categoryId ? {
          id: item.expand.categoryId.id,
          name: getContent(item.expand.categoryId, 'name'), // Use localized category name
          slug: item.expand.categoryId.slug,
          color: item.expand.categoryId.color || DEFAULT_CATEGORY_COLOR
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
  const fetchCommentsForPost = async (postId: string, reset = false) => {
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

  // Get language statistics
  const getLanguageStats = () => {
    const stats = {
      currentLanguage: getCurrentLanguageInfo(),
      totalLanguages: getSupportedLanguages().length,
      isCurrentLanguageSupported: checkLanguageSupport(currentLanguage)
    };
    return stats;
  };

  useEffect(() => {
    fetchCategories();
    fetchPosts(1);

    // Set available languages
    setAvailableLanguages(getSupportedLanguageCodes());

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

  // Get language stats for debugging/info
  const languageStats = getLanguageStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <Header />

      {/* Mobile sidebar toggle */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <button
          onClick={toggleSidebar}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <Code size={24} />
        </button>
      </div>

      {/* Main Layout */}
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <Sidebar
            sidebarVisible={sidebarVisible}
            toggleSidebar={toggleSidebar}
            popularTopics={popularTopics}
            trendingTechnologies={trendingTechnologies}
            onCategorySelect={handleCategorySelect}
            selectedCategoryId={selectedCategoryId}
          />

          {/* Main Content */}
          <main className="flex-1 lg:max-w-3xl">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedCategory ? selectedCategory.name : "IT Learning Hub"}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {selectedCategory
                      ? `Exploring ${selectedCategory.name} topics and tutorials`
                      : "Discover the latest in IT education and programming"
                    }
                  </p>
                </div>
                {selectedCategoryId && (
                  <Button
                    onClick={handleClearCategory}
                    variant="outline"
                    className="shrink-0"
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{languageStats.totalLanguages}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Languages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.length === 0 && isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      <div className="ml-3 space-y-2">
                        <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                        <div className="h-2 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-40 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                  </div>
                ))
              ) : posts.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="mx-auto w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                    <BookOpen className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {selectedCategory ? `No posts in ${selectedCategory.name}` : "No posts found"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                    {selectedCategory
                      ? "Try exploring other categories or check back later for new content."
                      : "Be the first to share your knowledge with the community!"
                    }
                  </p>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Explore All Posts
                  </Button>
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
            </div>

            {/* Load More Button */}
            {hasMore && posts.length > 0 && (
              <div className="mt-8 text-center" ref={loadMoreRef}>
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More Posts
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </main>

          {/* Right Sidebar Component */}
          <ActivitySidebar
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