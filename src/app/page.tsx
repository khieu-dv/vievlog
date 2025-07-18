"use client";

import { ArrowRight, MessageCircle, ThumbsUp, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Users } from "lucide-react";
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
    <Card className="group relative min-w-[280px] w-[320px] overflow-hidden border-0 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10">
      {post.coverImage && (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      )}
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-lg font-semibold leading-tight">
          {post.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <CardDescription className="line-clamp-2 text-sm leading-relaxed text-muted-foreground/80">
          {post.excerpt}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-border/50 pt-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <ThumbsUp className="h-3.5 w-3.5" />
            <span className="font-medium">{post.likes}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageCircle className="h-3.5 w-3.5" />
            <span className="font-medium">{post.commentCount}</span>
          </div>
        </div>
        <Link
          href={`/posts/${post.id}`}
          className="group/link flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          Read more
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
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
    <>
      <Header />
      <main className="flex-1 overflow-hidden">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 lg:py-32">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(var(--primary))_0%,transparent_50%)] opacity-[0.15]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--secondary))_0%,transparent_50%)] opacity-[0.1]" />
          </div>

          <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    <Sparkles className="h-4 w-4" />
                    Welcome to our platform
                  </div>

                  <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                    {t("home.oneStopPlatform")}{" "}
                    <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                      IT Learning
                    </span>
                  </h1>

                  <p className="max-w-[600px] text-lg leading-relaxed text-muted-foreground md:text-xl">
                    {t("home.learnIT")}
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href="/posts">
                    <Button size="lg" className="group h-12 px-8 font-medium shadow-lg shadow-primary/25">
                      {t("home.viewAllPosts")}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Button>
                  </Link>
                  <Link href="/auth/sign-in">
                    <Button variant="outline" size="lg" className="h-12 px-8 font-medium">
                      Learn More
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-8 pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">10K+ Users</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">500+ Articles</span>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto hidden aspect-square w-full max-w-lg lg:block">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent" />
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 blur-xl" />
                <div className="relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                  <Image
                    src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    alt="Platform showcase"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VieClone Section */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-4">
                <Sparkles className="h-4 w-4" />
                Featured Tool
              </div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                VieClone – Download videos with ease
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg">
                VieClone helps you easily download videos from platforms like YouTube and Facebook using a simple link.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-6">
              <Link href="/vieclone">
                <Button size="lg" className="px-8 h-12 font-medium shadow-md">
                  Explore VieClone
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                Simple · Fast · Windows Supported
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-4">
                <TrendingUp className="h-4 w-4" />
                Latest Content
              </div>

              <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                {t("home.latestBlogPosts")}
              </h2>

              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                {t("home.exploreArticles")}
              </p>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-end gap-2 mb-6">
              <button
                onClick={scrollLeft}
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/50 hover:bg-primary/10"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5 transition-colors group-hover:text-primary" />
              </button>
              <button
                onClick={scrollRight}
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/50 hover:bg-primary/10"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5 transition-colors group-hover:text-primary" />
              </button>
            </div>

            {isLoadingPosts ? (
              <div className="flex gap-6 overflow-x-auto pb-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="min-w-[280px] w-[320px] h-80 animate-pulse rounded-xl bg-muted/50"></div>
                ))}
              </div>
            ) : (
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
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

            <div className="mt-12 flex justify-center">
              <Link href="/posts">
                <Button variant="outline" size="lg" className="group h-12 px-8 font-medium">
                  {t("home.viewAllPosts")}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-4">
                <Users className="h-4 w-4" />
                Testimonials
              </div>

              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {t("home.customerTestimonialsTitle")}
              </h2>

              <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
                {t("home.customerTestimonialsSubtitle")}
              </p>
            </div>

            {/* Simple Grid Layout */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="group relative rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                >
                  {/* Quote */}
                  <div className="mb-4">
                    <div className="mb-3 flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      "{testimonial.content}"
                    </p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image
                        src={testimonial.author.avatar}
                        alt={testimonial.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {testimonial.author.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.author.role}
                      </p>
                    </div>
                  </div>

                  {/* Decorative element */}
                  <div className="absolute -top-2 -left-2 h-4 w-4 rounded-full bg-primary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-secondary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              ))}
            </div>

            {/* Simple CTA */}
            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Join thousands of satisfied users
              </p>
              <Link href="/auth/sign-up">
                <Button className="h-10 px-6 text-sm font-medium">
                  Get Started Today
                </Button>
              </Link>
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 p-8 md:p-12 lg:p-16">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary))_0%,transparent_50%)] opacity-[0.1]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--secondary))_0%,transparent_50%)] opacity-[0.1]" />

              <div className="relative z-10 mx-auto max-w-3xl text-center">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                  {t("home.vieTopik")}
                </h2>

                <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
                  {t("home.yourOneStopShop")}
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link href="/auth/sign-up">
                    <Button size="lg" className="h-12 px-8 font-medium shadow-lg shadow-primary/25">
                      {t("home.signUpNow")}
                    </Button>
                  </Link>
                  <Link href="/posts">
                    <Button variant="outline" size="lg" className="h-12 px-8 font-medium">
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