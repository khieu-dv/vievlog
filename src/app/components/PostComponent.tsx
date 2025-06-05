// PostComponent.jsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { getContrastColor } from '../../lib/utils';
import CommentSection from "./CommentSection";
import { Post } from '../../lib/types';

type PostComponentProps = {
    post: Post;
    session: any;
    formatRelativeTime: (date: string | number | Date) => string;
    commentInputs: Record<string, string>;
    handleCommentInputChange: (postId: string, value: string) => void;
    handleSubmitComment: (postId: string) => void;
    submittingComment: boolean;
    fetchCommentsForPost: (postId: string) => void;
};

const PostComponent: React.FC<PostComponentProps> = ({
    post,
    session,
    formatRelativeTime,
    commentInputs,
    handleCommentInputChange,
    handleSubmitComment,
    submittingComment,
    fetchCommentsForPost
}) => {
    return (
        <div className="mb-4 overflow-hidden rounded-lg bg-white shadow">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    <div className="h-10 w-10 overflow-hidden rounded-full">
                        {post.author.avatar && post.author.avatar !== "/default-avatar.png" ? (
                            <Image
                                src={post.author.avatar}
                                alt={post.author.name}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                                {post.author.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="ml-3">
                        <p className="font-medium text-gray-900">{post.author.name}</p>
                        <p className="text-xs text-gray-500">{formatRelativeTime(post.publishedAt)}</p>
                    </div>
                </div>
                <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-2">
                <Link href={`/posts/${post.id}`}>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900 hover:text-blue-600">{post.title}</h3>
                </Link>
                <p className="mb-4 text-gray-700">{post.excerpt}</p>
            </div>

            {/* Post Image with Category Overlay */}
            {post.coverImage && (
                <div className="relative aspect-video w-full">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                    />
                    {/* Category Badge Overlay - Top Left Corner */}
                    {post.category && (
                        <div className="absolute top-3 left-3 z-10">
                            <Link href={`/categories/${post.category.slug}`}>
                                <span
                                    className="inline-block rounded-full px-3 py-1 text-xs font-medium shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
                                    style={{
                                        backgroundColor: post.category.color,
                                        color: getContrastColor(post.category.color || "#000000")
                                    }}
                                >
                                    {post.category.name}
                                </span>
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* Fallback Category (only show if no image) */}
            {!post.coverImage && post.category && (
                <div className="px-4 mb-2">
                    <Link href={`/categories/${post.category.slug}`}>
                        <span
                            className="inline-block rounded-full px-3 py-1 text-xs font-medium"
                            style={{
                                backgroundColor: post.category.color,
                                color: getContrastColor(post.category.color || "#000000")
                            }}
                        >
                            {post.category.name}
                        </span>
                    </Link>
                </div>
            )}

            {/* Post Tags */}
            {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 px-4 pt-3">
                    {post.tags.map((tag, index) => (
                        <span key={index} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Post Stats */}
            <div className="mt-1 flex items-center justify-between border-b border-gray-100 px-4 py-2">
                <div className="flex items-center text-sm text-gray-500">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                        <Heart size={12} fill="currentColor" />
                    </div>
                    <span className="ml-1">{post.likes}</span>
                </div>
                <div className="text-sm text-gray-500">
                    {post.commentCount} comments
                </div>
            </div>

            {/* Post Actions */}
            <div className="flex border-b border-gray-100 text-gray-500">
                <button className="flex flex-1 items-center justify-center py-3 hover:bg-gray-50">
                    <Heart size={20} className="mr-2" />
                    <span>Like</span>
                </button>
                <button className="flex flex-1 items-center justify-center py-3 hover:bg-gray-50">
                    <MessageCircle size={20} className="mr-2" />
                    <span>Comment</span>
                </button>
                <button className="flex flex-1 items-center justify-center py-3 hover:bg-gray-50">
                    <Share2 size={20} className="mr-2" />
                    <span>Share</span>
                </button>
            </div>

            {/* Comments Section */}
            <CommentSection
                post={post}
                session={session}
                formatRelativeTime={formatRelativeTime}
                commentInputs={commentInputs}
                handleCommentInputChange={handleCommentInputChange}
                handleSubmitComment={handleSubmitComment}
                submittingComment={{ [post.id]: submittingComment }}
                fetchCommentsForPost={fetchCommentsForPost}
            />
        </div>
    );
};

export default PostComponent;