"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "~/components/common/Header";
import { Footer } from "~/components/common/Footer";
import { VieShareBanner } from "~/components/common/VieShareBanner";
import { useTranslation } from "react-i18next";
import axios from "axios";
import PocketBase from 'pocketbase';
import { Code, ArrowRight, BookOpen, ChevronDown, Filter } from "lucide-react";
import { Button } from "~/components/ui/Button";
import { useSession } from "~/lib/authClient";
import PostComponent from "~/components/features/posts/Post";
import { RoadmapPostsView } from "~/components/features/posts";
import DocsView from "~/components/features/posts/DocsView";
import { Comment, Post, Category } from '~/lib/types';
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
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(searchParams.get('category') || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryChanging, setIsCategoryChanging] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<Record<string, boolean>>({});
  const [commentPages, setCommentPages] = useState<Record<string, number>>({});
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [viewMode, setViewMode] = useState<'docs'>('docs');

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

  const fetchPosts = async (pageNumber: number, categoryId = "", isNewCategory = false, currentViewMode?: 'list' | 'roadmap' | 'docs') => {
    if (isLoading) return;

    setIsLoading(true);
    if (isNewCategory) {
      setIsCategoryChanging(true);
    }

    try {
      // Use provided view mode or current view mode
      const activeViewMode = currentViewMode || viewMode;

      // Build filter params
      const params: any = {
        page: pageNumber,
        perPage: POSTS_PER_PAGE,
        // Sort by created date: newest first
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

      // Only fetch comments for visible posts (first few) to improve performance
      mappedPosts.slice(0, 3).forEach((post: Post) => {
        fetchCommentsForPost(post.id);
      });

    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
      if (isNewCategory) {
        setIsCategoryChanging(false);
      }
    }
  };

  // Update URL parameters (simplified for docs-only mode)
  const updateURLParams = useCallback((newCategoryId?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', 'docs');

    if (newCategoryId !== undefined) {
      if (newCategoryId) {
        params.set('category', newCategoryId);
      } else {
        params.delete('category');
      }
    }

    const newURL = params.toString() ? `/posts?${params.toString()}` : '/posts';
    router.replace(newURL, { scroll: false });
  }, [searchParams, router]);

  // Handle category selection with smooth transition and debouncing
  const handleCategorySelect = useCallback(async (categoryId: string) => {
    if (selectedCategoryId === categoryId || isCategoryChanging) return;

    // Update states in batch to avoid multiple re-renders
    setSelectedCategoryId(categoryId);
    setPage(1);
    setHasMore(true);

    // Update URL parameters
    updateURLParams(categoryId);

    // Start loading new posts immediately without clearing existing ones
    await fetchPosts(1, categoryId, true);
  }, [selectedCategoryId, isCategoryChanging, updateURLParams, viewMode]);

  // Clear category filter with smooth transition and debouncing
  const handleClearCategory = useCallback(async () => {
    if (!selectedCategoryId || isCategoryChanging) return;

    // Update states in batch
    setSelectedCategoryId("");
    setPage(1);
    setHasMore(true);

    // Update URL parameters
    updateURLParams("");

    // Start loading all posts without clearing existing ones
    await fetchPosts(1, "", true);
  }, [selectedCategoryId, isCategoryChanging, updateURLParams, viewMode]);


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

    // Load posts with category from URL if present
    const categoryFromURL = searchParams.get('category');
    if (categoryFromURL) {
      fetchPosts(1, categoryFromURL);
    } else {
      fetchPosts(1);
    }

    // Set available languages
    setAvailableLanguages(getSupportedLanguageCodes());

    // Detect screen size for mobile responsiveness
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarVisible(true);
        setShowMobileCategories(false); // Close mobile dropdown on large screens
      } else {
        setSidebarVisible(false);
      }
    };

    // Close mobile categories dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showMobileCategories && !target.closest('.mobile-categories-container')) {
        setShowMobileCategories(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileCategories]);

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
    <div className="min-h-screen bg-background">
      <Header />
      <VieShareBanner />

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex flex-col">

          {/* Main Content */}
          <main className="w-full">

            {/* Header Section */}
            <div className="mb-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  Documentation Center
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Comprehensive guides, tutorials, and resources to help you make the most of VieVlog platform.
                  Explore our learning materials organized by topic.
                </p>
              </div>
            </div>

            {/* Documentation Content */}
            <div className="relative">
              <DocsView />
            </div>

          </main>

        </div>
      </div>
      <Footer />
    </div>
  );
}