import { useState, useEffect } from 'react';
import { Category } from '~/lib/types';
import { ApiService } from '~/lib/services/api';
import { ContentMapper } from '~/lib/utils/contentMapper';
import { useLocalizedContent } from '~/lib/multilingual';

export interface DocSection {
  id: string;
  title: string;
  content: string;
  iconName?: string;
  category?: Category;
}

// Cache by language to prevent refetching
let docsCache: Record<string, {
  categories?: Category[];
  docsData?: DocSection[];
  timestamp?: number;
}> = {};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useDocsData = () => {
  const { getContent, currentLanguage } = useLocalizedContent();
  const [categories, setCategories] = useState<Category[]>([]);
  const [docsData, setDocsData] = useState<DocSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocsData = async () => {
      try {
        setLoading(true);

        // Check cache first (by language)
        const now = Date.now();
        const languageCache = docsCache[currentLanguage];
        if (languageCache && languageCache.categories && languageCache.docsData && 
            languageCache.timestamp && (now - languageCache.timestamp < CACHE_DURATION)) {
          console.log(`Using cached documentation data for language: ${currentLanguage}`);
          setCategories(languageCache.categories);
          setDocsData(languageCache.docsData);
          setLoading(false);
          return;
        }

        console.log(`Fetching fresh documentation data for language: ${currentLanguage}`);

        // Fetch categories
        const categoriesResponse = await ApiService.getCategories();
        const categoriesData = categoriesResponse.map((item: any) => 
          ContentMapper.mapCategory(item, getContent)
        );

        const finalDocsData = createDocsData(categoriesData);

        // Update cache for current language
        docsCache[currentLanguage] = {
          categories: categoriesData,
          docsData: finalDocsData,
          timestamp: now
        };

        setCategories(categoriesData);
        setDocsData(finalDocsData);
      } catch (error) {
        console.error('Failed to fetch documentation data:', error);
        setDocsData([{
          id: 'error',
          title: 'Error Loading Documentation',
          content: `# Error Loading Documentation\n\nUnable to load documentation content from the server.\n\n**Error Details:** ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        }]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch once when component mounts or language changes
    fetchDocsData();
  }, [currentLanguage]); // Only depend on language changes

  return { categories, docsData, loading };
};

// Helper function to get category icon name
const getCategoryIconName = (categoryName: string): string => {
  const name = categoryName.toLowerCase();
  if (name.includes('javascript') || name.includes('js')) return 'code';
  if (name.includes('react') || name.includes('vue') || name.includes('angular')) return 'rocket';
  if (name.includes('node') || name.includes('backend')) return 'settings';
  if (name.includes('video') || name.includes('media')) return 'video';
  if (name.includes('community') || name.includes('discussion')) return 'message-circle';
  if (name.includes('security')) return 'shield';
  if (name.includes('web') || name.includes('frontend')) return 'globe';
  if (name.includes('git') || name.includes('version')) return 'git-branch';
  return 'book-open';
};

const createDocsData = (categories: Category[]): DocSection[] => {
  return [
    ...categories.map((category: Category) => {
      return {
        id: category.id,
        title: category.name,
        iconName: getCategoryIconName(category.name),
        category: category,
        content: `# ${category.name}\n\n${category.description || `Comprehensive guide to ${category.name} development and best practices.`}\n\n## About This Category\n\nThis section provides resources and information about ${category.name}.\n\n### Getting Started\n\nExplore the fundamentals and learn the core concepts that will help you master ${category.name}.\n\n### Best Practices\n\nFollow industry standards and proven methodologies for ${category.name} development.\n\n### Advanced Topics\n\nDeep dive into complex concepts and advanced techniques in ${category.name}.\n\n---\n\n*This is a documentation category. Visit individual lessons and tutorials to learn more about ${category.name}.*`,
      };
    })
  ];
};