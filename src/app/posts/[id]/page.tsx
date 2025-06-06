"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import axios from "axios";
import PocketBase from 'pocketbase';
import { useSession } from "../../../lib/auth-client";
import { Header } from "~/ui/components/header";
import { Footer } from "~/ui/components/footer";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ChevronLeft, Send, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MarkdownRenderer } from "../../components/MarkdownRenderer";
import { Comment, Post } from '../../../lib/types';
import {
  useLocalizedContent,
  getSupportedLanguageCodes
} from "../../../utils/multilingual";

export default function PostDetailPage() {
  const { t, i18n } = useTranslation();
  const {
    getContent,
    currentLanguage,
    getSupportedLanguages,
    getCurrentLanguageInfo,
    isLanguageSupported: checkLanguageSupport
  } = useLocalizedContent();
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const commentInputRef = useRef<HTMLInputElement>(null);
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://pocketbase.vietopik.com');

  const [post, setPost] = useState<Post | null>(null);
  const [originalPost, setOriginalPost] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

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

  // Get language statistics
  const getLanguageStats = () => {
    const stats = {
      currentLanguage: getCurrentLanguageInfo(),
      totalLanguages: getSupportedLanguages().length,
      isCurrentLanguageSupported: checkLanguageSupport(currentLanguage)
    };
    return stats;
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
        setLikeCount(postRes.data.likes || 0);

        // Fetch comments
        const commentRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections/comments_tbl/records`, {
          params: {
            filter: `postId="${params.id}"`,
            sort: '-created',
            expand: 'userId'
          }
        });

        interface CommentResponseItem {
          id: string;
          userName?: string;
          content?: string;
          created?: string;
          userAvatar?: string;
          userId?: string;
          postId?: string;
        }

        interface CommentMapped {
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

        // Check if user has liked this post (you'll need to implement this based on your like system)
        if (session?.user) {
          checkUserLikeStatus(postRes.data.id, session.user.id);
        }

      } catch (error) {
        console.error("Error fetching post or comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostAndComments();

    // Set available languages
    setAvailableLanguages(getSupportedLanguageCodes());
  }, [params.id, session?.user]);

  // Re-process post data when language changes
  useEffect(() => {
    if (originalPost) {
      const processedPost = processPostData(originalPost);
      setPost(processedPost);
    }
  }, [currentLanguage, originalPost, i18n.language]);

  // Check if user has liked the post
  const checkUserLikeStatus = async (postId: string, userId: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections/likes_tbl/records`, {
        params: {
          filter: `postId="${postId}" && userId="${userId}"`
        }
      });
      setHasLiked(response.data.items.length > 0);
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

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

  const handleLike = async () => {
    if (!session?.user) {
      alert(t("Please log in to like this post."));
      return;
    }

    try {
      if (hasLiked) {
        // Unlike the post
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections/likes_tbl/records`, {
          params: {
            filter: `postId="${post?.id}" && userId="${session.user.id}"`
          }
        });

        if (response.data.items.length > 0) {
          await pb.collection('likes_tbl').delete(response.data.items[0].id);
          setLikeCount(prev => Math.max(0, prev - 1));
          setHasLiked(false);
        }
      } else {
        // Like the post
        await pb.collection('likes_tbl').create({
          postId: post?.id,
          userId: session.user.id
        });
        setLikeCount(prev => prev + 1);
        setHasLiked(true);
      }

      // Update the post's like count in the database
      if (post?.id) {
        await pb.collection('posts_tbl').update(post.id, {
          likes: hasLiked ? Math.max(0, likeCount - 1) : likeCount + 1
        });
      }
    } catch (error) {
      console.error("Error updating like:", error);
      alert(t("Failed to update like. Please try again."));
    }
  };

  const focusCommentInput = () => {
    if (commentInputRef.current) {
      commentInputRef.current.focus();
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

  // Get language stats for display
  const languageStats = getLanguageStats();

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
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="pt-16 pb-10">
        <div className="container mx-auto max-w-2xl px-4">
          <Link href="/posts" className="mb-4 flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
            <ChevronLeft className="mr-1 h-4 w-4" /> {t("Back to Posts")}
          </Link>

          {/* Language Notification Banner */}
          <div className="mb-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-900">
                  {t("Language & Content Information")}
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p className="mb-1">
                    {t("This content is displayed in {{language}}", {
                      language: languageStats.currentLanguage.label
                    })}
                  </p>
                  <p className="text-xs text-blue-600">
                    {t("Available in {{count}} languages", {
                      count: languageStats.totalLanguages
                    })} •
                    {t("Switch language in the header to view content in your preferred language")}
                  </p>
                </div>
                {!languageStats.isCurrentLanguageSupported && (
                  <div className="mt-2 rounded-md bg-yellow-50 border border-yellow-200 p-2">
                    <p className="text-xs text-yellow-800">
                      {t("Some content may not be fully translated in this language")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Post Card - Facebook Style */}
          <div className="mb-4 overflow-hidden rounded-lg bg-white shadow">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={post.author.avatar || "/default-avatar.png"}
                    alt={post.author.name || t("Author")}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{post.author.name}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{formatRelativeTime(post.created ?? "")}</span>
                    {post.category && (
                      <>
                        <span className="mx-1">•</span>
                        <span
                          className="rounded px-2 py-1 text-white"
                          style={{ backgroundColor: post.category.color }}
                        >
                          {post.category.name}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
              <h1 className="mb-2 text-xl font-semibold text-gray-900">{post.title}</h1>
              {post.excerpt && <p className="mb-3 text-gray-700">{post.excerpt}</p>}
            </div>

            {/* Post Cover Image */}
            {post.coverImage && (
              <div className="relative mb-3 w-full">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={1200}
                  height={630}
                  className="w-full object-cover"
                />
              </div>
            )}

            {/* Post Full Content - Using Markdown Renderer */}
            <div className="px-4 pb-4">
              <MarkdownRenderer content={post.content ?? ""} />
            </div>

            {/* Post Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t border-gray-100 px-4 py-3">
                {post.tags.map((tag, index) => (
                  <span key={index} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Post Stats */}
            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2">
              <div className="flex items-center text-sm text-gray-500">
                {likeCount > 0 && (
                  <>
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                      <Heart size={12} fill="currentColor" />
                    </div>
                    <span className="ml-1">{likeCount}</span>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {comments.length} {t("comments")}
              </div>
            </div>

            {/* Post Actions */}
            <div className="flex border-b border-t border-gray-100 text-gray-600">
              <button
                onClick={handleLike}
                className={`flex flex-1 items-center justify-center py-3 hover:bg-gray-50 transition-colors ${hasLiked ? 'text-blue-500 font-medium' : ''
                  }`}
              >
                <Heart size={20} className="mr-2" fill={hasLiked ? "currentColor" : "none"} />
                <span>{t("Like")}</span>
              </button>
              <button
                onClick={focusCommentInput}
                className="flex flex-1 items-center justify-center py-3 hover:bg-gray-50 transition-colors"
              >
                <MessageCircle size={20} className="mr-2" />
                <span>{t("Comment")}</span>
              </button>
              <button
                onClick={handleShare}
                className="flex flex-1 items-center justify-center py-3 hover:bg-gray-50 transition-colors"
              >
                <Share2 size={20} className="mr-2" />
                <span>{t("Share")}</span>
              </button>
            </div>

            {/* Comments Section */}
            <div className="border-b border-gray-100 px-4 py-2">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="mb-3 flex">
                    <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                      {comment.userAvatar && comment.userAvatar !== "/default-avatar.png" ? (
                        <Image
                          src={comment.userAvatar}
                          alt={comment.userName}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                          {comment.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="ml-2 flex-1">
                      <div className="rounded-2xl bg-gray-100 px-3 py-2">
                        <p className="text-sm font-medium text-gray-900">{comment.userName}</p>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                      <div className="mt-1 flex items-center space-x-3 pl-2 text-xs text-gray-500">
                        <span>{formatRelativeTime(comment.created)}</span>
                        <button className="font-medium hover:underline">{t("Like")}</button>
                        <button className="font-medium hover:underline">{t("Reply")}</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-sm text-gray-500">
                  {t("No comments yet. Be the first to comment!")}
                </p>
              )}
            </div>

            {/* Comment Box */}
            <div className="flex items-center p-4">
              <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.username || session.user.name || t("User")}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                    {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className="ml-2 flex flex-grow items-center rounded-full bg-gray-100 pr-2">
                <input
                  type="text"
                  ref={commentInputRef}
                  placeholder={t("Write a comment...")}
                  className="flex-grow bg-transparent px-4 py-2 text-sm outline-none"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCommentSubmit();
                    }
                  }}
                />
                <button
                  onClick={() => handleCommentSubmit()}
                  disabled={submittingComment || !commentInput.trim()}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-blue-500 hover:bg-blue-50 disabled:opacity-50 transition-colors"
                >
                  {submittingComment ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}