import React from "react";
import Image from "next/image";
import { Send } from "lucide-react";
import { Comment, Category, Post, PopularTopic, Resource, TrendingTech } from '~/lib/types';


interface CommentSectionProps {
    post: Post;
    session: any;
    formatRelativeTime: (date: string | number | Date) => string;
    commentInputs: { [postId: string]: string };
    handleCommentInputChange: (postId: string, value: string) => void;
    handleSubmitComment: (postId: string) => void;
    submittingComment: { [postId: string]: boolean };
    fetchCommentsForPost: (postId: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
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
        <>
            {/* Comments Display */}
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

            {/* Comment Input Box */}
            <div className="flex items-center p-4">
                <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">

                    {session?.user?.image ? (
                        <Image
                            src={session.user.image}
                            alt={session.user.username || "User"}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                            {(session?.user?.username || "U").charAt(0).toUpperCase()}
                        </div>
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
        </>
    );
};

export default CommentSection;