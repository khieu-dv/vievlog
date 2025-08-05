"use client";

import { ArrowRight, MessageCircle, ChevronUp, ChevronDown, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Footer } from "~/components/common/Footer";
import { Header } from "~/components/common/Header";
import { VieShareBanner } from "~/components/common/VieShareBanner";
import { Button } from "~/components/ui/Button";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Post, Category } from '~/lib/types';
import { RoadmapPostsView } from "~/components/features/posts";
import { useSession } from "~/lib/authClient";
import {
  useLocalizedContent,
  getSupportedLanguageCodes
} from "~/lib/multilingual";


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

      {/* Roadmap-style main layout */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="flex gap-6">
          {/* Main Feed - Roadmap Style */}
          <main className="flex-1">
            {/* Feed Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground mb-1">
                    {selectedCategoryId 
                      ? t('home.learningPathTitle', { category: categories.find(c => c.id === selectedCategoryId)?.name })
                      : t('home.chooseYourLearningJourney')
                    }
                  </h1>
                  <p className="text-muted-foreground">
                    {selectedCategoryId
                      ? t('home.followStructuredRoadmap')
                      : t('home.selectCategoryToStart')
                    }
                  </p>
                </div>
                {selectedCategoryId && (
                  <Link href="/posts?view=roadmap">
                    <Button variant="outline" size="sm">
                      {t('home.viewFullRoadmap')}
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Roadmap Posts View */}
            {isLoadingCategories ? (
              <div className="space-y-6">
                <div className="animate-pulse">
                  <div className="bg-muted rounded-lg h-32 mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(6).fill(0).map((_, i) => (
                      <div key={i} className="bg-muted rounded-lg h-40"></div>
                    ))}
                  </div>
                </div>
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

            {/* Show additional content when category is selected */}
            {selectedCategoryId && posts.length > 0 && (
              <div className="mt-8 text-center">
                <Link href={`/posts?view=roadmap&category=${selectedCategoryId}`}>
                  <Button className="w-full max-w-md">
                    {t('home.continueFullLearningPath')}
                  </Button>
                </Link>
              </div>
            )}
          </main>

          {/* Right Sidebar - Learning Focused */}
          <aside className="w-80 hidden lg:block">
            <div className="sticky top-20 space-y-4">
              {/* Welcome Card */}
              <div className="bg-card rounded-lg border p-4">
                <h3 className="font-medium text-foreground mb-2">{t('home.startYourLearningJourney')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('home.chooseStructuredPath')}
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <Link href="/posts?view=roadmap">
                    <Button className="w-full" size="sm">
                      {t('home.exploreAllRoadmaps')}
                    </Button>
                  </Link>
                  <Link href="/videos">
                    <Button variant="outline" className="w-full" size="sm">
                      {t('home.watchVideoTutorials')}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Learning Paths */}
              <div className="bg-card rounded-lg border p-4">
                <h3 className="font-medium text-foreground mb-3">{t('home.popularLearningPaths')}</h3>
                <div className="space-y-2">
                  {categories.slice(0, 5).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className="flex items-center justify-between w-full py-2 px-3 rounded hover:bg-muted transition-colors group text-left"
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-medium text-foreground group-hover:text-primary">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {category.postCount || 0} {t('home.steps')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Stats */}
              {selectedCategoryId && (
                <div className="bg-card rounded-lg border p-4">
                  <h3 className="font-medium text-foreground mb-3">{t('home.yourProgress')}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('home.currentPath')}</span>
                      <span className="font-medium">
                        {categories.find(c => c.id === selectedCategoryId)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('home.totalSteps')}</span>
                      <span className="font-medium">{posts.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('home.completed')}</span>
                      <span className="font-medium text-green-500">0</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Learning Tips */}
              <div className="bg-card rounded-lg border p-4">
                <h3 className="font-medium text-foreground mb-3">{t('home.learningTips')}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>{t('home.followRoadmapStepByStep')}</p>
                  <p>{t('home.markPostsComplete')}</p>
                  <p>{t('home.joinDiscussions')}</p>
                  <p>{t('home.focusOnOnePath')}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}