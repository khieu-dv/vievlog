"use client";

import { ArrowRight, MessageCircle, ChevronUp, Share2, Gamepad2, Users, TrendingUp } from "lucide-react";
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
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <VieShareBanner />

      {/* Hero Section - Apple Style */}
      <div className="relative overflow-hidden bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="pt-24 pb-20 text-center lg:pt-40 lg:pb-32">
            <h1 className="mx-auto max-w-4xl font-semibold tracking-tight text-gray-900 dark:text-white text-5xl sm:text-7xl lg:text-8xl leading-none">
              VieVlog.
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-2xl font-light text-gray-600 dark:text-gray-300 leading-relaxed">
              The future of programming education.<br />
              Beautiful. Powerful. Easy to learn.
            </p>
            <div className="mt-12 flex justify-center gap-x-4">
              <Link href="/posts">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-full text-lg">
                  Start Learning
                </Button>
              </Link>
              <Link href="/videos">
                <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 font-medium px-8 py-3 rounded-full text-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                  Watch Videos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Programming Categories - Apple Style */}
      <div className="relative py-20 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl px-6">

          {/* Programming Categories - Grouped by mainName */}
          {isLoadingCategories ? (
            <div className="mx-auto text-center">
              <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-gray-900 dark:text-white rounded-full mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 font-light">Loading categories...</p>
            </div>
          ) : (
            <div className="mx-auto space-y-24">
              {Object.entries(groupedCategories)
                .sort(([a], [b]) => {
                  const order = ['Languages', 'Frameworks', 'Soft Skills'];
                  return order.indexOf(a) - order.indexOf(b);
                })
                .map(([mainName, categoryList]) => (
                <div key={mainName} className="text-center">
                  {/* Section Header */}
                  <div className="mb-16">
                    <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">
                      {mainName}
                    </h2>
                    <p className="text-xl font-light text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                      {mainName === 'Frameworks' 
                        ? 'Popular frameworks and tools to build amazing applications'
                        : mainName === 'Languages'
                        ? 'Programming languages to master your coding skills'
                        : 'Essential soft skills to advance your career and personal development'
                      }
                    </p>
                  </div>

                  {/* Categories Grid */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-5xl mx-auto">
                    {categoryList.map((category) => (
                      <div
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className="group cursor-pointer bg-white dark:bg-black rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex flex-col items-center text-center">
                          <div 
                            className="h-14 w-14 rounded-full flex items-center justify-center text-white text-xl font-medium mb-4"
                            style={{ backgroundColor: category.color }}
                          >
                            {category.name.charAt(0).toUpperCase()}
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
                            {category.postCount || 0} tutorials
                          </p>
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


      {/* Features Section - Apple Style */}
      <div className="bg-white dark:bg-black py-20 lg:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">
              Why VieVlog?
            </h2>
            <p className="text-xl font-light text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to master programming. Beautifully designed, thoughtfully crafted.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                Interactive Learning
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                Learn with hands-on examples and interactive code snippets that bring concepts to life.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Share2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                Video Tutorials
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                Watch comprehensive video guides designed for visual learners and complex topics.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <ChevronUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                Structured Paths
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                Follow curated roadmaps that take you from beginner to advanced level systematically.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Game Promotion Section - Apple Style */}
      <div className="relative py-20 lg:py-32 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            
            {/* Content */}
            <div className="text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">
                Learn Through Play
              </h2>
              <p className="text-xl font-light text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Master programming concepts through interactive games and challenges. 
                Fun, engaging, and surprisingly effective.
              </p>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center lg:justify-start justify-center gap-x-3">
                  <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Gamepad2 className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 font-light">Interactive Learning</span>
                </div>
                <div className="flex items-center lg:justify-start justify-center gap-x-3">
                  <div className="h-6 w-6 bg-green-600 rounded-full flex items-center justify-center">
                    <Users className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 font-light">Multiplayer Challenges</span>
                </div>
                <div className="flex items-center lg:justify-start justify-center gap-x-3">
                  <div className="h-6 w-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 font-light">Progress Tracking</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4">
                <Link href="/godot-game">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-full text-lg">
                    Play Now
                  </Button>
                </Link>
                <Link href="/godot-game">
                  <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 font-medium px-8 py-3 rounded-full text-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Screenshots Grid - Simplified */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="/screenshot20.png"
                  alt="Game Screenshot 1"
                  className="w-full h-auto rounded-2xl shadow-2xl transition-transform hover:scale-105"
                />
                <img
                  src="/screenshot22.png"
                  alt="Game Screenshot 3"
                  className="w-full h-auto rounded-2xl shadow-2xl transition-transform hover:scale-105"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img
                  src="/screenshot21.png"
                  alt="Game Screenshot 2"
                  className="w-full h-auto rounded-2xl shadow-2xl transition-transform hover:scale-105"
                />
                <img
                  src="/screenshot23.png"
                  alt="Game Screenshot 4"
                  className="w-full h-auto rounded-2xl shadow-2xl transition-transform hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}