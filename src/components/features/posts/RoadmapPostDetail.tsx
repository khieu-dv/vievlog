import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  Circle,
  Clock,
  User,
  MessageCircle,
  BookOpen,
  Target,
  Calendar,
  ArrowLeft,
  ArrowRight,
  PlayCircle,
  PauseCircle,
  RotateCcw
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { MarkdownRenderer } from "~/components/common/MarkdownRenderer";
import { Post, Comment } from '~/lib/types';
import { useRoadmapProgress } from '~/lib/hooks/useRoadmapProgress';

type RoadmapPostDetailProps = {
  post: Post;
  allPosts: Post[];
  currentIndex: number;
  session: any;
  formatRelativeTime: (date: string) => string;
  onPostComplete?: (postId: string, completed: boolean) => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  comments: Comment[];
  commentInput: string;
  onCommentInputChange: (value: string) => void;
  onCommentSubmit: () => void;
  submittingComment: boolean;
};

const RoadmapPostDetail: React.FC<RoadmapPostDetailProps> = ({
  post,
  allPosts,
  currentIndex,
  session,
  formatRelativeTime,
  onPostComplete,
  onNavigate,
  comments,
  commentInput,
  onCommentInputChange,
  onCommentSubmit,
  submittingComment
}) => {
  const { t } = useTranslation();
  const { togglePostCompletion, isPostCompleted } = useRoadmapProgress(session?.user?.id);
  const [readingTime, setReadingTime] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isReading, setIsReading] = useState(false);

  const isCompleted = isPostCompleted(post.id);

  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // Calculate estimated reading time
  useEffect(() => {
    if (post.content) {
      const wordsPerMinute = 200;
      const wordCount = post.content.split(/\s+/).length;
      const estimatedTime = Math.ceil(wordCount / wordsPerMinute);
      setReadingTime(estimatedTime);
    }
  }, [post.content]);

  // Timer for tracking reading time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReading) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isReading]);

  const handleComplete = () => {
    togglePostCompletion(post.id);
    
    // Call the callback if provided
    onPostComplete?.(post.id, !isCompleted);
  };

  const handleStartReading = () => {
    setIsReading(true);
  };

  const handlePauseReading = () => {
    setIsReading(false);
  };

  const handleResetTimer = () => {
    setTimeSpent(0);
    setIsReading(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return Math.round(((currentIndex + 1) / allPosts.length) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Roadmap Progress Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <Link href="/posts" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Roadmap
            </Link>

            {/* Progress Info */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {currentIndex + 1} of {allPosts.length}
              </div>
              <div className="w-24 bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              <div className="text-sm font-medium text-primary">
                {getProgressPercentage()}%
              </div>
            </div>

            {/* Completion Button */}
            <button
              onClick={handleComplete}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                isCompleted 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Completed
                </>
              ) : (
                <>
                  <Circle className="h-4 w-4" />
                  Mark Complete
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Post Header Card */}
        <div className="bg-gradient-to-br from-primary/5 via-primary/3 to-transparent rounded-xl p-6 mb-8 border border-primary/10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {/* Category Badge */}
              {post.category && (
                <div className="flex items-center gap-2 mb-3">
                  <span 
                    className="text-sm px-3 py-1 rounded-full font-medium"
                    style={{ 
                      backgroundColor: `${post.category.color}20`,
                      color: post.category.color 
                    }}
                  >
                    {post.category.name}
                  </span>
                  <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                  <span className="text-sm text-muted-foreground">Step {currentIndex + 1}</span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl font-bold text-foreground mb-3 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatRelativeTime(post.publishedAt || '')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>{comments.length} comments</span>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="ml-6 flex-shrink-0">
                <div className="w-32 h-32 rounded-lg overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Reading Timer */}
          <div className="bg-background/50 rounded-lg p-4 border border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Reading Progress</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Time: {formatTime(timeSpent)} / ~{readingTime} min
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={isReading ? handlePauseReading : handleStartReading}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
                >
                  {isReading ? (
                    <>
                      <PauseCircle className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-4 w-4" />
                      Start
                    </>
                  )}
                </button>
                <button
                  onClick={handleResetTimer}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <article className="bg-card rounded-lg border p-8 mb-8">
          <div className="max-w-none prose prose-slate dark:prose-invert">
            <MarkdownRenderer content={post.content || ''} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
              {post.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="text-sm px-3 py-1 bg-muted text-muted-foreground rounded-full hover:bg-muted/80 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          {prevPost ? (
            <button
              onClick={() => onNavigate?.('prev')}
              className="flex items-center gap-3 p-4 bg-card border rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all group"
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground mb-1">Previous</div>
                <div className="font-medium text-foreground group-hover:text-primary line-clamp-1">
                  {prevPost.title}
                </div>
              </div>
            </button>
          ) : (
            <div />
          )}

          {nextPost ? (
            <button
              onClick={() => onNavigate?.('next')}
              className="flex items-center gap-3 p-4 bg-card border rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all group"
            >
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">Next</div>
                <div className="font-medium text-foreground group-hover:text-primary line-clamp-1">
                  {nextPost.title}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            </button>
          ) : (
            <div />
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Discussion ({comments.length})
          </h3>

          {/* Comment Input */}
          {session?.user && (
            <div className="mb-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                      {session.user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder={t("What are your thoughts on this step?")}
                    className="w-full p-3 border border-border rounded-md bg-background text-sm resize-vertical min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={commentInput}
                    onChange={(e) => onCommentInputChange(e.target.value)}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={onCommentSubmit}
                      disabled={submittingComment || !commentInput.trim()}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submittingComment ? 'Posting...' : 'Add Comment'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-4 bg-background rounded-lg border border-border/50">
                  <div className="flex-shrink-0">
                    {comment.userAvatar && comment.userAvatar !== "/default-avatar.png" ? (
                      <Image
                        src={comment.userAvatar}
                        alt={comment.userName}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold">
                        {comment.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span className="font-medium text-foreground">{comment.userName}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(comment.created)}</span>
                    </div>
                    <p className="text-sm text-foreground">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {t("No comments yet. Be the first to share what you think!")}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoadmapPostDetail;