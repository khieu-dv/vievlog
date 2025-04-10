"use client";

import { BookOpen, Heart, ShoppingCart, Star, Clock, Users } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { cn } from "~/lib/utils";
import { Badge } from "~/ui/primitives/badge";
import { Button } from "~/ui/primitives/button";
import { Card, CardContent, CardFooter } from "~/ui/primitives/card";

type LessionCardProps = {
  lession: {
    id: string;
    name: string;
    description: string;
    category: string;
    rating?: number;
    inStock?: boolean;
    duration?: string;
    students?: number;
    difficulty?: "Beginner" | "Intermediate" | "Advanced";
  };
  variant?: "default" | "compact" | "list";
  onAddToCart?: (lessionId: string) => void;
  onAddToWishlist?: (lessionId: string) => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onError">;

export function LessionCard({
  lession,
  variant = "default",
  onAddToCart,
  onAddToWishlist,
  className,
  ...props
}: LessionCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);
  const [isInWishlist, setIsInWishlist] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) {
      setIsAddingToCart(true);
      // Simulate API call
      setTimeout(() => {
        onAddToCart(lession.id);
        setIsAddingToCart(false);
      }, 600);
    }
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToWishlist) {
      setIsInWishlist(!isInWishlist);
      onAddToWishlist(lession.id);
    }
  };

  const renderStars = () => {
    const rating = lession.rating ?? 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={`star-${lession.id}-position-${i + 1}`}
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

  // Get color based on difficulty
  const getDifficultyColor = (difficulty?: string) => {
    if (!difficulty) return "bg-gray-100 text-gray-600";

    switch (difficulty) {
      case "Beginner": return "bg-green-50 text-green-600";
      case "Intermediate": return "bg-blue-50 text-blue-600";
      case "Advanced": return "bg-purple-50 text-purple-600";
      default: return "bg-gray-100 text-gray-600";
    }
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
        <Link href={`/lessons/${lession.id}`} className="flex w-full p-4">
          <div className="flex flex-col flex-grow">
            <div className="flex justify-between items-start">
              <div className="flex flex-wrap gap-2">
                {/* Category Badge with improved styling */}
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary hover:bg-primary/15"
                >
                  {lession.category}
                </Badge>

                {/* Added difficulty badge if available */}
                {lession.difficulty && (
                  <Badge
                    variant="outline"
                    className={cn(getDifficultyColor(lession.difficulty))}
                  >
                    {lession.difficulty}
                  </Badge>
                )}

                {/* Out of stock badge moved here */}
                {!lession.inStock && (
                  <Badge
                    variant="destructive"
                    className="text-xs font-medium"
                  >
                    Out of Stock
                  </Badge>
                )}
              </div>

              {/* Wishlist button */}
              {onAddToWishlist && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={handleAddToWishlist}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isInWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground"
                    )}
                  />
                </Button>
              )}
            </div>

            <h3 className="text-lg font-medium text-foreground mt-2">{lession.name}</h3>

            <div className="mt-2 flex items-center gap-3">
              {renderStars()}

              {/* Show students count if available */}
              {lession.students !== undefined && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  {lession.students.toLocaleString()} students
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
              {lession.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-3 pt-2 border-t border-gray-100">
              {/* Additional info (duration) */}
              {lession.duration && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {lession.duration}
                </div>
              )}
              <div className="flex items-center text-xs text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5 mr-1" />
                Access forever
              </div>
            </div>
          </div>

          {/* Action button moved to right side for better layout balance */}
          {onAddToCart && (
            <div className="ml-4 flex items-center self-center">
              <Button
                size="sm"
                className={cn(
                  "transition-all whitespace-nowrap",
                  isHovered ? "bg-primary text-primary-foreground" : "bg-primary/80"
                )}
                onClick={handleAddToCart}
                disabled={!lession.inStock || isAddingToCart}
              >
                {isAddingToCart ? (
                  <>
                    <span className="mr-1">Adding...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-1.5 h-4 w-4" />
                    Add to Cart
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
      <Link href={`/lessons/${lession.id}`}>
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
                {lession.category}
              </Badge>

              {lession.difficulty && (
                <Badge
                  variant="outline"
                  className={cn(getDifficultyColor(lession.difficulty))}
                >
                  {lession.difficulty}
                </Badge>
              )}
            </div>

            <h3 className="text-base font-medium mb-2">{lession.name}</h3>

            {renderStars()}

            {lession.duration && (
              <div className="flex items-center text-xs text-muted-foreground mt-3">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {lession.duration}
              </div>
            )}
          </CardContent>

          {!lession.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <Badge variant="destructive" className="text-sm px-3 py-1">
                Out of Stock
              </Badge>
            </div>
          )}
        </Card>
      </Link>
    </div>
  );
}