"use client";

import { ArrowRight, MessageCircle, ChevronUp, ChevronDown, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Footer } from "~/components/common/Footer";
import { Header } from "~/components/common/Header";
import { VieShareBanner } from "~/components/common/VieShareBanner";
import { Button } from "~/components/ui/Button";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Post } from '~/lib/types';


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
      <VieShareBanner />

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
                <div className="grid grid-cols-1 gap-3">
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