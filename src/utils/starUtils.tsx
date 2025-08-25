import React from 'react';
import { Star } from 'lucide-react';

/**
 * Renders star rating display
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
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass[size]} ${
            star <= rating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300 dark:text-gray-600'
          }`}
        />
      ))}
    </div>
  );
};

/**
 * Renders interactive star rating selector
 * @param rating - Current rating value
 * @param onChange - Callback when rating changes
 * @returns JSX elements for interactive stars
 */
export const renderRatingSelector = (rating: number, onChange: (rating: number) => void): React.JSX.Element => {
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
          <Star className="h-8 w-8 fill-current" />
        </button>
      ))}
    </div>
  );
};