"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import axios from "axios";
import PocketBase from 'pocketbase';
import { useSession } from "~/lib/authClient";
import { Header } from "~/components/common/Header";
import { Footer } from "~/components/common/Footer";
import { RoadmapPostDetail } from "~/components/features/posts";
import { Comment, Post } from '~/lib/types';
import {
  useLocalizedContent
} from "~/lib/multilingual";

export default function RoadmapPostDetailPage() {
  const { t } = useTranslation();
  const {
    getContent,
    currentLanguage
  } = useLocalizedContent();
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://pocketbase.vietopik.com');

  const [post, setPost] = useState<Post | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Format date to relative time with localization
  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;

      return date.toLocaleDateString();
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
        name: postData.expand?.author?.name || postData.author?.name || t("Anonymous"),
        avatar: postData.expand?.author?.avatar || postData.author?.avatar || "/default-avatar.png",
      },
      likes: postData.likes || 0,
      commentCount: postData.commentCount || 0,
      tags: postData.tags || [],
      comments: [],
      categoryId: postData.categoryId || "",
      category: postData.expand?.categoryId ? {
        id: postData.expand.categoryId.id,
        name: getContent(postData.expand.categoryId, 'name'),
        slug: postData.expand.categoryId.slug,
        color: postData.expand.categoryId.color || "#3B82F6"
      } : undefined,
      created: postData.created,
      expand: postData.expand,
      originalData: postData
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!params.id) return;

        // Fetch all posts first to determine order
        const allPostsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/collections/posts_tbl/records`,
          {
            params: {
              page: 1,
              perPage: 500, // Get a large number to include all posts
              sort: '-created',
              expand: 'author,categoryId'
            }
          }
        );

        const processedPosts = allPostsRes.data.items.map(processPostData).filter(Boolean);
        setAllPosts(processedPosts);

        // Find current post index
        const postIndex = processedPosts.findIndex((p: Post) => p.id === params.id);
        if (postIndex === -1) {
          console.error("Post not found in all posts");
          return;
        }
        setCurrentIndex(postIndex);
        setPost(processedPosts[postIndex]);

        // Fetch comments for this post
        const commentRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections/comments_tbl/records`, {
          params: {
            filter: `postId="${params.id}"`,
            sort: '-created',
            expand: 'userId'
          }
        });

        const processedComments = commentRes.data.items.map((item: any) => ({
          id: item.id,
          userName: item.userName || t("Anonymous"),
          content: item.content || "",
          created: item.created || new Date().toISOString(),
          userAvatar: item.userAvatar || "/default-avatar.png",
          userId: item.userId || "",
          postId: item.postId || ""
        }));

        setComments(processedComments);

      } catch (error) {
        console.error("Error fetching post or comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id, session?.user, currentLanguage]);

  const handleCommentSubmit = async () => {
    if (!commentInput.trim() || submittingComment) return;

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
        lessonId: ""
      };

      const record = await pb.collection('comments_tbl').create(commentData);

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
      setCommentInput("");
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert(t("Failed to post comment. Please try again."));
    } finally {
      setSubmittingComment(false);
    }
  };

  const handlePostComplete = (postId: string, completed: boolean) => {
    // The localStorage handling is now done in the RoadmapPostDetail component
    // This callback can be used for additional logic if needed
    console.log(`Post ${postId} marked as ${completed ? 'completed' : 'incomplete'}`);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < allPosts.length) {
      const nextPost = allPosts[newIndex];
      router.push(`/posts/roadmap/${nextPost.id}`);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="container mx-auto max-w-4xl px-4 py-16">
          <div className="mb-4 rounded-lg bg-card p-4 border animate-pulse">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-muted"></div>
              <div className="ml-3">
                <div className="h-4 w-40 rounded bg-muted"></div>
                <div className="mt-1 h-3 w-24 rounded bg-muted"></div>
              </div>
            </div>
            <div className="mt-4 h-4 w-full rounded bg-muted"></div>
            <div className="mt-2 h-4 w-3/4 rounded bg-muted"></div>
            <div className="mt-4 h-64 w-full rounded bg-muted"></div>
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
        <main className="container mx-auto max-w-4xl px-4 py-16">
          <div className="rounded-lg bg-card p-6 text-center border">
            <h2 className="text-xl font-semibold text-foreground">{t("Post not found")}</h2>
            <p className="mt-2 text-muted-foreground">{t("The post you're looking for might have been removed or is temporarily unavailable.")}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <RoadmapPostDetail
        post={post}
        allPosts={allPosts}
        currentIndex={currentIndex}
        session={session}
        formatRelativeTime={formatRelativeTime}
        onPostComplete={handlePostComplete}
        onNavigate={handleNavigate}
        comments={comments}
        commentInput={commentInput}
        onCommentInputChange={setCommentInput}
        onCommentSubmit={handleCommentSubmit}
        submittingComment={submittingComment}
      />
      <Footer />
    </>
  );
}