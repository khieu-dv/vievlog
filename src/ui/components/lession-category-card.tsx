"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import Image from "next/image";
import { cn } from "~/lib/utils";
import { Badge } from "~/ui/primitives/badge";
import { Card, CardContent, CardFooter } from "~/ui/primitives/card";

type LessionCategoryCardProps = {
  lessionCategory: {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    rating?: number;
    inStock?: boolean;
  };
  variant?: "default" | "compact";
  onAddToCart?: (lessionCategoryId: string) => void;
  onAddToWishlist?: (lessionCategoryId: string) => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onError">;

export function LessionCategoryCard({
  lessionCategory,
  variant = "default",
  onAddToCart,
  onAddToWishlist,
  className,
  ...props
}: LessionCategoryCardProps) {
  const renderStars = () => {
    const rating = lessionCategory.rating ?? 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={`star-${lessionCategory.id}-position-${i + 1}`}
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

  return (
    <div
      className={cn(
        "w-full max-w-full mx-auto", // Ensure full width with max-width
        "border-b last:border-b-0 hover:bg-muted/10 transition-colors duration-200 rounded-lg",
        className
      )}
      {...props}
    >
      <Link
        href={`/lessons?categoryId=${lessionCategory.id}`}
        className="flex items-center p-4 space-x-4 w-full"
      >
        {/* Image */}
        <div className="relative w-24 h-24 min-w-[6rem] shrink-0">
          {lessionCategory.image ? (
            <Image
              src={lessionCategory.image}
              alt={lessionCategory.title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 96px, 96px"
            />
          ) : (
            <div className="w-full h-full bg-muted/20 rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground text-xs">No Image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0"> {/* Added min-w-0 to prevent overflow */}
          <div className="flex items-start justify-between">
            <div className="flex-grow pr-2">
              <h3 className="text-base font-semibold truncate max-w-full">
                {lessionCategory.title}
              </h3>

              {/* Description */}
              {lessionCategory.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {lessionCategory.description}
                </p>
              )}
            </div>

            {/* Category Badge */}
            <Badge variant="outline" className="shrink-0 ml-2">
              {lessionCategory.category}
            </Badge>
          </div>

          {/* Additional Info */}
          <div className="mt-2 flex items-center justify-between">
            {/* Rating */}
            {renderStars()}

            {/* Stock Status */}
            {!lessionCategory.inStock && (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default LessionCategoryCard;