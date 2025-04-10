"use client";

import { useState, useEffect } from "react";
import { Button } from "~/ui/primitives/button";
import { Avatar } from "~/ui/primitives/avatar";
import { Textarea } from "~/ui/primitives/textarea";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUser } from "../../lib/hooks/useUser"; // Import hook useUser

interface Comment {
    id: string;
    lessonId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    createdAt: string;
}

export function LessonComments({ lessonId }: { lessonId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { user, loading } = useUser(); // Sử dụng hook useUser
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // Fetch comments
    useEffect(() => {
        const fetchComments = async () => {
            if (!lessonId) return;

            setIsLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `https://pocketbase.vietopik.com/api/collections/lesson_comments/records`,
                    { params: { filter: `lessonId = "${lessonId}"`, sort: "-created" } }
                );

                setComments(response.data.items.map((item: any) => ({
                    id: item.id,
                    lessonId: item.lessonId,
                    userId: item.userId,
                    userName: item.userName,
                    userAvatar: item.userAvatar,
                    content: item.content,
                    createdAt: item.created
                })));
            } catch (err) {
                console.error("Error fetching comments:", err);
                setError("Không thể tải bình luận. Vui lòng thử lại sau.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();
    }, [lessonId]);

    // Submit new comment
    const handleSubmitComment = async () => {
        if (!newComment.trim() || !user) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const commentData = {
                lessonId,
                userId: user.id,
                userName: user.name,
                userAvatar: user.avatar,
                content: newComment,
            };

            const response = await axios.post(
                `https://pocketbase.vietopik.com/api/collections/lesson_comments/records`,
                commentData
            );

            const newCommentData = {
                ...commentData,
                id: response.data.id,
                createdAt: response.data.created
            };

            setComments([newCommentData, ...comments]);
            setNewComment("");
        } catch (err) {
            console.error("Error posting comment:", err);
            setError("Không thể đăng bình luận. Vui lòng thử lại sau.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    if (loading) {
        return (
            <div className="mt-10 border rounded-lg p-4 bg-white dark:bg-gray-800">
                <h2 className="text-xl font-bold mb-4">Bình luận</h2>
                <div className="text-center py-4">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="mt-10 border rounded-lg p-4 bg-white dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4">Bình luận</h2>

            {user ? (
                <div className="mb-6">
                    <Textarea
                        placeholder="Viết bình luận của bạn..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full mb-2"
                        rows={3}
                    />
                    <div className="flex justify-end">
                        <Button
                            onClick={handleSubmitComment}
                            disabled={!newComment.trim() || isSubmitting}
                            className="bg-primary"
                        >
                            {isSubmitting ? "Đang đăng..." : "Đăng bình luận"}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                    <p className="mb-2">Vui lòng đăng nhập để bình luận</p>
                    <Button onClick={() => router.push("/auth/sign-in")} className="bg-primary">
                        Đăng nhập
                    </Button>
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-10">Đang tải bình luận...</div>
            ) : comments.length > 0 ? (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="border-b pb-4 last:border-b-0">
                            <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10">
                                    {comment.userAvatar ? (
                                        <img src={comment.userAvatar} alt={comment.userName} />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                                            {comment.userName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">{comment.userName}</h4>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatDate(comment.createdAt)}
                                        </span>
                                    </div>
                                    <p className="mt-1 whitespace-pre-line">{comment.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                </div>
            )}
        </div>
    );
}