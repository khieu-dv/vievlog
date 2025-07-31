"use client";

import { ArrowRight, MessageCircle, ThumbsUp, ChevronUp, ChevronDown, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Footer } from "~/components/common/Footer";
import { Header } from "~/components/common/Header";
import { Button } from "~/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/Card";
import { useTranslation } from "react-i18next";
import { ContactButton } from "~/components/common/ContactButton";
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
      
      {/* Reddit-style main layout */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="flex gap-6">
          {/* Main Feed - Reddit Style */}
          <main className="flex-1 max-w-2xl">
            {/* Feed Header */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span className="font-medium text-foreground">Popular posts</span>
                <span>•</span>
                <span>Programming & Tech</span>
              </div>
              <div className="border-b border-border"></div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-2">
              {isLoadingPosts ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="bg-card rounded-md border animate-pulse">
                    <div className="flex">
                      <div className="w-10 bg-muted/30 rounded-l-md p-2">
                        <div className="space-y-1">
                          <div className="h-5 w-5 bg-muted rounded"></div>
                          <div className="h-3 w-6 bg-muted rounded"></div>
                          <div className="h-5 w-5 bg-muted rounded"></div>
                        </div>
                      </div>
                      <div className="flex-1 p-3 space-y-2">
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-3 bg-muted rounded w-3/4"></div>
                        <div className="flex gap-2">
                          <div className="h-6 w-16 bg-muted rounded"></div>
                          <div className="h-6 w-12 bg-muted rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                posts.slice(0, 8).map((post, index) => (
                  <div key={post.id} className="bg-card border rounded-md hover:border-muted-foreground/20 transition-colors">
                    <div className="flex">
                      {/* Reddit-style voting panel */}
                      <div className="flex flex-col items-center p-2 w-10 bg-muted/30 rounded-l-md">
                        <button className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-orange-500">
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <span className="text-xs font-medium text-muted-foreground px-1">
                          {post.likes || Math.floor(Math.random() * 100)}
                        </span>
                        <button className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-blue-500">
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Main content */}
                      <div className="flex-1 p-3">
                        {/* Post header */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <span className="font-medium text-foreground">r/programming</span>
                          <span>•</span>
                          <span>Posted by u/{post.author.name}</span>
                          <span>•</span>
                          <span>{formatRelativeTime(post.publishedAt)}</span>
                        </div>

                        {/* Post title */}
                        <Link href={`/posts/${post.id}`} className="block group">
                          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                            {post.title}
                          </h3>
                        </Link>

                        {/* Post excerpt */}
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <button className="flex items-center gap-1 hover:bg-muted px-2 py-1 rounded transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.commentCount} comments</span>
                          </button>
                          <button className="flex items-center gap-1 hover:bg-muted px-2 py-1 rounded transition-colors">
                            <Share2 className="h-4 w-4" />
                            <span>Share</span>
                          </button>
                          <Link 
                            href={`/posts/${post.id}`}
                            className="flex items-center gap-1 hover:bg-muted px-2 py-1 rounded transition-colors"
                          >
                            <ArrowRight className="h-4 w-4" />
                            <span>Read</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Load more */}
            <div className="mt-6">
              <Link href="/posts">
                <Button variant="outline" className="w-full">
                  View more posts
                </Button>
              </Link>
            </div>
          </main>

          {/* Right Sidebar - Reddit Style */}
          <aside className="w-80 hidden lg:block">
            <div className="sticky top-20 space-y-4">
              {/* Welcome Card */}
              <div className="bg-card rounded-lg border p-4">
                <h3 className="font-medium text-foreground mb-2">Welcome to VieVlog</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("home.description")}
                </p>
                <div className="space-y-2">
                  <Link href="/posts">
                    <Button className="w-full" size="sm">
                      Browse Posts
                    </Button>
                  </Link>
                  <Link href="/videos">
                    <Button variant="outline" className="w-full" size="sm">
                      Watch Videos
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Trending Topics */}
              <div className="bg-card rounded-lg border p-4">
                <h3 className="font-medium text-foreground mb-3">Trending Today</h3>
                <div className="space-y-2">
                  {['JavaScript', 'React', 'Node.js', 'Python', 'Go'].map((topic, index) => (
                    <Link 
                      key={topic}
                      href={`/posts?category=${topic.toLowerCase()}`}
                      className="flex items-center justify-between py-2 px-3 rounded hover:bg-muted transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground group-hover:text-primary">
                          {topic}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.floor(Math.random() * 50) + 10}k posts
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-card rounded-lg border p-4">
                <h3 className="font-medium text-foreground mb-3">Community Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Members</span>
                    <span className="font-medium">12.5k</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Online</span>
                    <span className="font-medium text-green-500">1.2k</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Posts today</span>
                    <span className="font-medium">87</span>
                  </div>
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