// utils/multilingual.ts
import { useTranslation } from "react-i18next";

export interface MultilingualContent {
  [key: string]: any;
  title?: string;
  title_en?: string;
  title_vi?: string;
  title_ja?: string;
  title_ko?: string;
  excerpt?: string;
  excerpt_en?: string;
  excerpt_vi?: string;
  excerpt_ja?: string;
  excerpt_ko?: string;
  content?: string;
  content_en?: string;
  content_vi?: string;
  content_ja?: string;
  content_ko?: string;
  name?: string;
  name_en?: string;
  name_vi?: string;
  name_ja?: string;
  name_ko?: string;
  description?: string;
  description_en?: string;
  description_vi?: string;
  description_ja?: string;
  description_ko?: string;
}

/**
 * Get localized content based on current language
 * Falls back to English if the localized content doesn't exist
 */
export const getLocalizedContent = (
  content: MultilingualContent,
  field: string,
  currentLanguage: string = 'en'
): string => {
  // Try to get content in current language
  const localizedField = `${field}_${currentLanguage}`;
  const localizedContent = content[localizedField];
  
  if (localizedContent && localizedContent.trim() !== '') {
    return localizedContent;
  }
  
  // Fallback to English
  const englishField = `${field}_en`;
  const englishContent = content[englishField];
  
  if (englishContent && englishContent.trim() !== '') {
    return englishContent;
  }
  
  // Fallback to the base field (for backward compatibility)
  const baseContent = content[field];
  
  if (baseContent && baseContent.trim() !== '') {
    return baseContent;
  }
  
  // Return empty string if nothing is found
  return '';
};

/**
 * Custom hook to get localized content
 */
export const useLocalizedContent = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || 'en';
  
  const getContent = (content: MultilingualContent, field: string): string => {
    return getLocalizedContent(content, field, currentLanguage);
  };
  
  return {
    getContent,
    currentLanguage
  };
};

/**
 * Helper to get multiple localized fields at once
 */
export const getLocalizedFields = (
  content: MultilingualContent,
  fields: string[],
  currentLanguage: string = 'en'
): { [key: string]: string } => {
  const result: { [key: string]: string } = {};
  
  fields.forEach(field => {
    result[field] = getLocalizedContent(content, field, currentLanguage);
  });
  
  return result;
};