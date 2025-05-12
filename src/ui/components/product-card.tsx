"use client";

import { Clock, Tag, BookOpen, Heart, Star } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { cn } from "~/lib/utils";
import { Badge } from "~/ui/primitives/badge";
import { Button } from "~/ui/primitives/button";
import { Card, CardContent, CardFooter } from "~/ui/primitives/card";

type TopicCardProps = {
  topic: {
    id: string;
    name: string;
    description: string;
    category: string;
    lessonCount: number;
    rating?: number;
    duration?: string;
  };
  variant?: "default" | "compact" | "list";
  onAddToFavorites?: (topicId: string) => void;
  onStartLearning?: (topicId: string) => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onError">;

export function TopicCard({
  topic,
  variant = "default",
  onAddToFavorites,
  onStartLearning,
  className,
  ...props
}: TopicCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isStartingLesson, setIsStartingLesson] = React.useState(false);
  const [isInFavorites, setIsInFavorites] = React.useState(false);

  const handleStartLearning = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onStartLearning) {
      setIsStartingLesson(true);
      // Simulate API call
      setTimeout(() => {
        onStartLearning(topic.id);
        setIsStartingLesson(false);
      }, 600);
    }
  };

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToFavorites) {
      setIsInFavorites(!isInFavorites);
      onAddToFavorites(topic.id);
    }
  };

  const renderStars = () => {
    const rating = topic.rating ?? 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={`star-${topic.id}-position-${i + 1}`}
            className={cn(
              "h-4 w-4",
              i < fullStars
                ? "text-yellow-400 fill-yellow-400"
                : i === fullStars && hasHalfStar
                  ? "text-yellow-400 fill-yellow-400/50"
                  : "text-muted stroke-muted/40",
            )}
          />
        ))}
        {rating > 0 && (
          <span className="ml-1 text-xs text-muted-foreground">
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    );
  };

  // Improved list view without image
  if (variant === "list") {
    return (
      <div
        className={cn(
          "group relative flex rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200",
          isHovered && "border-primary/30 bg-primary/5",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        <Link href={`/posts/${topic.id}`} className="flex w-full p-4">
          <div className="flex flex-col flex-grow">
            <div className="flex justify-between items-start">
              <div className="flex flex-wrap gap-2">
                {/* Category Badge with improved styling */}
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary hover:bg-primary/15"
                >
                  {topic.category}
                </Badge>

                {/* Free badge */}
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-600"
                >
                  Free
                </Badge>
              </div>

              {/* Favorites button */}
              {onAddToFavorites && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={handleAddToFavorites}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isInFavorites ? "fill-red-500 text-red-500" : "text-muted-foreground"
                    )}
                  />
                </Button>
              )}
            </div>

            <h3 className="text-lg font-medium text-foreground mt-2">{topic.name}</h3>

            <div className="mt-2 flex items-center gap-3">
              {renderStars()}
            </div>

            {/* <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
              {topic.description}
            </p> */}

            <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-2 border-t border-gray-100">
              {/* Lesson count information */}
              <div className="flex items-center text-sm">
                <BookOpen className="h-4 w-4 mr-1.5 text-muted-foreground" />
                <span>Topik Exam</span>
              </div>

              {/* Duration info */}
              {topic.duration && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {topic.duration}
                </div>
              )}
            </div>
          </div>

          {/* Action button moved to right side for better layout balance */}
          {onStartLearning && (
            <div className="ml-4 flex items-center self-center">
              <Button
                size="sm"
                className={cn(
                  "transition-all whitespace-nowrap",
                  isHovered ? "bg-primary text-primary-foreground" : "bg-primary/80"
                )}
                onClick={handleStartLearning}
                disabled={isStartingLesson}
              >
                {isStartingLesson ? (
                  <>
                    <span className="mr-1">Loading...</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="mr-1.5 h-4 w-4" />
                    Start Learning
                  </>
                )}
              </Button>
            </div>
          )}
        </Link>
      </div>
    );
  }

  // Default card view (also modified to not use image)
  return (
    <div className={cn("group", className)} {...props}>
      <Link href={`/posts/${topic.id}`}>
        <Card
          className={cn(
            "relative h-full overflow-hidden rounded-lg transition-all duration-200 ease-in-out hover:shadow-md",
            isHovered && "ring-1 ring-primary/20",
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary"
              >
                {topic.category}
              </Badge>

              <Badge
                variant="outline"
                className="bg-green-50 text-green-600"
              >
                Free
              </Badge>
            </div>

            <h3 className="text-base font-medium mb-2">{topic.name}</h3>

            {renderStars()}

            <div className="flex items-center mt-3 text-sm">
              <BookOpen className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span>{topic.lessonCount} lessons</span>

              {topic.duration && (
                <div className="flex items-center ml-3">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{topic.duration}</span>
                </div>
              )}
            </div>

            {onStartLearning && (
              <div className="mt-3">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handleStartLearning}
                  disabled={isStartingLesson}
                >
                  {isStartingLesson ? (
                    "Loading..."
                  ) : (
                    <>
                      <BookOpen className="mr-1.5 h-4 w-4" />
                      Start Learning
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}