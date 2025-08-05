"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import axios from "axios";
import PocketBase from 'pocketbase';
import { useSession } from "~/lib/authClient";
import { Header } from "~/components/common/Header";
import { Footer } from "~/components/common/Footer";
import { MessageCircle, Share2, Bookmark, ChevronLeft, ChevronUp, ChevronDown, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MarkdownRenderer } from "~/components/common/MarkdownRenderer";
import { Comment, Post } from '~/lib/types';
import {
  useLocalizedContent
} from "~/lib/multilingual";

export default function PostDetailPage() {
  const { t, i18n } = useTranslation();
  const {
    getContent,
    currentLanguage
  } = useLocalizedContent();
  const params = useParams();
  const { data: session } = useSession();
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://pocketbase.vietopik.com');

  const [post, setPost] = useState<Post | null>(null);
  const [originalPost, setOriginalPost] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [currentScore, setCurrentScore] = useState(0);

  // Format date to relative time with localization
  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: currentLanguage === 'vi' ? require('date-fns/locale/vi') : require('date-fns/locale/en-US')
      });
    } catch (error) {
      return t("some time ago");
    }
  };

  // Process post data with localization
  const processPostData = (postData: any) => {
    if (!postData) return null;

    return {
      id: postData.id,
      title: getContent(postData, 'title'),
      excerpt: getContent(postData, 'excerpt'),
      content: getContent(postData, 'content'),
      publishedAt: postData.created || postData.publishedAt,
      coverImage: postData.coverImage || "",
      author: {
        name: postData.expand?.author?.name || t("Anonymous"),
        avatar: postData.expand?.author?.avatar || "/default-avatar.png",
      },
      likes: postData.likes || 0,
      commentCount: postData.commentCount || 0,
      tags: postData.tags || [],
      comments: [],
      categoryId: postData.categoryId || "",
      category: postData.expand?.category ? {
        id: postData.expand.category.id,
        name: getContent(postData.expand.category, 'name'),
        slug: postData.expand.category.slug,
        color: postData.expand.category.color || "#3B82F6"
      } : undefined,
      created: postData.created,
      expand: postData.expand,
      originalData: postData
    };
  };


  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        if (!params.id) return;

        // Fetch post data with expanded relations
        const postRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/collections/posts_tbl/records/${params.id}?expand=author,categoryId`
        );

        // Store original post data
        setOriginalPost(postRes.data);

        // Process and set localized post data
        const processedPost = processPostData(postRes.data);
        setPost(processedPost);
        setCurrentScore(postRes.data.likes || 0);

        // Fetch comments
        const commentRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections/comments_tbl/records`, {
          params: {
            filter: `postId="${params.id}"`,
            sort: '-created',
            expand: 'userId'
          }
        });

        type CommentResponseItem = {
          id: string;
          userName?: string;
          content?: string;
          created?: string;
          userAvatar?: string;
          userId?: string;
          postId?: string;
        }

        type CommentMapped = {
          id: string;
          userName: string;
          content: string;
          created: string;
          userAvatar: string;
          userId: string;
          postId: string;
        }

        setComments(
          commentRes.data.items.map((item: CommentResponseItem): CommentMapped => ({
            id: item.id,
            userName: item.userName || t("Anonymous"),
            content: item.content || "",
            created: item.created || new Date().toISOString(),
            userAvatar: item.userAvatar || "/default-avatar.png",
            userId: item.userId || "",
            postId: item.postId || ""
          })) || []
        );


      } catch (error) {
        console.error("Error fetching post or comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostAndComments();

  }, [params.id, session?.user]);

  // Re-process post data when language changes
  useEffect(() => {
    if (originalPost) {
      const processedPost = processPostData(originalPost);
      setPost(processedPost);
    }
  }, [currentLanguage, originalPost, i18n.language]);


  const handleCommentSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!commentInput.trim() || submittingComment) return;

    // Check if user is logged in
    if (!session?.user) {
      alert(t("Please log in to comment."));
      return;
    }

    setSubmittingComment(true);

    try {
      const commentData = {
        postId: Array.isArray(params.id) ? params.id[0] : params.id || "",
        userId: session.user.id,
        userName: session.user.username || session.user.name || t("User"),
        userAvatar: session.user.image || "/default-avatar.png",
        content: commentInput,
        lessonId: "" // Leave empty if not applicable
      };

      const record = await pb.collection('comments_tbl').create(commentData);

      // Add the new comment to the list
      const newComment: Comment = {
        id: record.id,
        postId: commentData.postId,
        userName: commentData.userName,
        content: commentData.content,
        created: new Date().toISOString(),
        userAvatar: commentData.userAvatar,
        userId: commentData.userId
      };

      setComments(prev => [newComment, ...prev]);

      // Update comment count
      if (post) {
        setPost(prev => prev ? { ...prev, commentCount: prev.commentCount + 1 } : null);
      }

      // Clear input
      setCommentInput("");
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert(t("Failed to post comment. Please try again."));
    } finally {
      setSubmittingComment(false);
    }
  };


  const focusCommentInput = () => {
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  const handleVote = (voteType: 'up' | 'down') => {
    if (userVote === voteType) {
      // Remove vote
      setUserVote(null);
      setCurrentScore(prev => voteType === 'up' ? prev - 1 : prev + 1);
    } else {
      // Add/change vote
      const scoreChange = userVote === null 
        ? (voteType === 'up' ? 1 : -1)
        : (voteType === 'up' ? 2 : -2);
      setUserVote(voteType);
      setCurrentScore(prev => prev + scoreChange);
    }
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || post.title,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert(t("Link copied to clipboard!"));
      } catch (error) {
        console.error("Error copying to clipboard:", error);
      }
    }
  };


  if (isLoading) {
    return (
      <>
        <Header />
        <main className="container mx-auto max-w-2xl px-4 py-16">
          <div className="mb-4 rounded-lg bg-white p-4 shadow">
            <div className="flex items-center">
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
              <div className="ml-3">
                <div className="h-4 w-40 animate-pulse rounded bg-gray-200"></div>
                <div className="mt-1 h-3 w-24 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
            <div className="mt-4 h-4 w-full animate-pulse rounded bg-gray-200"></div>
            <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
            <div className="mt-4 h-64 w-full animate-pulse rounded bg-gray-200"></div>
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
        <main className="container mx-auto max-w-2xl px-4 py-16">
          <div className="rounded-lg bg-white p-6 text-center shadow">
            <h2 className="text-xl font-semibold text-gray-800">{t("Post not found")}</h2>
            <p className="mt-2 text-gray-600">{t("The post you're looking for might have been removed or is temporarily unavailable.")}</p>
            <Link href="/posts" className="mt-4 inline-block rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
              {t("Return to Posts")}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-4 pb-10">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/posts" className="mb-4 flex items-center text-sm font-medium text-primary hover:underline">
            <ChevronLeft className="mr-1 h-4 w-4" /> {t("Back to Posts")}
          </Link>

          {/* Reddit-style Post Layout */}
          <div className="bg-card rounded-md border hover:border-muted-foreground/20 transition-colors">
            <div className="flex">
              {/* Left Voting Panel - Reddit Style */}
              <div className="flex flex-col items-center p-3 w-12 bg-muted/30 rounded-l-md">
                <button 
                  onClick={() => handleVote('up')}
                  className={`p-1 rounded hover:bg-muted transition-colors ${
                    userVote === 'up' ? 'text-orange-500' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ChevronUp className="h-6 w-6" />
                </button>
                <span className={`text-sm font-bold px-1 min-w-[2rem] text-center ${
                  currentScore > 0 ? 'text-orange-500' : 
                  currentScore < 0 ? 'text-blue-500' : 
                  'text-muted-foreground'
                }`}>
                  {currentScore > 0 ? `+${currentScore}` : currentScore}
                </span>
                <button 
                  onClick={() => handleVote('down')}
                  className={`p-1 rounded hover:bg-muted transition-colors ${
                    userVote === 'down' ? 'text-blue-500' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ChevronDown className="h-6 w-6" />
                </button>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-4">
                {/* Post Header - Reddit Style */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  {post.category && (
                    <>
                      <Link 
                        href={`/category/${post.category.slug}`} 
                        className="font-medium text-foreground hover:underline"
                      >
                        r/{post.category.name}
                      </Link>
                      <span>•</span>
                    </>
                  )}
                  <span>Posted by</span>
                  <span className="hover:underline cursor-pointer">u/{post.author.name}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatRelativeTime(post.created ?? "")}
                  </span>
                </div>

                {/* Post Title */}
                <h1 className="text-xl font-medium text-foreground mb-3 line-clamp-3">
                  {post.title}
                </h1>

                {/* Post Excerpt */}
                {post.excerpt && (
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}

                {/* Post Cover Image */}
                {post.coverImage && (
                  <div className="relative w-full h-80 mb-4 rounded overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Post Full Content */}
                <div className="max-w-none mb-6">
                  <MarkdownRenderer content={post.content ?? ""} />
                </div>

                {/* Post Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions Bar - Reddit Style */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                  <button 
                    onClick={focusCommentInput}
                    className="flex items-center gap-1 hover:bg-muted px-2 py-1 rounded transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-1 hover:bg-muted px-2 py-1 rounded transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                  <button className="flex items-center gap-1 hover:bg-muted px-2 py-1 rounded transition-colors">
                    <Bookmark className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Section - Reddit Style */}
            <div className="border-t border-border bg-muted/20">
              {/* Comment Input */}
              <div className="p-4 border-b border-border bg-background">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                    {session?.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.username || session.user.name || t("User")}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                        {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <textarea
                      ref={commentInputRef}
                      placeholder={t("What are your thoughts?")}
                      className="w-full p-3 border border-border rounded-md bg-background text-sm resize-vertical min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleCommentSubmit()}
                        disabled={submittingComment || !commentInput.trim()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {submittingComment ? 'Posting...' : 'Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="p-4">
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="h-6 w-6 flex-shrink-0 overflow-hidden rounded-full">
                          {comment.userAvatar && comment.userAvatar !== "/default-avatar.png" ? (
                            <Image
                              src={comment.userAvatar}
                              alt={comment.userName}
                              width={24}
                              height={24}
                              className="h-6 w-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-6 w-6 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                              {comment.userName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <span className="font-medium text-foreground">u/{comment.userName}</span>
                            <span>•</span>
                            <span>{formatRelativeTime(comment.created)}</span>
                          </div>
                          <p className="text-sm text-foreground mb-2">{comment.content}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <button className="flex items-center gap-1 hover:bg-muted px-2 py-1 rounded transition-colors">
                              <ChevronUp className="h-3 w-3" />
                              <span>0</span>
                              <ChevronDown className="h-3 w-3" />
                            </button>
                            <button className="hover:bg-muted px-2 py-1 rounded transition-colors">Reply</button>
                            <button className="hover:bg-muted px-2 py-1 rounded transition-colors">Share</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      {t("No comments yet. Be the first to share what you think!")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}