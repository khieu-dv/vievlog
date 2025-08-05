// lib/multilingual.ts
import { useTranslation } from "react-i18next";
import { languages } from "../components/common/locales";

// Refined interface - now more flexible and dynamic
export type MultilingualContent = Record<string, any>

// Helper to get supported language codes
export const getSupportedLanguageCodes = (): string[] => {
  return languages.map(lang => lang.code);
};

// Helper to get language label by code
export const getLanguageLabel = (code: string): string => {
  const language = languages.find(lang => lang.code === code);
  return language?.label || code;
};

// Helper to check if a language code is supported
export const isLanguageSupported = (code: string): boolean => {
  return languages.some(lang => lang.code === code);
};

// Normalize language code (handle variants like zh-cn, zh-tw)
export const normalizeLanguageCode = (code: string): string => {
  const normalized = code.toLowerCase().replace('_', '-');
  
  // Handle Chinese variants
  if (normalized.startsWith('zh')) {
    if (normalized.includes('tw') || normalized.includes('hant')) {
      return 'zh-tw';
    }
    return 'zh-cn';
  }
  
  return normalized;
};

/**
 * Get localized content based on current language
 * Falls back to English if the localized content doesn't exist
 */
export const getLocalizedContent = (
  content: MultilingualContent,
  field: string,
  currentLanguage = 'en'
): string => {
  if (!content || typeof content !== 'object') {
    return '';
  }

  // Normalize the current language code
  const normalizedLang = normalizeLanguageCode(currentLanguage);
  
  // Try to get content in current language
  const localizedField = `${field}_${normalizedLang}`;
  const localizedContent = content[localizedField];
  
  if (localizedContent && String(localizedContent).trim() !== '') {
    return String(localizedContent);
  }

  // If current language is not supported, try to find a supported variant
  if (!isLanguageSupported(normalizedLang)) {
    // Try base language (e.g., 'zh' for 'zh-cn')
    const baseLang = normalizedLang.split('-')[0];
    const supportedVariant = languages.find(lang => lang.code.startsWith(baseLang));
    
    if (supportedVariant) {
      const variantField = `${field}_${supportedVariant.code}`;
      const variantContent = content[variantField];
      
      if (variantContent && String(variantContent).trim() !== '') {
        return String(variantContent);
      }
    }
  }

  // Fallback to English
  const englishField = `${field}_en`;
  const englishContent = content[englishField];
  
  if (englishContent && String(englishContent).trim() !== '') {
    return String(englishContent);
  }

  // Fallback to the base field (for backward compatibility)
  const baseContent = content[field];
  
  if (baseContent && String(baseContent).trim() !== '') {
    return String(baseContent);
  }

  // Try to find any available localized version
  const supportedCodes = getSupportedLanguageCodes();
  for (const code of supportedCodes) {
    const fallbackField = `${field}_${code}`;
    const fallbackContent = content[fallbackField];
    
    if (fallbackContent && String(fallbackContent).trim() !== '') {
      return String(fallbackContent);
    }
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

  const getSupportedLanguages = () => languages;
  
  const getCurrentLanguageInfo = () => {
    return languages.find(lang => lang.code === normalizeLanguageCode(currentLanguage)) || languages[0];
  };

  return {
    getContent,
    currentLanguage: normalizeLanguageCode(currentLanguage),
    getSupportedLanguages,
    getCurrentLanguageInfo,
    isLanguageSupported: (code: string) => isLanguageSupported(code),
    getLanguageLabel: (code: string) => getLanguageLabel(code)
  };
};

