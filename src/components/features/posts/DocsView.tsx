import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronRight, Search, X, Home, BookOpen, Menu, ArrowLeft, ArrowRight, MessageCircle, Code, FileText, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams } from 'next/navigation';
import { MarkdownRenderer } from '~/components/common/MarkdownRenderer';
import JSCodeEditor from '~/components/common/JSCodeEditor';
import { useDocsData, DocSection } from '~/lib/hooks/useDocsData';
import { getIconComponent } from '~/lib/utils/iconMapper';
import { ApiService } from '~/lib/services/api';
import { Post, Comment } from '~/lib/types';
import { useSession } from '~/lib/authClient';
import PocketBase from 'pocketbase';


interface DocsViewProps {
  className?: string;
}


const DocsView: React.FC<DocsViewProps> = ({ className }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, categoryPosts, docsData, loading } = useDocsData();

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string>('');
  const [expandedPostSections, setExpandedPostSections] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDocsData, setFilteredDocsData] = useState<DocSection[]>([]);
  const [showAllPosts, setShowAllPosts] = useState<Record<string, boolean>>({});
  const [loadedPosts, setLoadedPosts] = useState<Record<string, Post>>({});
  const [loadingPosts, setLoadingPosts] = useState<Set<string>>(new Set());
  const [postComments, setPostComments] = useState<Record<string, Comment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Record<string, 'content' | 'code'>>({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebarCollapsed') === 'true';
    }
    return false;
  });

  const { data: session } = useSession();
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://pocketbase.vietopik.com');

  // Update URL when viewing posts for shareable links
  const updateURL = (postId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('post', postId);
    router.replace(`/posts?${params.toString()}`, { scroll: false });
  };

  // Load comments for a post
  const loadPostComments = async (postId: string) => {
    if (postComments[postId]) {
      return; // Already loaded
    }

    try {
      const commentData = await ApiService.getComments(postId);
      const processedComments = commentData.map((item: any) => ({
        id: item.id,
        userName: item.userName || 'Anonymous',
        content: item.content || '',
        created: item.created || new Date().toISOString(),
        userAvatar: item.userAvatar || '/default-avatar.png',
        userId: item.userId || '',
        postId: item.postId || ''
      }));

      setPostComments(prev => ({
        ...prev,
        [postId]: processedComments
      }));
    } catch (error) {
      console.error('Failed to load comments:', error);
      setPostComments(prev => ({
        ...prev,
        [postId]: []
      }));
    }
  };

  // Load full post content
  const loadPostContent = async (postId: string) => {
    if (loadedPosts[postId] || loadingPosts.has(postId)) {
      return; // Already loaded or loading
    }

    setLoadingPosts(prev => new Set(prev).add(postId));

    try {
      const postData = await ApiService.getPost(postId);
      if (postData) {
        // Process the full post data with content
        const processedPost: Post = {
          id: postData.id,
          title: postData.title || '',
          excerpt: postData.excerpt || '',
          content: postData.content || '',
          code: postData.code || '',
          publishedAt: postData.created || postData.publishedAt || '',
          coverImage: postData.coverImage || '',
          author: {
            name: postData.expand?.author?.name || postData.author?.name || 'Anonymous',
            avatar: postData.expand?.author?.avatar || postData.author?.avatar || '/default-avatar.png',
          },
          likes: postData.likes || 0,
          commentCount: postData.commentCount || 0,
          tags: postData.tags || [],
          comments: [],
          categoryId: postData.categoryId || '',
          category: postData.expand?.categoryId ? {
            id: postData.expand.categoryId.id,
            name: postData.expand.categoryId.name,
            slug: postData.expand.categoryId.slug,
            color: postData.expand.categoryId.color || '#3B82F6'
          } : undefined,
          created: postData.created,
          expand: postData.expand,
          originalData: postData
        };

        setLoadedPosts(prev => ({
          ...prev,
          [postId]: processedPost
        }));
      }
    } catch (error) {
      console.error('Failed to load post content:', error);
    } finally {
      setLoadingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  // Handle post selection with URL update and smooth scroll
  const handlePostSelect = async (postId: string) => {
    setActiveSection(`post-${postId}`);
    updateURL(postId);

    // Load full content and comments if not already loaded
    await Promise.all([
      loadPostContent(postId),
      loadPostComments(postId)
    ]);

    // Scroll to top of main content area smoothly
    setTimeout(() => {
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      } else {
        // Fallback to window scroll if main element not found
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, 100); // Small delay to ensure content has rendered

    // Close mobile menu when post is selected
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      newSet.delete('mobile-nav');
      return newSet;
    });
  };

  // Handle touch feedback for articles with haptic-like effect
  const handleArticleTouch = useCallback((e: React.TouchEvent) => {
    // Add gentle vibration on supported devices
    if (navigator.vibrate) {
      navigator.vibrate(8);
    }
    
    // Add ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const ripple = document.createElement('div');
    const size = Math.max(rect.width, rect.height);
    const x = e.touches[0].clientX - rect.left - size / 2;
    const y = e.touches[0].clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(59, 130, 246, 0.2);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.7s linear;
      pointer-events: none;
      z-index: 1;
    `;
    
    e.currentTarget.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 700);
  }, []);

  // Handle comment submission
  const handleCommentSubmit = async (postId: string) => {
    const commentText = commentInputs[postId]?.trim();
    if (!commentText || submittingComment || !session?.user) {
      if (!session?.user) {
        alert('Please log in to comment.');
      }
      return;
    }

    setSubmittingComment(postId);

    try {
      const commentData = {
        postId: postId,
        userId: session.user.id,
        userName: session.user.username || session.user.name || 'User',
        userAvatar: session.user.image || '/default-avatar.png',
        content: commentText,
        lessonId: ''
      };

      const record = await pb.collection('comments_tbl').create(commentData);

      const newComment: Comment = {
        id: record.id,
        postId: commentData.postId,
        userName: commentData.userName,
        content: commentData.content,
        created: new Date().toISOString(),
        userAvatar: commentData.userAvatar,
        userId: commentData.userId
      };

      // Add comment to the list
      setPostComments(prev => ({
        ...prev,
        [postId]: [newComment, ...(prev[postId] || [])]
      }));

      // Clear input
      setCommentInputs(prev => ({
        ...prev,
        [postId]: ''
      }));
    } catch (error) {
      console.error('Failed to post comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setSubmittingComment(null);
    }
  };

  // Handle scroll events - simplified approach for better performance
  useEffect(() => {
    // Let CSS handle the scroll behavior naturally with overscroll-behavior
    const sidebarElements = document.querySelectorAll('[data-scroll-area="sidebar"]');
    sidebarElements.forEach((element) => {
      (element as HTMLElement).style.overscrollBehavior = 'contain';
    });

    return () => {
      // Cleanup
      sidebarElements.forEach((element) => {
        (element as HTMLElement).style.overscrollBehavior = '';
      });
    };
  }, []);

  // Save sidebar collapse state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', sidebarCollapsed.toString());
    }
  }, [sidebarCollapsed]);

  // Set initial active section when data loads
  useEffect(() => {
    if (!loading && docsData.length > 0) {
      const postIdFromURL = searchParams.get('post');
      const categoryIdFromURL = searchParams.get('category');

      if (postIdFromURL) {
        // If there's a post ID in URL, show that post
        setActiveSection(`post-${postIdFromURL}`);
        // Find which category this post belongs to and expand that section
        const allPosts = Object.values(categoryPosts).flat();
        const post = allPosts.find(p => p.id === postIdFromURL);
        if (post && post.categoryId) {
          // Preserve mobile-nav state when setting expanded sections
          setExpandedSections(prev => {
            const newSet = new Set<string>([post.categoryId!]);
            if (prev.has('mobile-nav')) {
              newSet.add('mobile-nav');
            }
            return newSet;
          });
        }
        // Auto-load the full content and comments for this post
        Promise.all([
          loadPostContent(postIdFromURL),
          loadPostComments(postIdFromURL)
        ]);
      } else if (categoryIdFromURL) {
        // If there's a category ID in URL, show that category
        const categoryExists = docsData.find(section => section.id === categoryIdFromURL);
        if (categoryExists) {
          setActiveSection(categoryIdFromURL);
          // Preserve mobile-nav state when setting expanded sections
          setExpandedSections(prev => {
            const newSet = new Set([categoryIdFromURL]);
            if (prev.has('mobile-nav')) {
              newSet.add('mobile-nav');
            }
            return newSet;
          });
        } else {
          // If category doesn't exist, fall back to overview
          setActiveSection('overview');
          setExpandedSections(prev => {
            const newSet = new Set<string>();
            if (prev.has('mobile-nav')) {
              newSet.add('mobile-nav');
            }
            return newSet;
          });
        }
      } else {
        // Default to overview if no specific selection
        setActiveSection('overview');
        setExpandedSections(prev => {
          const newSet = new Set<string>();
          if (prev.has('mobile-nav')) {
            newSet.add('mobile-nav');
          }
          return newSet;
        });
      }
    }
  }, [loading, docsData, categoryPosts, searchParams]);

  // Filter docs data based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return docsData;
    }

    const query = searchQuery.toLowerCase();
    return docsData.map(section => {
      // Filter posts within each section
      const filteredPosts = section.posts?.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.content?.toLowerCase().includes(query)
      ) || [];

      // Include section if title matches or has matching posts
      if (section.title.toLowerCase().includes(query) || filteredPosts.length > 0) {
        return {
          ...section,
          posts: filteredPosts
        };
      }
      return null;
    }).filter(Boolean) as DocSection[];
  }, [docsData, searchQuery]);

  useEffect(() => {
    setFilteredDocsData(searchResults);
  }, [searchResults]);


  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);

    if (newExpanded.has(sectionId)) {
      // If clicking on already expanded section, close it
      newExpanded.delete(sectionId);
      // Also close any expanded posts in this section
      setExpandedPostSections(prev => {
        const newPostExpanded = new Set(prev);
        newPostExpanded.delete(sectionId);
        return newPostExpanded;
      });
    } else {
      // Keep mobile-nav state when toggling categories
      const isMobileNavOpen = newExpanded.has('mobile-nav');

      // Only one category section open at a time - clear category sections
      const categoriesToClear = Array.from(newExpanded).filter(id => id !== 'mobile-nav');
      categoriesToClear.forEach(id => newExpanded.delete(id));

      // Add the new section
      newExpanded.add(sectionId);

      // Restore mobile nav state if it was open
      if (isMobileNavOpen) {
        newExpanded.add('mobile-nav');
      }

      // Close all expanded post sections when opening a new category
      setExpandedPostSections(new Set());

      // Update URL with category parameter for shareable links
      const params = new URLSearchParams(searchParams.toString());
      if (sectionId !== 'overview') {
        params.set('category', sectionId);
      } else {
        params.delete('category');
      }
      params.delete('post'); // Remove post parameter when viewing category
      router.replace(`/posts?${params.toString()}`, { scroll: false });

      // Don't close mobile sidebar when selecting category - let user choose posts
      // Mobile sidebar will only close when a post is selected
    }

    setExpandedSections(newExpanded);
  };

  const togglePostSection = (sectionId: string) => {
    const newExpanded = new Set(expandedPostSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedPostSections(newExpanded);
  };

  const findActiveContent = () => {
    const section = docsData.find(section => section.id === activeSection);
    return section?.content || '';
  };

  const findActivePosts = () => {
    const section = docsData.find(section => section.id === activeSection);
    return section?.posts || [];
  };

  // Find previous and next posts for navigation
  const findAdjacentPosts = (currentPostId: string) => {
    const allPosts = Object.values(categoryPosts).flat();
    const currentIndex = allPosts.findIndex(post => post.id === currentPostId);

    return {
      previousPost: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
      nextPost: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-gray-300 font-light">Loading documentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col lg:flex-row gap-12 transition-all duration-300 ${className}`}>
      {/* Mobile Toggle Button - Apple Style */}
      <div className="lg:hidden fixed bottom-6 left-4 z-50">
        <button
          onClick={() => {
            const newExpanded = new Set(expandedSections);
            if (newExpanded.has('mobile-nav')) {
              newExpanded.delete('mobile-nav');
            } else {
              newExpanded.clear(); // Clear all category expansions
              newExpanded.add('mobile-nav');
            }
            setExpandedSections(newExpanded);
          }}
          className="p-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-full shadow-xl hover:scale-105 transition-all duration-200"
          aria-label="Toggle Documentation Menu"
        >
          <Menu className="h-5 w-5 text-gray-900 dark:text-white" />
        </button>
      </div>

      {/* Mobile Backdrop */}
      {expandedSections.has('mobile-nav') && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setExpandedSections(prev => {
            const newSet = new Set(prev);
            newSet.delete('mobile-nav');
            return newSet;
          })}
        />
      )}

      {/* Sidebar Navigation - Apple Style */}
      <aside className={`
        flex-shrink-0 transition-all duration-300 ease-in-out
        ${expandedSections.has('mobile-nav')
          ? 'fixed left-0 top-0 bottom-0 w-4/5 z-50 lg:relative lg:z-auto transform translate-x-0'
          : 'fixed left-0 top-0 bottom-0 w-4/5 z-50 lg:relative lg:z-auto transform -translate-x-full lg:translate-x-0 lg:block'
        }
        ${sidebarCollapsed
          ? 'lg:w-0 lg:opacity-0 lg:pointer-events-none xl:w-0 xl:opacity-0 xl:pointer-events-none'
          : 'lg:w-80 xl:w-96 lg:opacity-100 lg:pointer-events-auto xl:opacity-100 xl:pointer-events-auto'
        }
      `}>
        <div className={`${expandedSections.has('mobile-nav') ? 'h-full' : 'sticky top-16'}`}>
          <div className={`bg-white/95 dark:bg-black/95 backdrop-blur-xl ${expandedSections.has('mobile-nav') ? 'rounded-none' : 'rounded-2xl'} shadow-xl flex flex-col ${expandedSections.has('mobile-nav') ? 'h-full' : ''}`} style={expandedSections.has('mobile-nav') ? {} : { height: 'calc(100vh - 6rem)' }}>
            {/* Header with Search - Apple Style */}
            <div className="p-6 flex-shrink-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Documentation
                </h2>
                {/* Close button for mobile */}
                {expandedSections.has('mobile-nav') && (
                  <button
                    onClick={() => setExpandedSections(prev => {
                      const newSet = new Set(prev);
                      newSet.delete('mobile-nav');
                      return newSet;
                    })}
                    className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Close Documentation Menu"
                  >
                    <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                )}
              </div>

              {/* Search Bar - Apple Style */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-light"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Search Results Count */}
              {searchQuery && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 font-light">
                  {filteredDocsData.length} section{filteredDocsData.length !== 1 ? 's' : ''} found
                </p>
              )}
            </div>

            {/* Navigation Content - Scrollable */}
            <div className={`p-6 flex-1 overflow-y-auto overscroll-contain scroll-smooth ${expandedSections.has('mobile-nav') ? 'pb-6' : ''}`} data-scroll-area="sidebar">

              <nav className="space-y-3">
                {/* Home/Overview always visible */}
                {!searchQuery && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveSection('overview');
                      // Update URL to remove category parameter
                      const params = new URLSearchParams(searchParams.toString());
                      params.delete('category');
                      params.delete('post');
                      router.replace(`/posts?${params.toString()}`, { scroll: false });
                      // Don't close mobile sidebar - let user see overview content first
                    }}
                    className={`flex items-center gap-4 w-full px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${activeSection === 'overview'
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                  >
                    <Home className="h-5 w-5" />
                    <span>Overview</span>
                  </button>
                )}

                {(() => {
                  const sectionsToDisplay = searchQuery ? filteredDocsData : docsData;

                  // Group sections by mainName for display
                  const groupedSections = sectionsToDisplay.reduce((acc, section) => {
                    const mainName = section.category?.mainName || 'Languages';
                    if (!acc[mainName]) {
                      acc[mainName] = [];
                    }
                    acc[mainName].push(section);
                    return acc;
                  }, {} as Record<string, typeof sectionsToDisplay>);

                  // Define the order for mainName groups
                  const mainNameOrder = ['Languages', 'DSA', 'Frameworks', 'Soft Skills'];

                  return mainNameOrder.map((mainName, mainNameIndex) => {
                    const sectionsInGroup = groupedSections[mainName] || [];
                    if (sectionsInGroup.length === 0) return null;

                    return (
                      <div key={mainName}>
                        {/* Add separator between groups (not before the first group) */}
                        {mainNameIndex > 0 && (
                          <div className="my-4">
                            <hr className="border-border/40" />
                          </div>
                        )}

                        {sectionsInGroup.map((section) => (
                          <div key={section.id} className="mb-2">
                            {/* Different layout for sections with/without posts */}
                            {section.posts && section.posts.length > 0 ? (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  // Toggle both section view and dropdown
                                  setActiveSection(section.id);
                                  toggleSection(section.id);
                                  // Don't close mobile sidebar here - let user select posts first
                                }}
                                onTouchStart={handleArticleTouch}
                                className={`flex items-center gap-4 w-full px-4 py-3 text-base font-medium rounded-xl 
                                          transition-all duration-200 justify-between touch-feedback
                                          touch-manipulation select-none relative overflow-hidden
                                          active:scale-95
                                          ${activeSection === section.id
                                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
                                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                                  }`}
                              >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  {section.iconName && getIconComponent(section.iconName)}
                                  <span className="truncate font-medium">{section.title}</span>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className="text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                                    {section.posts.length}
                                  </span>
                                  {expandedSections.has(section.id) ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </div>
                              </button>
                            ) : (
                              /* Simple button for sections without posts */
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setActiveSection(section.id);
                                  // Update URL with category parameter for shareable links
                                  const params = new URLSearchParams(searchParams.toString());
                                  if (section.id !== 'overview') {
                                    params.set('category', section.id);
                                  } else {
                                    params.delete('category');
                                  }
                                  params.delete('post'); // Remove post parameter when viewing category
                                  router.replace(`/posts?${params.toString()}`, { scroll: false });
                                  // Don't close mobile sidebar - let user see content first
                                }}
                                onTouchStart={handleArticleTouch}
                                className={`flex items-center gap-4 w-full px-4 py-3 text-base font-medium rounded-xl 
                                          transition-all duration-200 touch-feedback
                                          touch-manipulation select-none relative overflow-hidden
                                          active:scale-95
                                          ${activeSection === section.id
                                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
                                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                                  }`}
                              >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  {section.iconName && getIconComponent(section.iconName)}
                                  <span className="truncate font-medium">{section.title}</span>
                                </div>
                              </button>
                            )}

                            {/* Show posts as subsections */}
                            {expandedSections.has(section.id) && section.posts && section.posts.length > 0 && (
                              <div className="ml-3 lg:ml-6 mt-2 space-y-1">
                                {/* Show first 10 posts */}
                                {section.posts.slice(0, 10).map((post) => (
                                  <button
                                    key={post.id}
                                    onClick={() => handlePostSelect(post.id)}
                                    onTouchStart={handleArticleTouch}
                                    className={`block w-full text-left p-2.5 text-xs rounded-lg transition-all duration-200
                                              touch-manipulation select-none relative overflow-hidden
                                              active:scale-95 touch-feedback
                                              ${activeSection === `post-${post.id}`
                                        ? 'bg-accent/70 text-accent-foreground font-medium shadow-sm'
                                        : 'text-muted-foreground/80 hover:bg-accent/30 hover:text-foreground'
                                      }`}
                                  >
                                    <div className="truncate pr-2">{post.title}</div>
                                    <div className="text-xs text-muted-foreground mt-1 hidden sm:block">
                                      {new Date(post.publishedAt).toLocaleDateString()}
                                    </div>
                                  </button>
                                ))}

                                {/* Show remaining posts if expanded */}
                                {expandedPostSections.has(section.id) && section.posts.length > 10 && (
                                  <>
                                    {section.posts.slice(10, 30).map((post) => (
                                      <button
                                        key={post.id}
                                        onClick={() => handlePostSelect(post.id)}
                                        onTouchStart={handleArticleTouch}
                                        className={`block w-full text-left p-2.5 text-xs rounded-lg transition-all duration-200
                                                  touch-manipulation select-none relative overflow-hidden
                                                  active:scale-95 touch-feedback
                                                  ${activeSection === `post-${post.id}`
                                            ? 'bg-accent/70 text-accent-foreground font-medium shadow-sm'
                                            : 'text-muted-foreground/80 hover:bg-accent/30 hover:text-foreground'
                                          }`}
                                      >
                                        <div className="truncate pr-2">{post.title}</div>
                                        <div className="text-xs text-muted-foreground mt-1 hidden sm:block">
                                          {new Date(post.publishedAt).toLocaleDateString()}
                                        </div>
                                      </button>
                                    ))}
                                  </>
                                )}

                                {/* Show more/less toggle */}
                                {section.posts.length > 10 && (
                                  <button
                                    onClick={() => togglePostSection(section.id)}
                                    className="text-xs text-primary hover:text-primary/80 pl-2 py-1 transition-colors"
                                  >
                                    {expandedPostSections.has(section.id)
                                      ? `Show less`
                                      : `+${Math.min(section.posts.length - 10, 20)} more posts${section.posts.length > 30 ? ` (${section.posts.length} total)` : ''}`
                                    }
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  }).filter(Boolean);
                })()}

                {/* No results message */}
                {searchQuery && filteredDocsData.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Search className="h-12 w-12 mx-auto mb-6 opacity-30" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</p>
                    <p className="text-base font-light">Try different keywords or browse all sections</p>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar Toggle Button for Large Screens */}
      <div className={`hidden lg:block fixed top-1/2 z-40 transition-all duration-300 ${sidebarCollapsed ? 'left-4' : 'left-[calc(20rem+1rem)] xl:left-[calc(24rem+1rem)]'
        }`}>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:scale-105 transition-all duration-200"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-5 w-5 text-gray-900 dark:text-white" />
          ) : (
            <PanelLeftClose className="h-5 w-5 text-gray-900 dark:text-white" />
          )}
        </button>
      </div>

      {/* Main Content - Apple Style */}
      <main
        className={`flex-1 min-w-0 transition-all duration-300 ${expandedSections.has('mobile-nav') ? 'lg:block hidden' : 'block'} ${sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'
          }`}
        onClick={() => {
          // Close mobile sidebar when clicking on main content
          if (expandedSections.has('mobile-nav')) {
            setExpandedSections(prev => {
              const newSet = new Set(prev);
              newSet.delete('mobile-nav');
              return newSet;
            });
          }
        }}
      >
        <div className={`bg-white/95 dark:bg-black/95 backdrop-blur-xl sm:rounded-2xl sm:shadow-xl transition-all duration-300 ${sidebarCollapsed ? 'lg:max-w-none lg:mx-8' : ''
          }`}>
          {/* Content Header with Breadcrumbs - Apple style */}
          <div className="px-4 sm:px-8 py-6">
            <div className="flex items-center gap-3 text-base text-gray-500 dark:text-gray-400 mb-2">
              <Home className="h-5 w-5" />
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900 dark:text-white font-medium">
                {activeSection.startsWith('post-')
                  ? (() => {
                    const postId = activeSection.replace('post-', '');
                    const allPosts = Object.values(categoryPosts).flat();
                    const post = allPosts.find(p => p.id === postId);
                    return post?.category?.name || 'Post';
                  })()
                  : activeSection === 'overview' ? 'Overview' : docsData.find(s => s.id === activeSection)?.title || 'Posts'
                }
              </span>
              {activeSection.startsWith('post-') && (
                <>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-gray-900 dark:text-white font-medium">
                    {(() => {
                      const postId = activeSection.replace('post-', '');
                      const allPosts = Object.values(categoryPosts).flat();
                      const post = allPosts.find(p => p.id === postId);
                      return post?.title || 'Article';
                    })()}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Content Body - Full Height */}
          <div className={`p-4 sm:p-8 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900/50 dark:to-black transition-all duration-300 ${sidebarCollapsed ? 'lg:p-16 xl:p-20' : 'lg:p-12'
            }`}>
            {activeSection.startsWith('post-') ? (
              // Render individual post content
              (() => {
                const postId = activeSection.replace('post-', '');
                const allPosts = Object.values(categoryPosts).flat();
                const summaryPost = allPosts.find(p => p.id === postId);
                const fullPost = loadedPosts[postId];
                const isLoading = loadingPosts.has(postId);

                if (!summaryPost) {
                  return <div className="text-muted-foreground">Post not found.</div>;
                }

                // Use full post data if available, otherwise use summary
                const post = fullPost || summaryPost;

                return (
                  <div className="max-w-4xl">
                    {/* Article Header */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        {post.category && (
                          <div
                            className="px-4 py-2 rounded-full text-sm font-medium"
                            style={{
                              backgroundColor: `${post.category.color}15`,
                              color: post.category.color
                            }}
                          >
                            {post.category.name}
                          </div>
                        )}
                        <div className="text-sm text-muted-foreground flex items-center gap-4">
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{post.likes} likes</span>
                          <span>•</span>
                          <span>{post.commentCount} comments</span>
                        </div>
                      </div>

                      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6 leading-tight">{post.title}</h1>
                    </div>

                    {/* Article Content with Tabs */}
                    {(() => {
                      const hasCode = post.code && post.code.trim().length > 0;
                      const currentTab = activeTab[post.id] || 'content';

                      if (!hasCode) {
                        // No code - show content only (current behavior)
                        return (
                          <div className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-semibold prose-headings:tracking-tight">
                            {isLoading ? (
                              <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
                                  <p className="text-gray-600 dark:text-gray-300">Loading content...</p>
                                </div>
                              </div>
                            ) : (
                              <MarkdownRenderer content={post.content || (fullPost ? 'No content available for this post.' : 'Loading content...')} />
                            )}
                          </div>
                        );
                      }

                      // Has code - show tab system
                      return (
                        <div>
                          {/* Tab Headers */}
                          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                            <button
                              onClick={() => setActiveTab(prev => ({ ...prev, [post.id]: 'content' }))}
                              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${currentTab === 'content'
                                  ? 'border-primary text-primary bg-primary/5'
                                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                            >
                              <FileText className="h-4 w-4" />
                              Content
                            </button>
                            <button
                              onClick={() => setActiveTab(prev => ({ ...prev, [post.id]: 'code' }))}
                              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${currentTab === 'code'
                                  ? 'border-primary text-primary bg-primary/5'
                                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                            >
                              <Code className="h-4 w-4" />
                              Code Demo
                            </button>
                          </div>

                          {/* Tab Content */}
                          <div className="min-h-[400px]">
                            {currentTab === 'content' ? (
                              <div className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-semibold prose-headings:tracking-tight">
                                {isLoading ? (
                                  <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
                                      <p className="text-gray-600 dark:text-gray-300">Loading content...</p>
                                    </div>
                                  </div>
                                ) : (
                                  <MarkdownRenderer content={post.content || (fullPost ? 'No content available for this post.' : 'Loading content...')} />
                                )}
                              </div>
                            ) : (
                              <div className="h-[600px] rounded-lg overflow-hidden">
                                <JSCodeEditor
                                  initialCode={post.code}
                                  className="h-full p-0"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Article Footer */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-12 pt-8">
                        <h4 className="text-sm font-medium text-foreground mb-4">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-muted/70 text-muted-foreground text-sm rounded-full hover:bg-muted transition-colors"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Comments Section */}
                    <div className="mt-12 pt-8">
                      {(() => {
                        const postId = activeSection.replace('post-', '');
                        const comments = postComments[postId] || [];
                        const commentInput = commentInputs[postId] || '';
                        const isSubmitting = submittingComment === postId;

                        return (
                          <div className="bg-card rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                              <MessageCircle className="h-5 w-5" />
                              Discussion ({comments.length})
                            </h3>

                            {/* Comment Input */}
                            {session?.user && (
                              <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                                <div className="flex gap-3">
                                  <div className="flex-shrink-0">
                                    {session.user.image ? (
                                      <Image
                                        src={session.user.image}
                                        alt={session.user.name || 'User'}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <textarea
                                      placeholder="Share your thoughts..."
                                      className="w-full p-3 sm:rounded-md bg-background text-sm resize-vertical min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                                      value={commentInput}
                                      onChange={(e) => setCommentInputs(prev => ({
                                        ...prev,
                                        [postId]: e.target.value
                                      }))}
                                    />
                                    <div className="flex justify-end mt-3">
                                      <button
                                        onClick={() => handleCommentSubmit(postId)}
                                        disabled={isSubmitting || !commentInput.trim()}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                      >
                                        {isSubmitting ? 'Posting...' : 'Add Comment'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Comments List */}
                            <div className="space-y-4">
                              {comments.length > 0 ? (
                                comments.map((comment) => (
                                  <div key={comment.id} className="flex gap-3 p-4 bg-background sm:rounded-lg">
                                    <div className="flex-shrink-0">
                                      {comment.userAvatar && comment.userAvatar !== "/default-avatar.png" ? (
                                        <Image
                                          src={comment.userAvatar}
                                          alt={comment.userName}
                                          width={32}
                                          height={32}
                                          className="w-8 h-8 rounded-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold">
                                          {comment.userName.charAt(0).toUpperCase()}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                        <span className="font-medium text-foreground">{comment.userName}</span>
                                        <span>•</span>
                                        <span>{new Date(comment.created).toLocaleDateString()}</span>
                                      </div>
                                      <p className="text-sm text-foreground">{comment.content}</p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-8">
                                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                  <p className="text-muted-foreground">
                                    No comments yet. Be the first to share your thoughts!
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Previous/Next Post Navigation */}
                    <div className="mt-12 pt-8">
                      {(() => {
                        const postId = activeSection.replace('post-', '');
                        const { previousPost, nextPost } = findAdjacentPosts(postId);

                        if (!previousPost && !nextPost) {
                          return (
                            <button
                              onClick={() => setActiveSection(post.categoryId || 'overview')}
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                              <ChevronRight className="h-4 w-4 rotate-180" />
                              <span>Back to {post.category?.name || 'Overview'}</span>
                            </button>
                          );
                        }

                        return (
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
                            {/* Previous Post */}
                            {previousPost ? (
                              <button
                                onClick={() => handlePostSelect(previousPost.id)}
                                className="group flex items-center gap-2 px-3 py-3 rounded-lg bg-card/50 hover:bg-card transition-all duration-200 hover:shadow-sm w-full md:w-0 md:flex-1 md:min-w-0 md:max-w-[calc(50%-0.5rem)] h-14"
                              >
                                <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                                <div className="text-left min-w-0 flex-1 overflow-hidden">
                                  <div className="text-xs text-muted-foreground mb-0.5 font-medium">Bài trước</div>
                                  <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                                    {previousPost.title.length > 30 ? `${previousPost.title.substring(0, 30)}...` : previousPost.title}
                                  </div>
                                </div>
                              </button>
                            ) : (
                              <div className="w-full md:w-0 md:flex-1 md:max-w-[calc(50%-0.5rem)]">
                                <button
                                  onClick={() => setActiveSection(post.categoryId || 'overview')}
                                  className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-accent/30 h-14 w-full"
                                >
                                  <ChevronRight className="h-4 w-4 rotate-180" />
                                  <span className="hidden sm:inline">Back to {post.category?.name || 'Overview'}</span>
                                  <span className="sm:hidden">Back</span>
                                </button>
                              </div>
                            )}

                            {/* Next Post */}
                            {nextPost && (
                              <button
                                onClick={() => handlePostSelect(nextPost.id)}
                                className="group flex items-center gap-2 px-3 py-3 rounded-lg bg-card/50 hover:bg-card transition-all duration-200 hover:shadow-sm w-full md:w-0 md:flex-1 md:min-w-0 md:max-w-[calc(50%-0.5rem)] h-14"
                              >
                                <div className="text-left md:text-right min-w-0 flex-1 overflow-hidden md:order-2">
                                  <div className="text-xs text-muted-foreground mb-0.5 font-medium">Bài kế tiếp</div>
                                  <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                                    {nextPost.title.length > 30 ? `${nextPost.title.substring(0, 30)}...` : nextPost.title}
                                  </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 md:order-3" />
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })()
            ) : (
              // Render section overview content
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {activeSection === 'overview' && (
                  <MarkdownRenderer content={`# VieVlog Documentation

Welcome to VieVlog - a modern learning platform for IT education. This documentation is dynamically generated from our content database, ensuring you always have access to the latest information.

## Available Categories

We currently have ${categories.length} categories with educational content:

${categories.map((cat) => `- **${cat.name}**: ${cat.description || 'Educational content and tutorials'}`).join('\n')}

## Getting Started

Choose a category below to explore our comprehensive learning materials, tutorials, and guides. Each section contains real posts and content from our community.`} />
                )}

                {/* Show recent posts for category sections */}
                {findActivePosts().length > 0 && (
                  <div className={`${activeSection === 'overview' ? 'mt-8 pt-8' : ''} not-prose`}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-foreground">
                        Articles ({findActivePosts().length})
                      </h3>
                      {findActivePosts().length > 6 && (
                        <span className="text-sm text-muted-foreground">
                          Showing first 6 of {findActivePosts().length} articles (chronological order)
                        </span>
                      )}
                    </div>
                    <div className="grid gap-6">
                      {(showAllPosts[activeSection] ? findActivePosts() : findActivePosts().slice(0, 6)).map((post) => (
                        <div
                          key={post.id}
                          className="group p-8 rounded-2xl hover:shadow-xl hover:shadow-gray-900/5 dark:hover:shadow-black/20 
                                   transition-all duration-300 cursor-pointer bg-white/80 dark:bg-black/80 
                                   hover:bg-white dark:hover:bg-black backdrop-blur-sm hover:-translate-y-1
                                   active:scale-[0.98] active:shadow-lg touch-feedback article-card
                                   touch-manipulation select-none relative overflow-hidden
                                   md:hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                          onClick={() => handlePostSelect(post.id)}
                          onTouchStart={handleArticleTouch}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handlePostSelect(post.id);
                            }
                          }}
                        >
                          <div className="flex items-start gap-8">
                            <div className="flex-1 min-w-0">
                              {/* Category badge */}
                              {post.category && (
                                <div className="flex items-center gap-2 mb-4">
                                  <span
                                    className="text-sm font-medium px-3 py-1.5 rounded-full
                                             transition-all duration-300 group-hover:scale-105 group-active:scale-95
                                             group-hover:shadow-sm"
                                    style={{
                                      backgroundColor: `${post.category.color}15`,
                                      color: post.category.color
                                    }}
                                  >
                                    {post.category.name}
                                  </span>
                                </div>
                              )}

                              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                                {post.title}
                              </h4>
                              {post.excerpt && (
                                <p className="text-base text-gray-600 dark:text-gray-400 line-clamp-2 mb-6 leading-relaxed font-light">
                                  {post.excerpt}
                                </p>
                              )}
                              <div className="flex items-center gap-8 text-sm text-gray-500 dark:text-gray-400 font-light">
                                <div className="flex items-center gap-2">
                                  <span>📅</span>
                                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span>❤️</span>
                                  <span>{post.likes}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span>💬</span>
                                  <span>{post.commentCount}</span>
                                </div>
                              </div>
                            </div>
                            {post.coverImage && (
                              <div className="flex-shrink-0">
                                <img
                                  src={post.coverImage}
                                  alt={post.title}
                                  className="w-24 h-24 object-cover rounded-xl group-hover:scale-105 group-active:scale-95
                                           transition-all duration-300 shadow-md group-hover:shadow-lg
                                           group-hover:brightness-110"
                                />
                              </div>
                            )}
                          </div>

                          {/* Read more indicator */}
                          <div className="flex items-center gap-3 mt-6 pt-6 text-base text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                            <span>Read article</span>
                            <ChevronRight className="h-5 w-5" />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Show All / Show Less button */}
                    {findActivePosts().length > 6 && (
                      <div className="mt-12 text-center">
                        <button
                          onClick={() => setShowAllPosts(prev => ({
                            ...prev,
                            [activeSection]: !prev[activeSection]
                          }))}
                          className="px-8 py-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-all duration-200 font-medium hover:scale-105"
                        >
                          {showAllPosts[activeSection]
                            ? 'Show Less'
                            : `Show All ${findActivePosts().length} Articles`
                          }
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocsView;