"use client";

import { ArrowRight, MessageCircle, ThumbsUp, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Users, Play, BookOpen, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Footer } from "~/components/common/footer";
import { Header } from "~/components/common/header";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import { useTranslation } from "react-i18next";
import { ContactButton } from "~/components/common/contact-button";
import axios from "axios";
import { Post } from '../lib/types';

function PostCardSimple({ post }: { post: Post }) {
  return (
    <Card className="group relative min-w-[300px] w-[340px] overflow-hidden bg-white dark:bg-card transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
      {post.coverImage && (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white font-bold text-lg line-clamp-2 mb-2">
              {post.title}
            </h3>
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{post.commentCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {!post.coverImage && (
        <div className="p-6">
          <h3 className="font-bold text-xl line-clamp-2 mb-3">
            {post.title}
          </h3>
          <p className="text-muted-foreground line-clamp-3 mb-4">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post.commentCount}</span>
            </div>
          </div>
        </div>
      )}
      <Link
        href={`/posts/${post.id}`}
        className="absolute inset-0 z-10"
        aria-label={`Read ${post.title}`}
      />
    </Card>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Array<{
    id: string;
    title: string;
    excerpt: string;
    publishedAt: string;
    coverImage: string;
    author: { name: string; avatar: string };
    likes: number;
    commentCount: number;
    tags: string[];
  }>>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll navigation functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  // Testimonials for the testimonial carousel
  const testimonials = [
    {
      id: "1",
      content: t("home.testimonial1.quote"),
      author: {
        name: t("home.testimonial1.name"),
        role: t("home.testimonial1.role"),
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      },
      rating: 5,
    },
    {
      id: "2",
      content: t("home.testimonial2.quote"),
      author: {
        name: t("home.testimonial2.name"),
        role: t("home.testimonial2.role"),
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      },
      rating: 4,
    },
    {
      id: "3",
      content: t("home.testimonial3.quote"),
      author: {
        name: t("home.testimonial3.name"),
        role: t("home.testimonial3.role"),
        avatar:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      },
      rating: 5,
    },
  ];

  // Load blog posts for the homepage
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections/posts_tbl/records`);
        const result = response.data;

        const mappedPosts = result.items.map((item: any) => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt,
          publishedAt: item.created || item.publishedAt,
          coverImage: item.coverImage || "",
          author: {
            name: item.author?.name || "Anonymous",
            avatar: item.author?.avatar || "/default-avatar.png",
          },
          likes: item.likes || 0,
          commentCount: item.commentCount || 0,
          tags: item.tags || [],
        }));

        setPosts(mappedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <Header />
      <main className="flex-1 overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbD0iIzRmNDZlNSIgZmlsbC1vcGFjaXR5PSIwLjA1Ij4KICAgICAgICAgICAgPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+')] opacity-40" />
          </div>

          <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-200/50 px-6 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                <span>Welcome to VievLog Platform</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                  <span className="block text-gray-900 dark:text-white">Your</span>
                  <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    IT Learning
                  </span>
                  <span className="block text-gray-900 dark:text-white">Journey</span>
                </h1>
                
                <p className="mx-auto max-w-3xl text-xl md:text-2xl leading-relaxed text-gray-600 dark:text-gray-300">
                  {t("home.learnIT")}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <Link href="/posts">
                  <Button size="lg" className="group h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300">
                    <BookOpen className="mr-2 h-5 w-5" />
                    {t("home.viewAllPosts")}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/videos">
                  <Button variant="outline" size="lg" className="group h-14 px-8 text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Videos
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-12 pt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">10K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">500+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">IT Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">50+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Video Tutorials</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Content */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-200/50 px-4 py-2 text-sm font-medium text-green-700 dark:text-green-300 mb-6">
                <TrendingUp className="h-4 w-4" />
                <span>Latest Content</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {t("home.latestBlogPosts")}
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {t("home.exploreArticles")}
              </p>
            </div>

            {/* Posts Container */}
            <div className="relative">
              {/* Navigation Buttons */}
              <div className="absolute -top-16 right-0 flex gap-2 z-10">
                <button
                  onClick={scrollLeft}
                  className="group flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </button>
                <button
                  onClick={scrollRight}
                  className="group flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </button>
              </div>

              {/* Posts Carousel */}
              {isLoadingPosts ? (
                <div className="flex gap-6 overflow-x-auto pb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="min-w-[300px] w-[340px] h-96 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700"></div>
                  ))}
                </div>
              ) : (
                <div
                  ref={scrollContainerRef}
                  className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  {posts.map((post) => (
                    <PostCardSimple key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>

            {/* View All Button */}
            <div className="text-center mt-16">
              <Link href="/posts">
                <Button size="lg" className="group h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <BookOpen className="mr-2 h-5 w-5" />
                  {t("home.viewAllPosts")}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200/50 px-4 py-2 text-sm font-medium text-purple-700 dark:text-purple-300 mb-6">
                <Star className="h-4 w-4" />
                <span>Testimonials</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {t("home.customerTestimonialsTitle")}
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {t("home.customerTestimonialsSubtitle")}
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="group relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Quote Icon */}
                  <div className="absolute -top-4 left-8">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-3">
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex mb-4 mt-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                      <Image
                        src={testimonial.author.avatar}
                        alt={testimonial.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.author.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.author.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-16">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of satisfied learners today
              </p>
              <Link href="/auth/sign-up">
                <Button size="lg" className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiPgogICAgICAgICAgICA8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=')] opacity-30" />
          
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center text-white space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold">
                Ready to Start Learning?
              </h2>
              
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                {t("home.yourOneStopShop")}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                <Link href="/auth/sign-up">
                  <Button size="lg" className="h-16 px-10 text-lg font-bold bg-white text-blue-900 hover:bg-gray-100 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300">
                    {t("home.signUpNow")}
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
                <Link href="/posts">
                  <Button 
                    size="lg" 
                    className="h-16 px-10 text-lg font-bold bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 hover:border-white transition-all duration-300 backdrop-blur-sm group"
                  >
                    <span>{t("home.browseIT")}</span>
                    <BookOpen className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ContactButton />
    </div>
  );
}