// app/posts/page.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { Header } from "~/ui/components/header";
import { Footer } from "~/ui/components/footer";
import { useTranslation } from "react-i18next";
import axios from "axios";
import PocketBase from 'pocketbase';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "../../lib/auth-client_v2";

export default function PostsPage() {
    const { t } = useTranslation();
    const loadMoreRef = useRef(null);
    const { data: session } = useSession();
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://pocketbase.vietopik.com');

    interface Comment {
        id: string;
        postId: string;
        userId: string;
        userName: string;
        userAvatar: string;
        content: string;
        created: string;
    }

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
        comments?: Comment[];
    }

    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
    const [submittingComment, setSubmittingComment] = useState<{ [key: string]: boolean }>({});
    const postsPerPage = 20;
    const [commentPages, setCommentPages] = useState<{ [key: string]: number }>({});


    const fetchPosts = async (pageNumber: number) => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/collections/posts_tbl/records`, {
                params: {
                    page: pageNumber,
                    perPage: postsPerPage,
                    //  sort: '-publishedAt'
                }
            }
            );

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
                comments: []
            }));

            if (pageNumber === 1) {
                setPosts(mappedPosts);
            } else {
                setPosts(prevPosts => [...prevPosts, ...mappedPosts]);
            }

            setHasMore(mappedPosts.length === postsPerPage);

            // Fetch comments for each post
            mappedPosts.forEach((post: Post) => {
                fetchCommentsForPost(post.id);
            });

        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Sửa lại function fetchCommentsForPost để hỗ trợ phân trang
    const fetchCommentsForPost = async (postId: string, reset: boolean = false) => {
        try {
            const currentPage = reset ? 1 : (commentPages[postId] || 1);

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections/comments_tbl/records`, {
                params: {
                    page: currentPage,
                    perPage: 5,
                    filter: `postId="${postId}"`,
                    sort: '-created'
                }
            });

            // Cập nhật số trang cho bài đăng này
            setCommentPages(prev => ({
                ...prev,
                [postId]: currentPage + 1
            }));

            // Cập nhật comments cho post
            setPosts(prevPosts => {
                return prevPosts.map(post => {
                    if (post.id === postId) {
                        // Nếu reset hoặc đây là trang đầu tiên, thay thế comments
                        // Nếu không, thêm comments mới vào cuối danh sách hiện có
                        const updatedComments = currentPage === 1 || reset
                            ? response.data.items.map(mapCommentFromApi)
                            : [...(post.comments || []), ...response.data.items.map(mapCommentFromApi)];

                        return {
                            ...post,
                            comments: updatedComments,
                            commentCount: response.data.totalItems
                        };
                    }
                    return post;
                });
            });
        } catch (error) {
            console.error(`Failed to fetch comments for post ${postId}:`, error);
        }
    };

    // Helper function để map dữ liệu comment từ API
    const mapCommentFromApi = (item: any) => ({
        id: item.id,
        postId: item.postId,
        userId: item.userId,
        userName: item.userName,
        userAvatar: item.userAvatar,
        content: item.content,
        created: item.created,
    });

    const handleCommentInputChange = (postId: string, value: string) => {
        setCommentInputs(prev => ({
            ...prev,
            [postId]: value
        }));
    };

    const handleSubmitComment = async (postId: string) => {
        const content = commentInputs[postId];
        if (!content?.trim() || submittingComment[postId]) return;

        // Check if user is logged in
        if (!session?.user) {
            alert("Please log in to comment.");
            return;
        }

        setSubmittingComment(prev => ({
            ...prev,
            [postId]: true
        }));

        try {
            const commentData = {
                postId: postId,
                userId: session.user.id,
                userName: session.user.name || "User",
                userAvatar: session.user.image || "/default-avatar.png",
                content: content,
                lessonId: "" // Leave empty if not applicable
            };

            const record = await pb.collection('comments_tbl').create(commentData);

            // Clear input
            setCommentInputs(prev => ({
                ...prev,
                [postId]: ""
            }));

            // Refresh comments for this post
            fetchCommentsForPost(postId);

            // Update comment count
            setPosts(prevPosts => {
                return prevPosts.map(post => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            commentCount: (post.commentCount || 0) + 1
                        };
                    }
                    return post;
                });
            });
        } catch (error) {
            console.error("Failed to post comment:", error);
            alert("Failed to post comment. Please try again.");
        } finally {
            setSubmittingComment(prev => ({
                ...prev,
                [postId]: false
            }));
        }
    };

    useEffect(() => {
        fetchPosts(1);
    }, []);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPosts(nextPage);
    };

    // Format date to relative time (e.g., "2 hours ago")
    interface FormatRelativeTime {
        (dateString: string): string;
    }

    const formatRelativeTime: FormatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;

        return date.toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="pt-16 pb-10">
                <div className="container mx-auto max-w-2xl px-4">
                    {/* Page Header */}
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Korean Language Learning</h1>
                        <p className="mt-2 text-gray-600">
                            Explore our latest articles, tips and techniques for mastering Korean
                        </p>
                    </div>

                    {/* Posts Feed */}
                    {posts.length === 0 && isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="mb-4 rounded-lg bg-white p-4 shadow">
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
                        ))
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className="mb-4 overflow-hidden rounded-lg bg-white shadow">
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

                                {/* Post Image */}
                                {post.coverImage && (
                                    <div className="relative aspect-video w-full">
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover"
                                        />
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
                                {post.comments && post.comments.length > 0 && (
                                    <div className="border-b border-gray-100 px-4 py-2">
                                        {post.comments.map((comment) => (
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
                                                            {(comment.userName || "User").charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    {/* 
                                                    <Image
                                                        src={comment.userAvatar || "/default-avatar.png"}
                                                        alt={comment.userName}
                                                        width={32}
                                                        height={32}
                                                        className="h-full w-full object-cover"
                                                    /> */}
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
                                        ))}

                                        {post.commentCount > (post.comments?.length || 0) && (
                                            <button
                                                onClick={() => fetchCommentsForPost(post.id)}
                                                className="mt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
                                            >
                                                View more comments
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Comment Box */}
                                <div className="flex items-center p-4">
                                    <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                                        {session?.user?.image && (
                                            <Image
                                                src={session.user.image}
                                                alt={session.user.name || "User"}
                                                width={32}
                                                height={32}
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="ml-2 flex flex-grow items-center rounded-full bg-gray-100 pr-2">
                                        <input
                                            type="text"
                                            placeholder="Write a comment..."
                                            className="flex-grow bg-transparent px-4 py-2 text-sm outline-none"
                                            value={commentInputs[post.id] || ''}
                                            onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSubmitComment(post.id);
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={() => handleSubmitComment(post.id)}
                                            disabled={submittingComment[post.id] || !commentInputs[post.id]?.trim()}
                                            className="flex h-8 w-8 items-center justify-center rounded-full text-blue-500 hover:bg-blue-50 disabled:opacity-50"
                                        >
                                            {submittingComment[post.id] ? (
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                                            ) : (
                                                <Send size={16} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Load More Button */}
                    {hasMore && (
                        <div className="mt-4 text-center" ref={loadMoreRef}>
                            <button
                                onClick={handleLoadMore}
                                disabled={isLoading}
                                className="rounded-md bg-white px-6 py-2.5 text-sm font-medium text-blue-600 shadow hover:bg-gray-50 disabled:opacity-70"
                            >
                                {isLoading ? 'Loading...' : 'See More Posts'}
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}