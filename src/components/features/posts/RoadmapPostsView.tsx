import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronRight, 
  Clock, 
  User, 
  MessageCircle, 
  BookOpen, 
  CheckCircle,
  Circle,
  Target,
  TrendingUp,
  Calendar
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Post, Session, DateFormatter, CategoryWithCount } from '~/lib/types';
import { useRoadmapProgress } from '~/lib/hooks/useRoadmapProgress';

type RoadmapPostsViewProps = {
  posts: Post[];
  session: Session;
  formatRelativeTime: DateFormatter;
  selectedCategoryId?: string;
  categories: CategoryWithCount[];
  onPostClick?: (postId: string) => void;
  onCategorySelect?: (categoryId: string) => void;
};

const RoadmapPostsView: React.FC<RoadmapPostsViewProps> = ({
  posts,
  session,
  formatRelativeTime,
  selectedCategoryId,
  categories,
  onPostClick,
  onCategorySelect
}) => {
  const { t } = useTranslation();
  const { 
    togglePostCompletion, 
    isPostCompleted, 
    getProgressStats 
  } = useRoadmapProgress(session?.user?.id);

  const stats = getProgressStats(posts.length);

  // Show category selection if no category is selected
  if (!selectedCategoryId) {
    return (
      <div className="space-y-6">
        {/* Category Selection Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg p-8 border border-primary/10 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{t('roadmap.chooseYourLearningPath')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('roadmap.selectCategoryDescription')}
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect?.(category.id)}
              className="group p-6 bg-card border rounded-lg hover:border-primary/30 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: category.color }}
                >
                  {category.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">{category.postCount || 0}</div>
                  <div className="text-xs text-muted-foreground">{t('roadmap.posts')}</div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4">
                {t('roadmap.learnStructured', { category: category.name, count: category.postCount || 0 })}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-muted-foreground">{t('roadmap.readyToStart')}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </button>
          ))}
        </div>

        {/* Empty State for No Categories */}
        {categories.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t('roadmap.noCategoriesAvailable')}
            </h3>
            <p className="text-muted-foreground">
              {t('roadmap.categoriesWillAppear')}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Show empty state if no posts in selected category
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          {t('roadmap.noPostsInCategory')}
        </h3>
        <p className="text-muted-foreground">
          {t('roadmap.postsWillAppear')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg p-6 border border-primary/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{t('roadmap.learningRoadmap')}</h2>
              <p className="text-sm text-muted-foreground">{t('roadmap.trackProgress')}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{stats.progress}%</div>
            <div className="text-xs text-muted-foreground">{stats.completed}/{stats.total} {t('roadmap.completed')}</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${stats.progress}%` }}
          />
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-muted" />
        
        <div className="space-y-6">
          {posts.map((post, index) => {
            const isCompleted = isPostCompleted(post.id);
            const isFirst = index === 0;
            const isLast = index === posts.length - 1;
            
            return (
              <div key={post.id} className="relative flex gap-6">
                {/* Timeline Node */}
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => togglePostCompletion(post.id)}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      isCompleted 
                        ? 'bg-primary border-primary text-primary-foreground shadow-lg scale-110' 
                        : 'bg-background border-muted-foreground/30 hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </button>
                  
                  {/* Step Number */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                    <span className="text-xs font-medium text-muted-foreground bg-background px-2 py-1 rounded-full border">
                      {index + 1}
                    </span>
                  </div>
                </div>

                {/* Post Card */}
                <div className={`flex-1 transition-all duration-200 ${
                  isCompleted ? 'opacity-75' : 'opacity-100'
                }`}>
                  <div className={`bg-card rounded-lg border p-4 hover:border-primary/30 hover:shadow-md transition-all duration-200 ${
                    isCompleted ? 'bg-muted/30' : ''
                  }`}>
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        {/* Category Badge */}
                        {post.category && (
                          <div className="flex items-center gap-2 mb-2">
                            <span 
                              className="text-xs px-2 py-1 rounded-full font-medium"
                              style={{ 
                                backgroundColor: `${post.category.color}20`,
                                color: post.category.color 
                              }}
                            >
                              {post.category.name}
                            </span>
                            {isCompleted && (
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                ✓ {t('roadmap.completedStatus')}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* Post Title */}
                        <Link 
                          href={`/posts/roadmap/${post.id}`}
                          onClick={() => onPostClick?.(post.id)}
                          className="block group"
                        >
                          <h3 className={`text-lg font-semibold mb-2 group-hover:text-primary transition-colors ${
                            isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                          }`}>
                            {post.title}
                          </h3>
                        </Link>

                        {/* Post Excerpt */}
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Post Meta */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{post.author.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatRelativeTime(post.publishedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            <span>{post.commentCount} {t('posts.comments')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Post Thumbnail */}
                      {post.coverImage && (
                        <div className="ml-4 flex-shrink-0">
                          <div className="w-20 h-20 rounded-lg overflow-hidden">
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.slice(0, 4).map((tag, tagIndex) => (
                          <span 
                            key={tagIndex} 
                            className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          isCompleted ? 'bg-green-500' : 'bg-orange-500'
                        }`} />
                        <span className="text-xs font-medium text-muted-foreground">
                          {isCompleted ? t('roadmap.completedStatus') : t('roadmap.inProgress')}
                        </span>
                      </div>
                      
                      <Link 
                        href={`/posts/roadmap/${post.id}`}
                        onClick={() => onPostClick?.(post.id)}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        {isCompleted ? t('roadmap.review') : t('roadmap.continue')}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <h4 className="font-medium text-foreground">{t('roadmap.keepGoing')}</h4>
              <p className="text-sm text-muted-foreground">
                {stats.completed === stats.total 
                  ? t('roadmap.congratulations')
                  : t('roadmap.postsRemaining', { count: stats.total - stats.completed })
                }
              </p>
            </div>
          </div>
          
          {stats.completed < stats.total && (
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">{t('roadmap.nextUp')}</div>
              <div className="text-xs text-muted-foreground">
                {t('roadmap.continueJourney')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPostsView;