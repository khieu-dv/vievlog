"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Header } from "~/components/common/Header";
import { Footer } from "~/components/common/Footer";
import { VieShareBanner } from "~/components/common/VieShareBanner";
import { useTranslation } from "react-i18next";
import axios from "axios";
import PocketBase from 'pocketbase';
import { Code, ArrowRight, BookOpen, ChevronDown, Filter, List, MapPin } from "lucide-react";
import { Button } from "~/components/ui/Button";
import { useSession } from "~/lib/authClient";
import PostComponent from "~/components/features/posts/Post";
import { RoadmapPostsView } from "~/components/features/posts";
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
  const [isCategoryChanging, setIsCategoryChanging] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<Record<string, boolean>>({});
  const [commentPages, setCommentPages] = useState<Record<string, number>>({});
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'roadmap'>('list');

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

  const fetchPosts = async (pageNumber: number, categoryId = "", isNewCategory = false) => {
    if (isLoading) return;

    setIsLoading(true);
    if (isNewCategory) {
      setIsCategoryChanging(true);
    }

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

  // Handle category selection with smooth transition and debouncing
  const handleCategorySelect = useCallback(async (categoryId: string) => {
    if (selectedCategoryId === categoryId || isCategoryChanging) return;
    
    // Update states in batch to avoid multiple re-renders
    setSelectedCategoryId(categoryId);
    setPage(1);
    setHasMore(true);
    
    // Start loading new posts immediately without clearing existing ones
    await fetchPosts(1, categoryId, true);
  }, [selectedCategoryId, isCategoryChanging]);

  // Clear category filter with smooth transition and debouncing
  const handleClearCategory = useCallback(async () => {
    if (!selectedCategoryId || isCategoryChanging) return;
    
    // Update states in batch
    setSelectedCategoryId("");
    setPage(1);
    setHasMore(true);
    
    // Start loading all posts without clearing existing ones
    await fetchPosts(1, "", true);
  }, [selectedCategoryId, isCategoryChanging]);

  // Handle view mode change
  const handleViewModeChange = useCallback((newMode: 'list' | 'roadmap') => {
    setViewMode(newMode);
    
    // If switching to list view and in roadmap mode, we might want to keep the category
    // If switching to roadmap view and no category selected, user will be prompted to select one
  }, []);

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
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <aside className="w-64 hidden lg:block">
            <div className="sticky top-20 space-y-4">
              <div className="p-4 bg-card rounded-lg border">
                <h3 className="font-medium text-foreground mb-3">{t("posts.categories")}</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleClearCategory}
                    disabled={isCategoryChanging}
                    className={`block w-full text-left px-3 py-2 text-sm rounded transition-all duration-200 ${
                      !selectedCategoryId ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                    } ${isCategoryChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{t("posts.allPosts")}</span>
                      {isCategoryChanging && !selectedCategoryId && (
                        <div className="h-3 w-3 animate-spin rounded-full border border-current border-r-transparent"></div>
                      )}
                    </div>
                  </button>
                  {popularTopics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => handleCategorySelect(topic.id)}
                      disabled={isCategoryChanging}
                      className={`block w-full text-left px-3 py-2 text-sm rounded transition-all duration-200 ${
                        selectedCategoryId === topic.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                      } ${isCategoryChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{topic.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{topic.count}</span>
                          {isCategoryChanging && selectedCategoryId === topic.id && (
                            <div className="h-3 w-3 animate-spin rounded-full border border-current border-r-transparent"></div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Mobile Category Selector - Only visible on small screens */}
            <div className="lg:hidden mb-4 mobile-categories-container">
              <button
                onClick={() => setShowMobileCategories(!showMobileCategories)}
                className={`flex items-center justify-between w-full p-3 bg-card border rounded-lg hover:bg-muted/50 transition-colors ${
                  showMobileCategories ? 'border-primary/50 bg-muted/20' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="font-medium">
                    {selectedCategory ? selectedCategory.name : t("posts.allPosts")}
                  </span>
                  {selectedCategory && (
                    <span className="text-xs px-2 py-1 bg-muted rounded-full">
                      {selectedCategory.postCount || 0}
                    </span>
                  )}
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${showMobileCategories ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Mobile Categories Dropdown */}
              {showMobileCategories && (
                <div className="mt-2 p-2 bg-card border rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-200">
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    <button
                      onClick={() => {
                        handleClearCategory();
                        setShowMobileCategories(false);
                      }}
                      disabled={isCategoryChanging}
                      className={`block w-full text-left px-3 py-2 text-sm rounded transition-all duration-200 ${
                        !selectedCategoryId ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                      } ${isCategoryChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{t("posts.allPosts")}</span>
                        {isCategoryChanging && !selectedCategoryId && (
                          <div className="h-3 w-3 animate-spin rounded-full border border-current border-r-transparent"></div>
                        )}
                      </div>
                    </button>
                    {popularTopics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => {
                          handleCategorySelect(topic.id);
                          setShowMobileCategories(false);
                        }}
                        disabled={isCategoryChanging}
                        className={`block w-full text-left px-3 py-2 text-sm rounded transition-all duration-200 ${
                          selectedCategoryId === topic.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                        } ${isCategoryChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{topic.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs">{topic.count}</span>
                            {isCategoryChanging && selectedCategoryId === topic.id && (
                              <div className="h-3 w-3 animate-spin rounded-full border border-current border-r-transparent"></div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Header Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground mb-1">
                    {viewMode === 'roadmap' && !selectedCategory 
                      ? "Learning Roadmaps" 
                      : selectedCategory 
                        ? `${selectedCategory.name} Roadmap`
                        : t("posts.title")
                    }
                  </h1>
                  <p className="text-muted-foreground">
                    {viewMode === 'roadmap' && !selectedCategory
                      ? "Choose a category to start your structured learning journey"
                      : selectedCategory && viewMode === 'roadmap'
                        ? `Follow the ${selectedCategory.name} learning path step by step`
                        : selectedCategory
                          ? `${selectedCategory.name} posts and discussions`
                          : t("posts.subtitle")
                    }
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-muted rounded-lg p-1">
                    <button
                      onClick={() => handleViewModeChange('list')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-background text-foreground shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <List className="h-4 w-4" />
                      List
                    </button>
                    <button
                      onClick={() => handleViewModeChange('roadmap')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'roadmap' 
                          ? 'bg-background text-foreground shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <MapPin className="h-4 w-4" />
                      Roadmap
                    </button>
                  </div>
                  
                  {selectedCategoryId && (
                    <Button
                      onClick={handleClearCategory}
                      variant="outline"
                      size="sm"
                    >
                      {t("posts.clearFilter")}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            <div className={`relative transition-opacity duration-300 ${isCategoryChanging ? 'opacity-70' : 'opacity-100'}`}>
              {/* Category changing overlay */}
              {isCategoryChanging && posts.length > 0 && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/90 px-4 py-2 rounded-full border">
                    <div className="h-4 w-4 animate-spin rounded-full border border-current border-r-transparent"></div>
                    <span>{t("posts.loading")}</span>
                  </div>
                </div>
              )}
              
              {posts.length === 0 && isLoading ? (
                <div className={viewMode === 'list' ? 'space-y-2' : ''}>
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="bg-card rounded-md border animate-pulse">
                      <div className="flex">
                        <div className="w-10 bg-muted/30 rounded-l-md p-2">
                          <div className="space-y-1">
                            <div className="h-5 w-5 bg-muted rounded"></div>
                            <div className="h-3 w-6 bg-muted rounded"></div>
                            <div className="h-5 w-5 bg-muted rounded"></div>
                          </div>
                        </div>
                        <div className="flex-1 p-3 space-y-2">
                          <div className="h-3 bg-muted rounded w-2/3"></div>
                          <div className="h-4 bg-muted rounded w-full"></div>
                          <div className="h-3 bg-muted rounded w-3/4"></div>
                          <div className="flex gap-2">
                            <div className="h-6 w-16 bg-muted rounded"></div>
                            <div className="h-6 w-12 bg-muted rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-card rounded-lg border p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {selectedCategory ? t("posts.noPostsInCategory") : t("posts.noPostsFound")}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {selectedCategory
                      ? t("posts.tryOtherCategories")
                      : t("posts.beFirstToShare")
                    }
                  </p>
                  <Button variant="outline">
                    {t("posts.exploreAllPosts")}
                  </Button>
                </div>
              ) : viewMode === 'roadmap' ? (
                <RoadmapPostsView
                  posts={posts}
                  session={session}
                  formatRelativeTime={formatRelativeTime}
                  selectedCategoryId={selectedCategoryId}
                  categories={categories}
                  onCategorySelect={handleCategorySelect}
                />
              ) : (
                <div className="space-y-2">
                  {posts.map((post) => (
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
                  ))}
                </div>
              )}
            </div>

            {/* Load More Button - Only show in list view */}
            {hasMore && posts.length > 0 && viewMode === 'list' && (
              <div className="mt-6 text-center" ref={loadMoreRef}>
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      {t("posts.loading")}
                    </>
                  ) : (
                    t("posts.loadMore")
                  )}
                </Button>
              </div>
            )}
          </main>

        </div>
      </div>
      <Footer />
    </div>
  );
}