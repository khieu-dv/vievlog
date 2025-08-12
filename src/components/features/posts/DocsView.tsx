import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Rocket, Settings, Code, Users, Video, MessageCircle, Shield, Globe, GitBranch, Search, X, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Post, Category } from '~/lib/types';
import { useLocalizedContent } from "~/lib/multilingual";
import { MarkdownRenderer } from '~/components/common/MarkdownRenderer';

interface DocSection {
  id: string;
  title: string;
  content: string;
  icon?: React.ReactNode;
  posts?: Post[];
  category?: Category;
}

interface DocsViewProps {
  className?: string;
}

// Simple cache to prevent refetching - cleared on reload
let docsCache: {
  categories?: Category[];
  categoryPosts?: Record<string, Post[]>;
  docsData?: DocSection[];
  version?: string;
} = { version: '1.4' }; // Version bump to clear old cache

const DocsView: React.FC<DocsViewProps> = ({ className }) => {
  const { t } = useTranslation();
  const { getContent } = useLocalizedContent();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryPosts, setCategoryPosts] = useState<Record<string, Post[]>>({});
  const [docsData, setDocsData] = useState<DocSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPostSections, setExpandedPostSections] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDocsData, setFilteredDocsData] = useState<DocSection[]>([]);
  const [showAllPosts, setShowAllPosts] = useState<Record<string, boolean>>({});
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [mainContentHovered, setMainContentHovered] = useState(false);

  // Update URL when viewing posts for shareable links
  const updateURL = (postId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('post', postId);
    router.replace(`/posts?${params.toString()}`, { scroll: false });
  };

  // Handle post selection with URL update
  const handlePostSelect = (postId: string) => {
    setActiveSection(`post-${postId}`);
    updateURL(postId);
    // Close mobile menu when post is selected
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      newSet.delete('mobile-nav');
      return newSet;
    });
  };

  // Handle scroll events to prevent body scroll when hovering over sidebar
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as Element;
      
      // Check if the scroll is happening within sidebar
      const isInSidebar = target.closest('[data-scroll-area="sidebar"]');
      
      if (isInSidebar) {
        // Allow sidebar scrolling, prevent body scroll
        const sidebarElement = target.closest('[data-scroll-area="sidebar"]') as HTMLElement;
        if (sidebarElement) {
          const { scrollTop, scrollHeight, clientHeight } = sidebarElement;
          const isScrollingUp = e.deltaY < 0;
          const isScrollingDown = e.deltaY > 0;
          
          // Prevent body scroll if we're scrolling within sidebar bounds
          if ((isScrollingUp && scrollTop > 0) || 
              (isScrollingDown && scrollTop < scrollHeight - clientHeight)) {
            e.preventDefault();
            sidebarElement.scrollTop += e.deltaY;
          }
        }
      }
      // For main content, allow normal page scrolling (no special handling needed)
    };

    // Add passive: false to allow preventDefault
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Fetch categories and posts data
  useEffect(() => {
    const fetchDocsData = async () => {
      try {
        setLoading(true);

        // Check cache first (with version check)
        if (docsCache.categories && docsCache.categoryPosts && docsCache.docsData && docsCache.version === '1.3') {
          console.log('Using cached data');
          setCategories(docsCache.categories);
          setCategoryPosts(docsCache.categoryPosts);
          setDocsData(docsCache.docsData);

          if (docsCache.docsData.length > 0) {
            setActiveSection(docsCache.docsData[0].id);
            setExpandedSections(new Set([docsCache.docsData[0].id]));
          }

          setLoading(false);
          return;
        }

        // First, fetch all categories
        console.log('Fetching categories...');
        const categoriesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/collections/categories_tbl/records`,
          {
            params: {
              page: 1,
              perPage: 50,
              sort: 'name'
            },
            timeout: 10000 // 10 second timeout
          }
        );

        const categoriesData = categoriesResponse.data.items.map((item: any) => ({
          id: item.id,
          name: getContent(item, 'name'),
          slug: item.slug,
          color: item.color || '#6366f1',
          description: getContent(item, 'description'),
          postCount: 0,
          originalData: item
        }));

        setCategories(categoriesData);
        console.log(`Fetched ${categoriesData.length} categories`);

        // Fetch all posts with pagination to get everything
        console.log('Fetching all posts...');
        let allPosts: any[] = [];
        let currentPage = 1;
        let hasMorePosts = true;

        while (hasMorePosts) {
          const allPostsResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/collections/posts_tbl/records`,
            {
              params: {
                page: currentPage,
                perPage: 500, // Fetch more per page to reduce API calls
                sort: '-created',
                expand: 'categoryId'
              },
              timeout: 15000 // 15 second timeout
            }
          );

          const fetchedPosts = allPostsResponse.data.items;
          allPosts = [...allPosts, ...fetchedPosts];

          // Check if we have more pages
          hasMorePosts = fetchedPosts.length === 500;
          currentPage++;

          console.log(`Fetched page ${currentPage - 1}, total posts: ${allPosts.length}`);
        }

        console.log(`Fetched ${allPosts.length} total posts`);

        // Group posts by category
        const categoryPostsData: Record<string, Post[]> = {};

        // Initialize empty arrays for all categories
        categoriesData.forEach((category: Category) => {
          categoryPostsData[category.id] = [];
        });

        // Map and group posts by category
        allPosts.forEach((item: any) => {
          const mappedPost: Post = {
            id: item.id,
            title: getContent(item, 'title'),
            excerpt: getContent(item, 'excerpt'),
            content: getContent(item, 'content'),
            publishedAt: item.created || item.publishedAt,
            coverImage: item.coverImage || "",
            author: {
              name: item.author?.name || "Anonymous",
              avatar: item.author?.avatar || "",
            },
            likes: item.likes || 0,
            commentCount: item.commentCount || 0,
            tags: item.tags || [],
            comments: [],
            categoryId: item.categoryId || "",
            category: item.expand?.categoryId ? {
              id: item.expand.categoryId.id,
              name: getContent(item.expand.categoryId, 'name'),
              slug: item.expand.categoryId.slug,
              color: item.expand.categoryId.color || '#6366f1'
            } : undefined
          };

          // Add to appropriate category
          if (mappedPost.categoryId && categoryPostsData[mappedPost.categoryId]) {
            categoryPostsData[mappedPost.categoryId].push(mappedPost);
          }
        });

        // Sort posts within each category by creation date (oldest first for learning progression)
        Object.keys(categoryPostsData).forEach(categoryId => {
          categoryPostsData[categoryId].sort((a, b) =>
            new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
          );
        });

        setCategoryPosts(categoryPostsData);
        console.log('Posts grouped by category');

        // Create dynamic documentation structure
        const dynamicDocsData: DocSection[] = [
          {
            id: 'overview',
            title: 'Platform Overview',
            icon: <BookOpen className="h-4 w-4" />,
            content: `# VieVlog Documentation

Welcome to VieVlog - a modern learning platform for IT education. This documentation is dynamically generated from our content database, ensuring you always have access to the latest information.

## Available Categories

We currently have ${categoriesData.length} categories with educational content:

${categoriesData.map((cat: Category) => `- **${cat.name}**: ${cat.description || 'Educational content and tutorials'}`).join('\n')}

## Getting Started

Choose a category below to explore our comprehensive learning materials, tutorials, and guides. Each section contains real posts and content from our community.`,
          },
          ...categoriesData.map((category: Category) => {
            const posts = categoryPostsData[category.id] || [];
            return {
              id: category.id,
              title: category.name,
              icon: getCategoryIcon(category.name),
              category: category,
              posts: posts,
              content: `# ${category.name}

${category.description || `Comprehensive guide to ${category.name} development and best practices.`}

## Available Content

This section contains ${posts.length} posts covering various aspects of ${category.name}.

${posts.length > 0 ? `

### Learning Path (Start Here)

${posts.slice(0, 5).map((post, index) => `
#### ${index + 1}. ${post.title}

${post.excerpt || 'Educational content and tutorials.'}

*Published: ${new Date(post.publishedAt).toLocaleDateString()}*

---
`).join('\n')}

${posts.length > 5 ? `\n*Continue with ${posts.length - 5} more articles in this learning path...*` : ''}

` : '\n*No posts available in this category yet. Check back later for new content!*'}

## Structured Learning

${posts.length > 0 ? `
These articles are organized chronologically to provide a structured learning experience. Start with the first article and progress through each one to build your knowledge step by step.

**Learning progression:**
${posts.slice(0, 5).map((post, index) => `${index + 1}. ${post.title}`).join('\n')}
${posts.length > 5 ? `\n...and ${posts.length - 5} more articles` : ''}
` : ''}
`
            };
          })
        ];

        setDocsData(dynamicDocsData);

        // Cache the data
        docsCache = {
          categories: categoriesData,
          categoryPosts: categoryPostsData,
          docsData: dynamicDocsData,
          version: '1.3'
        };

        // Set initial active section - check URL for post parameter
        const postIdFromURL = searchParams.get('post');
        if (postIdFromURL) {
          // If there's a post ID in URL, show that post
          setActiveSection(`post-${postIdFromURL}`);
          // Find which category this post belongs to and expand that section
          const allPosts = Object.values(categoryPostsData).flat();
          const post = allPosts.find(p => p.id === postIdFromURL);
          if (post && post.categoryId) {
            setExpandedSections(new Set([post.categoryId]));
          }
        } else if (dynamicDocsData.length > 0) {
          setActiveSection(dynamicDocsData[0].id);
          setExpandedSections(new Set([dynamicDocsData[0].id]));
        }

      } catch (error) {
        console.error('Failed to fetch documentation data:', error);
        // Provide more helpful error information
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setDocsData([
          {
            id: 'error',
            title: 'Error Loading Documentation',
            icon: <BookOpen className="h-4 w-4" />,
            content: `# Error Loading Documentation

Unable to load documentation content from the server.

**Error Details:** ${errorMessage}

**Possible Solutions:**
- Check your internet connection
- Verify the API server is running
- Try refreshing the page
- Contact support if the issue persists

**API Endpoint:** \`${process.env.NEXT_PUBLIC_API_URL}\``
          }
        ]);
        setActiveSection('error');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data once
    fetchDocsData();
  }, []); // Remove getContent dependency to prevent refetching

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

  // Helper function to get category icons
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('javascript') || name.includes('js')) return <Code className="h-4 w-4" />;
    if (name.includes('react') || name.includes('vue') || name.includes('angular')) return <Rocket className="h-4 w-4" />;
    if (name.includes('node') || name.includes('backend')) return <Settings className="h-4 w-4" />;
    if (name.includes('video') || name.includes('media')) return <Video className="h-4 w-4" />;
    if (name.includes('community') || name.includes('discussion')) return <MessageCircle className="h-4 w-4" />;
    if (name.includes('security')) return <Shield className="h-4 w-4" />;
    if (name.includes('web') || name.includes('frontend')) return <Globe className="h-4 w-4" />;
    if (name.includes('git') || name.includes('version')) return <GitBranch className="h-4 w-4" />;
    return <BookOpen className="h-4 w-4" />;
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading documentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col lg:flex-row gap-6 lg:gap-8 ${className}`}>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden">
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
          className="flex items-center justify-between w-full p-3 bg-card border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="font-medium">Documentation Menu</span>
          </div>
          {expandedSections.has('mobile-nav') ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {expandedSections.has('mobile-nav') && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setExpandedSections(prev => {
            const newSet = new Set(prev);
            newSet.delete('mobile-nav');
            return newSet;
          })}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`w-full lg:w-80 flex-shrink-0 ${expandedSections.has('mobile-nav') ? 'block relative z-50' : 'hidden lg:block'
        }`}>
        <div className="sticky top-6">
          <div className="bg-card border rounded-lg shadow-sm flex flex-col" style={{height: 'calc(100vh - 8rem)'}}>
            {/* Header with Search */}
            <div className="p-4 border-b flex-shrink-0">
              <h2 className="text-lg font-semibold text-foreground mb-3 hidden lg:block">Documentation</h2>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-muted/50 border border-muted-foreground/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Search Results Count */}
              {searchQuery && (
                <p className="text-xs text-muted-foreground mt-2">
                  {filteredDocsData.length} section{filteredDocsData.length !== 1 ? 's' : ''} found
                </p>
              )}
            </div>

            {/* Navigation Content - Scrollable */}
            <div className="p-3 lg:p-4 flex-1 overflow-y-auto" data-scroll-area="sidebar">

              <nav className="space-y-2">
                {/* Home/Overview always visible */}
                {!searchQuery && (
                  <button
                    onClick={() => {
                      setActiveSection('overview');
                      // Close mobile menu when section is selected
                      setExpandedSections(prev => {
                        const newSet = new Set(prev);
                        newSet.delete('mobile-nav');
                        return newSet;
                      });
                    }}
                    className={`flex items-center gap-2 w-full p-2 text-sm font-medium rounded-md transition-colors ${activeSection === 'overview'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                      }`}
                  >
                    <Home className="h-4 w-4" />
                    <span>Overview</span>
                  </button>
                )}

                {(searchQuery ? filteredDocsData : docsData).map((section) => (
                  <div key={section.id}>
                    {/* Different layout for sections with/without posts */}
                    {section.posts && section.posts.length > 0 ? (
                      <button
                        onClick={() => {
                          // Toggle both section view and dropdown
                          setActiveSection(section.id);
                          toggleSection(section.id);
                        }}
                        className={`flex items-center gap-2 w-full p-2 lg:p-2 text-sm font-medium rounded-md transition-colors justify-between ${activeSection === section.id
                            ? 'bg-muted text-foreground'
                            : 'text-foreground hover:bg-muted'
                          }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {section.icon}
                          <span className="truncate">{section.title}</span>
                          {section.category && (
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: section.category.color }}
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-xs font-medium">
                            {section.posts.length}
                          </span>
                          {expandedSections.has(section.id) ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </div>
                      </button>
                    ) : (
                      /* Simple button for sections without posts */
                      <button
                        onClick={() => {
                          setActiveSection(section.id);
                        }}
                        className={`flex items-center gap-2 w-full p-2 lg:p-2 text-sm font-medium rounded-md transition-colors ${activeSection === section.id
                            ? 'bg-muted text-foreground'
                            : 'text-foreground hover:bg-muted'
                          }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {section.icon}
                          <span className="truncate">{section.title}</span>
                          {section.category && (
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: section.category.color }}
                            />
                          )}
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
                            className={`block w-full text-left p-2 lg:p-2 text-xs rounded-md transition-colors ${activeSection === `post-${post.id}`
                                ? 'bg-muted text-foreground font-medium'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
                                className={`block w-full text-left p-2 lg:p-2 text-xs rounded-md transition-colors ${activeSection === `post-${post.id}`
                                    ? 'bg-muted text-foreground font-medium'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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

                {/* No results message */}
                {searchQuery && filteredDocsData.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No results found for "{searchQuery}"</p>
                    <p className="text-xs mt-1">Try different keywords or browse all sections</p>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="bg-card border rounded-lg shadow-sm">
          {/* Content Header with Breadcrumbs */}
          <div className="border-b px-6 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Home className="h-4 w-4" />
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">
                {activeSection.startsWith('post-')
                  ? (() => {
                    const postId = activeSection.replace('post-', '');
                    const allPosts = Object.values(categoryPosts).flat();
                    const post = allPosts.find(p => p.id === postId);
                    return post?.category?.name || 'Post';
                  })()
                  : docsData.find(s => s.id === activeSection)?.title || 'Documentation'
                }
              </span>
              {activeSection.startsWith('post-') && (
                <>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-foreground">
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
          <div className="p-6 lg:p-8">
            {activeSection.startsWith('post-') ? (
              // Render individual post content
              (() => {
                const postId = activeSection.replace('post-', '');
                const allPosts = Object.values(categoryPosts).flat();
                const post = allPosts.find(p => p.id === postId);

                if (!post) {
                  return <div className="text-muted-foreground">Post not found.</div>;
                }

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

                      <h1 className="text-4xl font-bold text-foreground mb-6 leading-tight">{post.title}</h1>

                      {post.excerpt && (
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">{post.excerpt}</p>
                      )}
                    </div>

                    {/* Article Content */}
                    <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
                      <MarkdownRenderer content={post.content || 'No content available for this post.'} />
                    </div>

                    {/* Article Footer */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-12 pt-8 border-t">
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

                    {/* Back to section button */}
                    <div className="mt-8 pt-6 border-t">
                      <button
                        onClick={() => setActiveSection(post.categoryId || 'overview')}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ChevronRight className="h-4 w-4 rotate-180" />
                        <span>Back to {post.category?.name || 'Overview'}</span>
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : (
              // Render section overview content
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <MarkdownRenderer content={findActiveContent()} />

                {/* Show recent posts for category sections */}
                {findActivePosts().length > 0 && (
                  <div className="mt-8 pt-8 border-t not-prose">
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
                          className="group p-6 border rounded-xl hover:border-primary/20 hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br from-card to-muted/20"
                          onClick={() => handlePostSelect(post.id)}
                        >
                          <div className="flex items-start gap-6">
                            <div className="flex-1 min-w-0">
                              {/* Category badge */}
                              {post.category && (
                                <div className="flex items-center gap-2 mb-3">
                                  <div
                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: post.category.color }}
                                  />
                                  <span
                                    className="text-xs font-medium px-2 py-1 rounded-full"
                                    style={{
                                      backgroundColor: `${post.category.color}15`,
                                      color: post.category.color
                                    }}
                                  >
                                    {post.category.name}
                                  </span>
                                </div>
                              )}

                              <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                {post.title}
                              </h4>
                              {post.excerpt && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                  {post.excerpt}
                                </p>
                              )}
                              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <span>📅</span>
                                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span>❤️</span>
                                  <span>{post.likes}</span>
                                </div>
                                <div className="flex items-center gap-1">
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
                                  className="w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
                          </div>

                          {/* Read more indicator */}
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-muted/50 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>Read article</span>
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Show All / Show Less button */}
                    {findActivePosts().length > 6 && (
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => setShowAllPosts(prev => ({
                            ...prev,
                            [activeSection]: !prev[activeSection]
                          }))}
                          className="px-6 py-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors font-medium"
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