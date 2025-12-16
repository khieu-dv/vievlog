// ~/components/docs/CommentSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/features/auth/services/authClient';
import { getDocPathFromUrl } from '@/features/comments/services/comments';
import type { Comment } from '@/features/comments/services/comments';
import LessonSuggestions from './lesson-suggestions';

interface CommentSectionProps {
  docPath: string;
}

export default function CommentSection({ docPath }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { data: session } = useSession();

  // Extract lesson number from docPath (e.g., "courses/rust/lesson_1" -> 1)
  const getLessonNumber = (path: string): number => {
    const match = path.match(/lesson_(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const currentLesson = getLessonNumber(docPath);

  // Detect course type and get course info
  const getCourseInfo = (path: string) => {
    if (path.includes('courses/rust')) {
      return { basePath: '/docs/courses/rust', totalLessons: 18, showSuggestions: true };
    }

    // Add more course detection logic here
    // Example for other courses:
    // if (path.includes('web-development/javascript')) {
    //   return { basePath: '/docs/web-development/javascript', totalLessons: 20, showSuggestions: true };
    // }

    // Default: try to detect if it's a course with numbered lessons
    const hasNumberedLessons = /lesson_\d+/.test(path);
    if (hasNumberedLessons) {
      const pathParts = path.split('/');
      const coursePath = pathParts.slice(0, -1).join('/');
      return { basePath: `/docs/${coursePath}`, totalLessons: 15, showSuggestions: true };
    }

    return { basePath: '', totalLessons: 0, showSuggestions: false };
  };

  const courseInfo = getCourseInfo(docPath);

  useEffect(() => {
    fetchComments();
  }, [docPath]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/docs/api/comments?doc_path=${encodeURIComponent(docPath)}`);
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch('/docs/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doc_path: docPath,
          content: newComment.trim(),
          author_id: session.user.id,
          author_name: session.user.username || session.user.email,
        }),
      });

      if (response.ok) {
        setNewComment('');
        await fetchComments();
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!session?.user) return;

    try {
      const response = await fetch(`/docs/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: session.user.id }),
      });

      if (response.ok) {
        await fetchComments();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        💬 Thảo luận ({comments.length})
      </h3>

      {/* Comment Form */}
      {session?.user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Chia sẻ suy nghĩ của bạn về bài học này..."
              className="w-full h-24 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-500">
                Đăng nhập như: <strong>{session.user.username || session.user.email}</strong>
              </span>
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-center">
            <a href="/auth/sign-in" className="text-blue-600 hover:underline font-medium">
              Đăng nhập
            </a>{' '}
            để tham gia thảo luận
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Chưa có bình luận nào. Hãy là người đầu tiên thảo luận!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {comment.author_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{comment.author_name}</p>
                    <p className="text-sm text-gray-500">{formatDate(comment.created)}</p>
                  </div>
                </div>
                {session?.user?.id === comment.author_id && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Xóa
                  </button>
                )}
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Lesson Suggestions - Show for any course with numbered lessons */}
      {courseInfo.showSuggestions && (
        <LessonSuggestions
          currentLesson={currentLesson}
          basePath={courseInfo.basePath}
          totalLessons={courseInfo.totalLessons}
        />
      )}
    </div>
  );
}