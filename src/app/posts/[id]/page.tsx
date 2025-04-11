"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import axios from "axios";
import PocketBase from 'pocketbase';
import { useSession } from "../../../lib/auth-client_v2";
import { Header } from "~/ui/components/header";
import { Footer } from "~/ui/components/footer";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ChevronLeft, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function PostDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const commentInputRef = useRef<HTMLInputElement>(null);
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://pocketbase.vietopik.com');

  interface Post {
    id: string;
    coverImage: string;
    title: string;
    excerpt: string;
    content: string;
    created: string;
    likes: number;
    tags?: string[];
    expand?: {
      author?: {
        avatar: string;
        name: string;
      };
    };
  }

  interface Comment {
    id: string;
    userName: string;
    content: string;
    created: string;
    userAvatar?: string;
    userId?: string;
  }

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "some time ago";
    }
  };

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        if (!params.id) return;

        // Fetch post data
        const postRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/collections/posts_tbl/records/${params.id}?expand=author`
        );
        setPost(postRes.data);
        setLikeCount(postRes.data.likes || 0);

        const commentRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections/comments_tbl/records`, {
          params: {
            filter: `postId="${params.id}"`,
            sort: '-created'
          }
        });


        interface CommentResponseItem {
          id: string;
          userName?: string;
          content?: string;
          created?: string;
          userAvatar?: string;
          userId?: string;
        }

        interface CommentMapped {
          id: string;
          userName: string;
          content: string;
          created: string;
          userAvatar: string;
          userId: string;
        }

        setComments(
          commentRes.data.items.map((item: CommentResponseItem): CommentMapped => ({
            id: item.id,
            userName: item.userName || "Anonymous",
            content: item.content || "",
            created: item.created || new Date().toISOString(),
            userAvatar: item.userAvatar || "/default-avatar.png",
            userId: item.userId || ""
          })) || []
        );
      } catch (error) {
        console.error("Error fetching post or comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostAndComments();
  }, [params.id]);

  const handleCommentSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!commentInput.trim() || submittingComment) return;

    // Check if user is logged in
    if (!session?.user) {
      alert("Please log in to comment.");
      return;
    }

    setSubmittingComment(true);

    try {
      const commentData = {
        postId: Array.isArray(params.id) ? params.id[0] : params.id || "",
        userId: session.user.id,
        userName: session.user.name || "User",
        userAvatar: session.user.image || "/default-avatar.png",
        content: commentInput,
        lessonId: "" // Leave empty if not applicable
      };

      const record = await pb.collection('comments_tbl').create(commentData);

      // Add the new comment to the list
      setComments(prev => [...prev, {
        id: record.id,
        userName: commentData.userName,
        content: commentData.content,
        created: new Date().toISOString(),
        userAvatar: commentData.userAvatar,
        userId: commentData.userId
      }]);

      // Clear input
      setCommentInput("");
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLike = () => {
    // In a real application, you would send this to your backend
    if (hasLiked) {
      setLikeCount(prev => Math.max(0, prev - 1));
    } else {
      setLikeCount(prev => prev + 1);
    }
    setHasLiked(!hasLiked);
  };

  const focusCommentInput = () => {
    if (commentInputRef.current) {
      commentInputRef.current.focus();
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
            <p className="mt-2 text-gray-600">The post you're looking for might have been removed or is temporarily unavailable.</p>
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

          {/* Post Card - Facebook Style */}
          <div className="mb-4 overflow-hidden rounded-lg bg-white shadow">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={post.expand?.author?.avatar || "/default-avatar.png"}
                    alt={post.expand?.author?.name || "Author"}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{post.expand?.author?.name || "Anonymous"}</p>
                  <p className="text-xs text-gray-500">{formatRelativeTime(post.created)}</p>
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

            {/* Post Full Content */}
            <div className="whitespace-pre-wrap px-4 pb-4 text-gray-800">
              {post.content}
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
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                  <Heart size={12} fill="currentColor" />
                </div>
                <span className="ml-1">{likeCount}</span>
              </div>
              <div className="text-sm text-gray-500">
                {comments.length} comments
              </div>
            </div>

            {/* Post Actions */}
            <div className="flex border-b border-t border-gray-100 text-gray-600">
              <button
                onClick={handleLike}
                className={`flex flex-1 items-center justify-center py-3 hover:bg-gray-50 ${hasLiked ? 'text-blue-500 font-medium' : ''}`}
              >
                <Heart size={20} className="mr-2" fill={hasLiked ? "currentColor" : "none"} />
                <span>Like</span>
              </button>
              <button onClick={focusCommentInput} className="flex flex-1 items-center justify-center py-3 hover:bg-gray-50">
                <MessageCircle size={20} className="mr-2" />
                <span>Comment</span>
              </button>
              <button className="flex flex-1 items-center justify-center py-3 hover:bg-gray-50">
                <Share2 size={20} className="mr-2" />
                <span>Share</span>
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
                    <div className="ml-2">
                      <div className="rounded-2xl bg-gray-100 px-3 py-2">
                        <p className="text-sm font-medium text-gray-900">{comment.userName}</p>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                      <div className="mt-1 flex items-center space-x-3 pl-2 text-xs text-gray-500">
                        <span>{formatRelativeTime(comment.created)}</span>
                        <button className="font-medium">Like</button>
                        <button className="font-medium">Reply</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-2 text-center text-sm text-gray-500">{t("No comments yet. Be the first to comment!")}</p>
              )}
            </div>

            {/* Comment Box */}
            <div className="flex items-center p-4">
              <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="ml-2 flex flex-grow items-center rounded-full bg-gray-100 pr-2">
                <input
                  type="text"
                  ref={commentInputRef}
                  placeholder="Write a comment..."
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
                  className="flex h-8 w-8 items-center justify-center rounded-full text-blue-500 hover:bg-blue-50 disabled:opacity-50"
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

          {/* Related Posts - Optional */}
          {/* <div className="mt-8 rounded-lg bg-white p-4 shadow">
            <h2 className="mb-4 text-lg font-semibold">Related Posts</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="overflow-hidden rounded border">
                  <div className="h-32 bg-gray-200"></div>
                  <div className="p-3">
                    <h3 className="font-medium">Related Post Title {i}</h3>
                    <p className="mt-1 text-xs text-gray-500">4 days ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </main>
      <Footer />
    </div>
  );
}