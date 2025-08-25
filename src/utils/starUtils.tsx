import React from 'react';
import { Star } from 'lucide-react';

/**
 * Renders star rating display with fractional support
 * @param rating - The rating value (0-5)
 * @param size - Size variant for stars
 * @returns JSX elements for star display
 */
export const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm'): React.JSX.Element => {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercentage = Math.max(0, Math.min(100, (rating - star + 1) * 100));
        const isFullyFilled = star <= Math.floor(rating);
        const isPartiallyFilled = star === Math.ceil(rating) && rating % 1 !== 0;
        
        if (isFullyFilled) {
          // Full star
          return (
            <Star
              key={star}
              className={`${sizeClass[size]} text-yellow-400 fill-current`}
            />
          );
        } else if (isPartiallyFilled) {
          // Partial star with gradient mask
          const percentage = (rating % 1) * 100;
          return (
            <div key={star} className={`relative ${sizeClass[size]}`}>
              {/* Background empty star */}
              <Star className={`absolute inset-0 ${sizeClass[size]} text-gray-300 dark:text-gray-600`} />
              {/* Foreground filled star with clip-path */}
              <Star 
                className={`absolute inset-0 ${sizeClass[size]} text-yellow-400 fill-current`}
                style={{
                  clipPath: `inset(0 ${100 - percentage}% 0 0)`
                }}
              />
            </div>
          );
        } else {
          // Empty star
          return (
            <Star
              key={star}
              className={`${sizeClass[size]} text-gray-300 dark:text-gray-600`}
            />
          );
        }
      })}
    </div>
  );
};

/**
 * Renders interactive star rating selector
 * @param rating - Current rating value
 * @param onChange - Callback when rating changes
 * @param size - Size variant for stars
 * @returns JSX elements for interactive stars
 */
export const renderRatingSelector = (
  rating: number, 
  onChange: (rating: number) => void, 
  size: 'sm' | 'md' | 'lg' = 'lg'
): React.JSX.Element => {
  const sizeClass = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`p-1 transition-colors ${
            star <= rating
              ? 'text-yellow-400'
              : 'text-gray-300 hover:text-yellow-300'
          }`}
        >
          <Star className={`${sizeClass[size]} fill-current`} />
        </button>
      ))}
    </div>
  );
};