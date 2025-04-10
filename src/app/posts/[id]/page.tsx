// app/posts/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Header } from "~/ui/components/header";
import { Footer } from "~/ui/components/footer";
import { Button } from "~/ui/primitives/button";
import { Input } from "~/ui/primitives/input";
import { Textarea } from "~/ui/primitives/textarea";
import { MessageCircle, ThumbsUp, Calendar, Tag, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";

export default function PostDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  interface Post {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    publishedAt: string;
    coverImage: string;
    author: {
      name: string;
      avatar: string;
    };
    likes: number;
    commentCount: number;
    tags: string[];
  }

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  interface Comment {
    id: string;
    name: string;
    content: string;
    publishedAt: string;
    avatar: string;
  }

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ name: "", email: "", content: "" });

  useEffect(() => {
    // In a real application, you would fetch from an API based on params.id
    // This is mock data for demonstration
    setTimeout(() => {
      // Mock post data
      const postsData = [
        {
          id: "1",
          title: "Getting Started with TOPIK I: A Beginner's Guide",
          excerpt: "TOPIK I is designed for beginners to intermediate Korean language learners. This guide will help you understand what to expect and how to prepare effectively for the test.",
          content: "TOPIK I is designed for beginners to intermediate Korean language learners. This guide will help you understand what to expect and how to prepare effectively for the test. The TOPIK I test consists of two sections: Listening and Reading. Each section tests different aspects of your Korean language proficiency.\n\nIn the Listening section, you'll be tested on your ability to understand spoken Korean in various contexts, from simple conversations to announcements and short talks. The Reading section assesses your ability to read and understand written Korean, including vocabulary, grammar, and comprehension.\n\nTo prepare for TOPIK I, it's recommended to:\n1. Study basic Korean vocabulary and grammar\n2. Practice listening to Korean conversations, news, or podcasts\n3. Read Korean texts regularly, from simple sentences to short paragraphs\n4. Take practice tests to familiarize yourself with the test format\n5. Join study groups or language exchange programs to practice with others",
          publishedAt: "2025-03-15T10:00:00Z",
          coverImage: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          author: {
            name: "Min-Ji Kim",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          },
          likes: 42,
          commentCount: 8,
          tags: ["TOPIK I", "Beginner", "Study Guide"]
        },
        {
          id: "2",
          title: "Advanced Korean Grammar Patterns for TOPIK II",
          excerpt: "This post explores complex grammar patterns that frequently appear in TOPIK II tests. Master these patterns to improve your score significantly.",
          content: "This post explores complex grammar patterns that frequently appear in TOPIK II tests. Master these patterns to improve your score significantly.\n\nTOPIK II tests advanced Korean language skills, and a solid understanding of complex grammar patterns is essential for achieving a high score. Here, we'll dive into some of the most frequently tested grammar patterns in the TOPIK II exam.\n\n1. -는 바와 같이 (as mentioned earlier/as stated)\n2. -는 한 (as long as/to the extent that)\n3. -는 커녕 (far from/let alone)\n4. -는 반면에 (while/whereas)\n5. -더니만 (had been doing and then)\n\nEach of these patterns has specific usage rules and nuances that you need to understand to use them correctly. We'll examine each pattern in detail, providing examples and practice exercises to help you master them.",
          publishedAt: "2025-03-10T14:30:00Z",
          coverImage: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          author: {
            name: "Sung-Ho Park",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          },
          likes: 35,
          commentCount: 12,
          tags: ["TOPIK II", "Advanced", "Grammar"]
        },
        {
          id: "3",
          title: "Common Mistakes to Avoid in TOPIK Reading Section",
          excerpt: "Learn about the typical errors made by test-takers in the reading comprehension section and how to avoid them in your preparation.",
          content: "Learn about the typical errors made by test-takers in the reading comprehension section and how to avoid them in your preparation.\n\nThe reading section of the TOPIK test can be challenging, especially under time pressure. Many test-takers make common mistakes that can be easily avoided with proper awareness and preparation. Here are the most frequent errors to watch out for:\n\n1. Misinterpreting the question: Always read the question carefully to understand exactly what is being asked.\n\n2. Falling for distractors: Test creators often include answer choices that contain words from the text but don't actually answer the question.\n\n3. Focusing too much on unknown words: Don't get stuck on vocabulary you don't know. Try to understand the overall meaning from context.\n\n4. Poor time management: The reading section requires efficient time use. Don't spend too much time on difficult questions.\n\n5. Ignoring context clues: The surrounding sentences often provide important context for understanding difficult passages.\n\nBy being aware of these common pitfalls and practicing strategies to avoid them, you can significantly improve your performance on the TOPIK reading section.",
          publishedAt: "2025-03-05T09:15:00Z",
          coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          author: {
            name: "Ji-Woo Lee",
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          },
          likes: 27,
          commentCount: 6,
          tags: ["TOPIK", "Reading", "Test Preparation"]
        }
      ];

      // Mock comments
      const commentsData = {
        "1": [
          {
            id: "c1",
            name: "Hana Kim",
            content: "This guide was incredibly helpful! I've been struggling with how to approach my TOPIK I studies, and this gave me a clear roadmap. Thank you!",
            publishedAt: "2025-03-16T15:20:00Z",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          },
          {
            id: "c2",
            name: "Thomas Lee",
            content: "Could you recommend any specific textbooks that are good for TOPIK I preparation?",
            publishedAt: "2025-03-16T16:45:00Z",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          }
        ],
        "2": [
          {
            id: "c3",
            name: "Jin-Young Park",
            content: "The explanations for these grammar patterns are so clear! I've been confused about '-는 한' for ages, and now I finally get it.",
            publishedAt: "2025-03-11T09:30:00Z",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          }
        ],
        "3": [
          {
            id: "c4",
            name: "Sarah Johnson",
            content: "I'm definitely guilty of getting stuck on unknown words. These tips are really practical - thanks!",
            publishedAt: "2025-03-07T11:15:00Z",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          }
        ]
      };

      const foundPost = postsData.find(p => p.id === params.id);
      setPost(foundPost || null);
      if (params.id) {
        setComments(commentsData[params.id as keyof typeof commentsData] || []);
      }
      setIsLoading(false);
    }, 1000);
  }, [params.id]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    setNewComment(prev => ({ ...prev, [name]: value }));
  };

  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!newComment.name || !newComment.content) {
      alert("Please provide your name and comment");
      return;
    }

    interface NewComment {
      id: string;
      name: string;
      content: string;
      publishedAt: string;
      avatar: string;
    }

    // In a real app, you would send this to an API
    const newCommentObj: NewComment = {
      id: `c${Date.now()}`,
      name: newComment.name,
      content: newComment.content,
      publishedAt: new Date().toISOString(),
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    };

    setComments((prev: Comment[]) => [newCommentObj, ...prev]);
    setPost((prev: Post | null) => {
      if (!prev) return prev; // Ensure prev is not null
      return {
        ...prev,
        commentCount: prev.commentCount + 1
      };
    });
    setNewComment({ name: "", email: "", content: "" });
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-3/4 rounded bg-muted"></div>
              <div className="h-4 w-1/2 rounded bg-muted"></div>
              <div className="h-64 rounded bg-muted"></div>
              <div className="space-y-2">
                <div className="h-4 rounded bg-muted"></div>
                <div className="h-4 rounded bg-muted"></div>
                <div className="h-4 w-5/6 rounded bg-muted"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
              <h1 className="text-2xl font-bold text-destructive">Post Not Found</h1>
              <p className="mt-2 text-muted-foreground">The post you're looking for doesn't exist or has been removed.</p>
              <Link href="/posts">
                <Button variant="outline" className="mt-4">
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back to Posts
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="bg-background pb-12 pt-8 md:pb-16 md:pt-12">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Link href="/posts" className="mb-6 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
              <ChevronLeft className="mr-1 h-4 w-4" /> Back to all posts
            </Link>

            <header className="mb-8">
              <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{post.title}</h1>

              <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span>{post.author.name}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.publishedAt}>
                    {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                  </time>
                </div>

                <div className="flex items-center gap-3">
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

              {post.coverImage && (
                <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </header>

            <div className="prose prose-lg max-w-none">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {post.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/posts?tag=${encodeURIComponent(tag)}`}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium hover:bg-muted/80"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-12">
              <h2 className="mb-6 text-2xl font-bold">Comments ({comments.length})</h2>

              <div className="mb-8 rounded-lg border bg-card p-6">
                <h3 className="mb-4 text-lg font-medium">Leave a comment</h3>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1 block text-sm font-medium">
                        Name <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={newComment.name}
                        onChange={handleCommentChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1 block text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={newComment.email}
                        onChange={handleCommentChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="content" className="mb-1 block text-sm font-medium">
                      Comment <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      id="content"
                      name="content"
                      rows={4}
                      value={newComment.content}
                      onChange={handleCommentChange}
                      required
                    />
                  </div>
                  <Button type="submit">Submit Comment</Button>
                </form>
              </div>

              {comments.length > 0 ? (
                <div className="space-y-6">
                  {comments.map(comment => (
                    <div key={comment.id} className="rounded-lg border bg-card p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="relative h-8 w-8 overflow-hidden rounded-full">
                          <Image
                            src={comment.avatar}
                            alt={comment.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{comment.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.publishedAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border bg-card p-6 text-center">
                  <p className="text-muted-foreground">Be the first to leave a comment!</p>
                </div>
              )}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}