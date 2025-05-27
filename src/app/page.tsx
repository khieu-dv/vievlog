"use client";

import { ArrowRight, MessageCircle, ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Footer } from "~/ui/components/footer";
import { Header } from "~/ui/components/header";
import { TestimonialCarousel } from "~/ui/components/testimonial-carousel";
import { Button } from "~/ui/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/ui/primitives/card";
import { useTranslation } from "react-i18next";
import { ContactButton } from "./components/contact-button";
import axios from "axios";
import { Post } from '../lib/types';


function PostCardSimple({ post }: { post: Post }) {
  return (
    <Card className="min-w-[300px] w-[350px] overflow-hidden transition-all duration-200 hover:shadow-md">
      {post.coverImage && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 text-xl">{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2 text-sm">
          {post.excerpt}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{post.commentCount}</span>
          </div>
        </div>
        <Link href={`/posts/${post.id}`} className="flex items-center gap-1 text-sm font-medium text-primary">
          Read more <ArrowRight className="h-4 w-4" />
        </Link>
      </CardFooter>
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
      scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
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

        const result = response.data; // Giả sử response trả về mảng bài viết

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
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 via-muted/25 to-background py-24 md:py-32">
          <div className="absolute inset-0 bg-grid-black/[0.02] bg-[length:20px_20px]" />
          <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:leading-[1.1]">
                    {t("home.oneStopPlatform")}{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">

                    </span>
                  </h1>
                  <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
                    {t("home.learnIT")}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/posts">
                    <Button size="lg" className="h-12 gap-1.5 px-8">
                      {t("home.viewAllPosts")} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative mx-auto hidden aspect-square w-full max-w-md overflow-hidden rounded-xl border lg:block">
                <div className="absolute inset-0 z-10 bg-gradient-to-tr from-primary/20 via-transparent to-transparent" />
                <Image
                  src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                  alt="Shopping experience"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </section>


        {/* Blog Posts Section - Modified to horizontal scrolling */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {t("home.latestBlogPosts")}
              </h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
              <p className="mt-4 max-w-2xl text-center text-muted-foreground">
                {t("home.exploreArticles")}
              </p>
            </div>

            {/* Navigation buttons for horizontal scrolling */}
            <div className="flex justify-end gap-2 mb-4">
              <button
                onClick={scrollLeft}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={scrollRight}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {isLoadingPosts ? (
              <div className="flex gap-6 overflow-x-auto pb-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="min-w-[300px] w-[350px] h-80 animate-pulse rounded-lg bg-muted"></div>
                ))}
              </div>
            ) : (
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-4 scroll-smooth hide-scrollbar"
                style={{
                  scrollbarWidth: 'none', /* Firefox */
                  msOverflowStyle: 'none' /* IE and Edge */
                }}
              >
                {posts.map((post) => (
                  <PostCardSimple key={post.id} post={post} />
                ))}
              </div>
            )}

            <div className="mt-10 flex justify-center">
              <Link href="/posts">
                <Button variant="outline" size="lg" className="group h-12 px-8">
                  {t("home.viewAllPosts")}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {t("home.customerTestimonialsTitle")}
              </h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
              <p className="mt-4 max-w-2xl text-center text-muted-foreground md:text-lg">
                {t("home.customerTestimonialsSubtitle")}
                customers
              </p>
            </div>
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted/50 py-12 md:py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-xl bg-primary/10 p-8 md:p-12">
              <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]" />
              <div className="relative z-10 mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {t("home.vieTopik")}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                  {t("home.yourOneStopShop")}
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/auth/sign-up">
                    <Button size="lg" className="h-12 px-8">
                      {t("home.signUpNow")}
                    </Button>
                  </Link>
                  <Link href="/posts">
                    <Button variant="outline" size="lg" className="h-12 px-8">
                      {t("home.browseIT")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ContactButton />
    </>
  );
}