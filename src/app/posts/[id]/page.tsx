"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Header } from "~/ui/components/header";
import { Footer } from "~/ui/components/footer";
import { Button } from "~/ui/primitives/button";
import { Input } from "~/ui/primitives/input";
import { Textarea } from "~/ui/primitives/textarea";
import {
  MessageCircle,
  ThumbsUp,
  Calendar,
  Tag,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

export default function PostDetailPage() {
  const { t } = useTranslation();
  const params = useParams();

  interface Post {
    coverImage: string;
    title: string;
    created: string;
    content: string;
    expand?: {
      author?: {
        avatar: string;
        name: string;
      };
    };
  }

  const [post, setPost] = useState<Post | null>(null);
  interface Comment {
    id: string;
    name: string;
    content: string;
    created: string;
    avatar?: string;
  }

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    content: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        if (!params.id) return;

        // Fetch post detail
        const postRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/collections/posts_tbl/records/${params.id}`
        );

        setPost(postRes.data);

        // Fetch related comments (filter by post ID)
        const commentRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/collections/comments_tbl/records?filter=post="${params.id}"`
        );

        setComments(commentRes.data.items || []);
      } catch (error) {
        console.error("Error fetching post or comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostAndComments();
  }, [params.id]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setNewComment((prev) => ({ ...prev, [name]: value }));
  };

  interface CommentData {
    name: string;
    email?: string;
    content: string;
    post: string;
  }

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!newComment.name || !newComment.content) {
      alert("Please provide your name and comment");
      return;
    }

    try {
      const commentData: CommentData = {
        name: newComment.name,
        email: newComment.email,
        content: newComment.content,
        post: Array.isArray(params.id) ? params.id[0] : params.id || "",
      };

      await axios.post(
        `https://your-pocketbase-domain/api/collections/comments/records`,
        commentData
      );

      // Re-fetch comments
      const res = await axios.get(
        `https://your-pocketbase-domain/api/collections/comments/records?filter=post="${params.id}"`
      );
      setComments(res.data.items || []);
      setNewComment({ name: "", email: "", content: "" });
    } catch (err) {
      console.error("Failed to submit comment", err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!post) {
    return <div className="text-center py-10">Post not found</div>;
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/posts" className="flex items-center mb-4 text-sm text-gray-600 hover:underline">
          <ChevronLeft className="w-4 h-4 mr-1" /> {t("Back to Posts")}
        </Link>
        <div className="mb-4">
          <Image
            src={post.coverImage}
            alt="Post Cover"
            width={800}
            height={400}
            className="rounded-lg object-cover w-full h-64"
          />
        </div>
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500 flex items-center mb-4">
          <Calendar className="w-4 h-4 mr-1" />
          {format(new Date(post.created), "PPP")}
        </p>
        <div className="flex items-center mb-4">
          <Image
            src={post.expand?.author?.avatar || "/default-avatar.png"}
            alt={post.expand?.author?.name || "Author's name not available"}
            width={40}
            height={40}
            className="rounded-full mr-3"
          />
          <span className="font-medium">{post.expand?.author?.name}</span>
        </div>
        <div className="prose prose-lg max-w-none mb-8 whitespace-pre-wrap">
          {post.content}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("Comments")}</h2>
          {comments.length === 0 ? (
            <p>{t("No comments yet.")}</p>
          ) : (
            <ul className="space-y-4">
              {comments.map((comment) => (
                <li key={comment.id} className="border p-3 rounded-md">
                  <div className="flex items-center mb-2">
                    <Image
                      src={comment.avatar || "/default-avatar.png"}
                      alt={comment.name}
                      width={30}
                      height={30}
                      className="rounded-full mr-2"
                    />
                    <strong>{comment.name}</strong>
                    <span className="ml-2 text-xs text-gray-500">
                      {format(new Date(comment.created), "PPP p")}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handleCommentSubmit} className="space-y-4">
          <Input
            placeholder="Your name"
            name="name"
            value={newComment.name}
            onChange={handleCommentChange}
            required
          />
          <Input
            type="email"
            placeholder="Your email (optional)"
            name="email"
            value={newComment.email}
            onChange={handleCommentChange}
          />
          <Textarea
            placeholder="Your comment"
            name="content"
            value={newComment.content}
            onChange={handleCommentChange}
            required
          />
          <Button type="submit">{t("Submit Comment")}</Button>
        </form>
      </main>
      <Footer />
    </>
  );
}
