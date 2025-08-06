"use client";

import { ArrowRight, MessageCircle, ChevronUp, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Footer } from "~/components/common/Footer";
import { Header } from "~/components/common/Header";
import { VieShareBanner } from "~/components/common/VieShareBanner";
import { Button } from "~/components/ui/Button";
import { Post, Category } from '~/lib/types';
import { RoadmapPostsView } from "~/components/features/posts";
import { useSession } from "~/lib/authClient";
import { useLocalizedContent } from "~/lib/multilingual";


export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: session } = useSession();
  const {
    getContent,
    currentLanguage,
    getSupportedLanguages,
    getCurrentLanguageInfo,
    isLanguageSupported: checkLanguageSupport
  } = useLocalizedContent();

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Fetch categories from database
  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
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
        name: getContent(item, 'name'),
        slug: item.slug,
        color: item.color || '#3B82F6',
        description: getContent(item, 'description'),
        postCount: 0, // Will be updated when we get post counts
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
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Fetch posts for selected category
  const fetchPosts = async (categoryId = "") => {
    try {
      setIsLoadingPosts(true);
      const params: any = {
        page: 1,
        perPage: 20,
        // Sort by created date: oldest first for roadmap progression (basic to advanced)
        sort: 'created',
        expand: 'categoryId'
      };

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
        title: getContent(item, 'title'),
        excerpt: getContent(item, 'excerpt'),
        content: getContent(item, 'content'),
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
        category: item.expand?.categoryId ? {
          id: item.expand.categoryId.id,
          name: getContent(item.expand.categoryId, 'name'),
          slug: item.expand.categoryId.slug,
          color: item.expand.categoryId.color || '#3B82F6'
        } : undefined,
        originalData: item
      }));

      setPosts(mappedPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // Handle category selection
  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId);
    fetchPosts(categoryId);
    
    // Scroll to selected category section after a short delay to ensure content is rendered
    if (categoryId) {
      setTimeout(() => {
        const element = document.getElementById('selected-category-section');
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    fetchCategories();
  }, [currentLanguage]);

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
    <div className="min-h-screen bg-background">
      <Header />
      <VieShareBanner />

      {/* Hero Section - Programiz Style */}
      <div className="bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-background">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-foreground mb-6">
              {t('home.learnToCode')}
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-6">
              {t('home.forFree')}
            </h2>
            
            <p className="text-lg text-slate-600 dark:text-muted-foreground mb-8 max-w-3xl mx-auto">
              {t('home.heroDescription')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/posts?view=roadmap">
                <Button size="lg" className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white">
                  {t('home.startLearning')}
                </Button>
              </Link>
              <Link href="/videos">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950">
                  {t('home.watchTutorials')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Programming Languages Grid - Programiz Style */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-foreground mb-4">
            {t('home.chooseLanguage')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-muted-foreground">
            {t('home.languageDescription')}
          </p>
        </div>

        {/* Programming Languages Grid */}
        {isLoadingCategories ? (
          <div className="text-center py-16">
            <div className="animate-spin inline-block w-8 h-8 border-2 border-current border-t-transparent text-blue-600 rounded-full mb-4"></div>
            <p className="text-slate-600 dark:text-muted-foreground">{t('home.loadingLanguages')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mb-16">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="group relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-6 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600"
                style={{ aspectRatio: '4/6' }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/20 dark:to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center h-full">
                  {/* Icon with improved design */}
                  <div className="relative mb-4 sm:mb-8">
                    <div 
                      className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-white text-xl sm:text-3xl font-bold shadow-lg group-hover:scale-110 transition-all duration-300"
                      style={{ 
                        backgroundColor: category.color,
                        boxShadow: `0 8px 25px ${category.color}30`
                      }}
                    >
                      {category.name.charAt(0).toUpperCase()}
                    </div>
                    {/* Subtle glow effect */}
                    <div 
                      className="absolute inset-0 rounded-2xl blur-md opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                      style={{ backgroundColor: category.color }}
                    ></div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4 sm:mb-8 line-clamp-3 sm:line-clamp-4 leading-relaxed flex-1">
                    {category.description || t('home.learnLanguageDescription', { language: category.name })}
                  </p>

                  {/* Stats and Arrow */}
                  <div className="flex items-center justify-between w-full mt-auto pt-2 sm:pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {category.postCount || 0} {t('home.tutorials')}
                      </span>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors duration-200">
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-200" />
                    </div>
                  </div>
                </div>

                {/* Subtle animation dots */}
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse"></div>
                  <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse delay-75"></div>
                  <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse delay-150"></div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Selected Category Posts */}
        {selectedCategoryId && (
          <div id="selected-category-section" className="bg-white dark:bg-card border border-slate-200 dark:border-border rounded-lg p-8 mb-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-foreground">
                {t('home.learningPathTitle', { category: categories.find(c => c.id === selectedCategoryId)?.name })}
              </h3>
              <Button
                variant="ghost"
                onClick={() => handleCategorySelect("")}
                className="text-slate-500 hover:text-slate-700 dark:text-muted-foreground dark:hover:text-foreground"
              >
                ← {t('home.backToAllLanguages')}
              </Button>
            </div>
            
            {isLoadingPosts ? (
              <div className="text-center py-8">
                <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-blue-600 rounded-full mb-4"></div>
                <p className="text-slate-600 dark:text-muted-foreground">{t('home.loadingTutorials')}</p>
              </div>
            ) : (
              <RoadmapPostsView
                posts={posts}
                session={session}
                formatRelativeTime={formatRelativeTime}
                selectedCategoryId={selectedCategoryId}
                categories={categories}
                onCategorySelect={handleCategorySelect}
                onPostClick={(postId) => router.push(`/posts/roadmap/${postId}`)}
              />
            )}

            {posts.length > 0 && (
              <div className="mt-8 text-center">
                <Link href={`/posts?view=roadmap&category=${selectedCategoryId}`}>
                  <Button size="lg" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white">
                    {t('home.viewCompleteLearningPath')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Features Section */}
        {!selectedCategoryId && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-foreground mb-2">
                {t('home.interactiveTutorials')}
              </h3>
              <p className="text-slate-600 dark:text-muted-foreground">
                {t('home.interactiveTutorialsDesc')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-foreground mb-2">
                {t('home.videoTutorials')}
              </h3>
              <p className="text-slate-600 dark:text-muted-foreground">
                {t('home.videoTutorialsDesc')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ChevronUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-foreground mb-2">
                {t('home.structuredLearning')}
              </h3>
              <p className="text-slate-600 dark:text-muted-foreground">
                {t('home.structuredLearningDesc')}
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}