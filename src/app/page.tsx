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
import { Category } from '~/lib/types';
import { useLocalizedContent } from "~/lib/multilingual";


export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { getContent, currentLanguage } = useLocalizedContent();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  
  // Group categories by mainName
  const groupedCategories = categories.reduce((acc, category) => {
    const mainName = category.mainName || 'Languages';
    if (!acc[mainName]) {
      acc[mainName] = [];
    }
    acc[mainName].push(category);
    return acc;
  }, {} as Record<string, Category[]>);

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
        mainName: item.mainName || 'Languages', // Default to Languages if not set
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


  // Handle category selection - redirect to posts page
  const handleCategorySelect = useCallback((categoryId: string) => {
    router.push(`/posts?category=${categoryId}`);
  }, [router]);

  // Load initial data
  useEffect(() => {
    fetchCategories();
  }, [currentLanguage]);


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <VieShareBanner />

      {/* Hero Section - shadcn/ui Style */}
      <div className="relative">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-20 pb-16 text-center lg:pt-32">
            <h1 className="mx-auto max-w-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 text-4xl sm:text-6xl">
              The Foundation for your
              <span className="relative whitespace-nowrap text-primary">
                <span className="relative"> Learning System</span>
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700 dark:text-slate-400">
              {t('home.heroDescription')}
            </p>
            <div className="mt-10 flex justify-center gap-x-6">
              <Link href="/posts">
                <Button className="bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200">
                  {t('home.startLearning')}
                </Button>
              </Link>
              <Link href="/videos">
                <Button variant="outline" className="text-slate-900 dark:text-slate-100">
                  {t('home.watchTutorials')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Programming Categories - shadcn/ui Style */}
      <div className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          {/* Programming Categories - Grouped by mainName */}
          {isLoadingCategories ? (
            <div className="mx-auto text-center">
              <div className="animate-spin inline-block w-8 h-8 border-2 border-current border-t-transparent text-slate-900 dark:text-slate-50 rounded-full mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading categories...</p>
            </div>
          ) : (
            <div className="mx-auto space-y-16">
              {Object.entries(groupedCategories)
                .sort(([a], [b]) => {
                  const order = ['Languages', 'Frameworks', 'Soft Skills'];
                  return order.indexOf(a) - order.indexOf(b);
                })
                .map(([mainName, categoryList]) => (
                <div key={mainName}>
                  {/* Section Header */}
                  <div className="text-center mb-12">
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-4">
                      {mainName}
                    </h3>
                    <p className="text-base text-slate-600 dark:text-slate-400">
                      {mainName === 'Frameworks' 
                        ? 'Popular frameworks and tools to build amazing applications'
                        : mainName === 'Languages'
                        ? 'Programming languages to master your coding skills'
                        : 'Essential soft skills to advance your career and personal development'
                      }
                    </p>
                  </div>

                  {/* Categories Grid */}
                  <div className="grid max-w-2xl mx-auto grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3 xl:grid-cols-4">
                    {categoryList.map((category) => (
                      <div
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className="group cursor-pointer rounded-2xl bg-white p-6 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 hover:ring-slate-300 dark:bg-slate-900 dark:ring-slate-800 dark:hover:bg-slate-800/50 dark:hover:ring-slate-700 transition-all duration-300 hover:shadow-md"
                      >
                        <div className="flex items-center gap-x-4 mb-4">
                          <div 
                            className="h-12 w-12 flex-none rounded-xl flex items-center justify-center text-white text-lg font-semibold shadow-sm"
                            style={{ backgroundColor: category.color }}
                          >
                            {category.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-base font-semibold leading-6 text-slate-900 dark:text-slate-50 group-hover:text-primary transition-colors">
                            {category.name}
                          </div>
                        </div>
                        
                        {category.description && (
                          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-500">
                            {category.postCount || 0} tutorials
                          </p>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


      {/* Features Section - shadcn/ui Style */}
      <div className="bg-slate-50 py-24 sm:py-32 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              A better way to learn programming
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
              Our platform provides comprehensive learning tools designed to help you master programming from beginner to advanced levels.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-slate-50">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary">
                    <MessageCircle className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {t('home.interactiveTutorials')}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                  <p className="flex-auto">{t('home.interactiveTutorialsDesc')}</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-slate-50">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary">
                    <Share2 className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {t('home.videoTutorials')}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                  <p className="flex-auto">{t('home.videoTutorialsDesc')}</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-slate-50">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary">
                    <ChevronUp className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {t('home.structuredLearning')}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                  <p className="flex-auto">{t('home.structuredLearningDesc')}</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}