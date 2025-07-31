// posts/PostComponent.jsx
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp, ChevronDown, MessageCircle, Share2, ExternalLink, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import Comments from "./Comments";
import { Post } from 'src/lib/types';

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
    const { t } = useTranslation();
    const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
    const [currentScore, setCurrentScore] = useState(post.likes || 0);

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

    return (
        <div className="bg-card border rounded-md hover:border-muted-foreground/20 transition-colors">
            <div className="flex">
                {/* Left Voting Panel - Reddit Style */}
                <div className="flex flex-col items-center p-2 w-10 bg-muted/30 rounded-l-md">
                    <button 
                        onClick={() => handleVote('up')}
                        className={`p-1 rounded hover:bg-muted transition-colors ${
                            userVote === 'up' ? 'text-orange-500' : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <ChevronUp className="h-5 w-5" />
                    </button>
                    <span className={`text-xs font-medium px-1 ${
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
                        <ChevronDown className="h-5 w-5" />
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-3">
                    {/* Post Header - Compact Reddit Style */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
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
                        <span>{t("posts.postedBy")}</span>
                        <span className="hover:underline cursor-pointer">u/{post.author.name}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatRelativeTime(post.publishedAt)}
                        </span>
                    </div>

                    {/* Post Title */}
                    <Link href={`/posts/${post.id}`} className="block group">
                        <h2 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                            {post.title}
                        </h2>
                    </Link>

                    {/* Post Excerpt */}
                    {post.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Post Image - Compact */}
                    {post.coverImage && (
                        <div className="relative w-full h-48 mb-3 rounded overflow-hidden">
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    {/* Tags - Minimal */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {post.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Actions Bar - Reddit Style */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <button className="flex items-center gap-1 hover:bg-muted px-2 py-1 rounded transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.commentCount} {post.commentCount === 1 ? t("posts.comment") : t("posts.comments")}</span>
                        </button>
                        <button className="flex items-center gap-1 hover:bg-muted px-2 py-1 rounded transition-colors">
                            <Share2 className="h-4 w-4" />
                            <span>{t("posts.share")}</span>
                        </button>
                        <Link 
                            href={`/posts/${post.id}`}
                            className="flex items-center gap-1 hover:bg-muted px-2 py-1 rounded transition-colors"
                        >
                            <ExternalLink className="h-4 w-4" />
                            <span>{t("posts.readMore")}</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Comments Section - Collapsible */}
            {post.comments && post.comments.length > 0 && (
                <div className="border-t border-border bg-muted/20">
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