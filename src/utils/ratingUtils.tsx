import React from 'react';

/**
 * Renders a rating bar with label and percentage
 * @param label - The rating category label
 * @param rating - The rating value (0-5 or 0-100)
 * @param max - Maximum value (default: 5)
 * @returns JSX element for rating bar
 */
export const renderRatingBar = (label: string, rating: number, max: number = 5): React.JSX.Element => {
  const percentage = Math.round((rating / max) * 100);
  
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm text-gray-600 dark:text-gray-400 w-20">{label}</span>
      <div className="flex-1 mx-3">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-900 dark:text-white w-10 text-right">
        {max === 100 ? `${percentage}%` : rating.toFixed(1)}
      </span>
    </div>
  );
};