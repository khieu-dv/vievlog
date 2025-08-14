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
              <Link href="/posts">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-16">
            {categories.map((category) => (
              <a
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="block bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md p-6 text-center hover:shadow-lg hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-300 cursor-pointer group"
              >
                {/* Language icon/logo area */}
                <div className="mb-4">
                  <div 
                    className="w-16 h-16 mx-auto rounded-md flex items-center justify-center text-white text-xl font-bold"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Language name */}
                <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {category.name}
                </h3>

                {/* Tutorial count - smaller text */}
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {category.postCount || 0} tutorials
                </p>
              </a>
            ))}
          </div>
        )}


        {/* Features Section */}
        {(
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