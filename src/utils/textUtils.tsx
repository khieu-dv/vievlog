import React from 'react';

/**
 * Formats text content with proper line breaks
 * @param content - The text content to format
 * @returns JSX elements with proper line breaks
 */
export const formatTextContent = (content: string): React.JSX.Element[] | string => {
  if (!content) return '';

  // Remove HTML tags but preserve line breaks
  const cleanText = content.replace(/<[^>]*>/g, '');

  // Split by line breaks and preserve empty lines for spacing
  const lines = cleanText.split(/\r?\n/);

  return lines.map((line, index) => (
    <span key={index}>
      {line.trim() === '' ? '\u00A0' : line} {/* Non-breaking space for empty lines */}
      {index < lines.length - 1 && <br />}
    </span>
  ));
};

/**
 * Gets the appropriate avatar letter for a user
 * @param name - The user's name
 * @returns Single character for avatar display
 */
export const getAvatarLetter = (name: string): string => {
  if (!name || name.trim() === '') return 'U';
  
  // Special case for "Ẩn danh" - should return "A" not "Ẩ"
  if (name.trim() === 'Ẩn danh') return 'A';
  
  return name.charAt(0).toUpperCase();
};