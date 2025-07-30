// posts/PostComponent.jsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Share2, MoreHorizontal, ArrowRight } from "lucide-react";
import { getContrastColor } from '~/lib/utils';
import Comments from "./Comments";
import { Post } from '~/lib/types';

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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
            {/* Post Header */}
            <div className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        {post.author.avatar && post.author.avatar !== "/default-avatar.png" ? (
                            <Image
                                src={post.author.avatar}
                                alt={post.author.name}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900"
                            />
                        ) : (
                            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg ring-2 ring-blue-100 dark:ring-blue-900">
                                {post.author.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                            {post.author.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatRelativeTime(post.publishedAt)}
                        </p>
                    </div>
                </div>
                <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Post Content */}
            <div className="px-6 pb-6">
                <Link href={`/posts/${post.id}`} className="block group">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-3 leading-tight line-clamp-2">
                        {post.title}
                    </h2>
                </Link>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                    {post.excerpt}
                </p>
            </div>

            {/* Post Image with Category Overlay */}
            {post.coverImage && (
                <div className="relative aspect-video w-full group/image">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover/image:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category Badge */}
                    {post.category && (
                        <div className="absolute top-4 left-4 z-10">
                            <Link href={`/categories/${post.category.slug}`} className="group/badge">
                                <span
                                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 group-hover/badge:shadow-2xl"
                                    style={{
                                        backgroundColor: post.category.color,
                                        color: getContrastColor(post.category.color || "#000000")
                                    }}
                                >
                                    <span className="w-2 h-2 rounded-full bg-current opacity-75"></span>
                                    {post.category.name}
                                </span>
                            </Link>
                        </div>
                    )}
                    
                    {/* Read More Overlay */}
                    <Link href={`/posts/${post.id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-sm">
                        <div className="bg-white/20 backdrop-blur-md rounded-full px-6 py-3 text-white font-semibold text-lg border border-white/30 hover:bg-white/30 transition-all duration-200">
                            Read Article
                        </div>
                    </Link>
                </div>
            )}

            {/* Category Badge for posts without images */}
            {!post.coverImage && post.category && (
                <div className="px-6 mb-4">
                    <Link href={`/categories/${post.category.slug}`} className="inline-block group/category">
                        <span
                            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-105 group-hover/category:shadow-lg"
                            style={{
                                backgroundColor: post.category.color,
                                color: getContrastColor(post.category.color || "#000000")
                            }}
                        >
                            <span className="w-2 h-2 rounded-full bg-current opacity-75"></span>
                            {post.category.name}
                        </span>
                    </Link>
                </div>
            )}

            {/* Post Tags */}
            {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 px-6 pb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-900/20 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-200 cursor-pointer">
                            <span className="text-blue-500">#</span>
                            {tag}
                        </span>
                    ))}
                    {post.tags.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                            +{post.tags.length - 3} more
                        </span>
                    )}
                </div>
            )}

            {/* Post Actions & Stats Combined */}
            <div className="border-t border-gray-100 dark:border-gray-700">
                {/* Stats Row */}
                <div className="flex items-center justify-between px-6 py-3 bg-gray-50/50 dark:bg-gray-800/30">
                    <div className="flex items-center gap-6 text-sm">
                        <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Heart size={16} className="text-red-500" fill="currentColor" />
                            <span className="font-medium">{post.likes}</span>
                        </span>
                        <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <MessageCircle size={16} className="text-blue-500" />
                            <span className="font-medium">{post.commentCount}</span>
                        </span>
                    </div>
                    <Link 
                        href={`/posts/${post.id}`} 
                        className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        <span>Read more</span>
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>
                
                {/* Action Buttons */}
                <div className="flex">
                    <button 
                        type="button"
                        className="group flex flex-1 items-center justify-center gap-2 py-3 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                    >
                        <Heart size={18} className="transition-all duration-200 group-hover:scale-110 group-hover:fill-current" />
                        <span className="text-sm font-medium">Like</span>
                    </button>
                    
                    <button 
                        type="button"
                        className="group flex flex-1 items-center justify-center gap-2 py-3 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 border-l border-r border-gray-200 dark:border-gray-600"
                    >
                        <MessageCircle size={18} className="transition-all duration-200 group-hover:scale-110" />
                        <span className="text-sm font-medium">Comment</span>
                    </button>
                    
                    <button 
                        type="button"
                        className="group flex flex-1 items-center justify-center gap-2 py-3 text-gray-500 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/10 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200"
                    >
                        <Share2 size={18} className="transition-all duration-200 group-hover:scale-110" />
                        <span className="text-sm font-medium">Share</span>
                    </button>
                </div>
            </div>

            {/* Comments Section - Only show if there are comments */}
            {post.comments && post.comments.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/20">
                    <Comments
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
            )}
        </div>
    );
};

export default PostComponent;