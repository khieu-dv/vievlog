import { useState, useEffect } from 'react';
import { Category, Post } from '~/lib/types';
import { ApiService } from '~/lib/services/api';
import { ContentMapper } from '~/lib/utils/contentMapper';
import { useLocalizedContent } from '~/lib/multilingual';

export interface DocSection {
  id: string;
  title: string;
  content: string;
  iconName?: string;
  posts?: Post[];
  category?: Category;
}

// Cache by language to prevent refetching
let docsCache: Record<string, {
  categories?: Category[];
  categoryPosts?: Record<string, Post[]>;
  docsData?: DocSection[];
  timestamp?: number;
}> = {};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useDocsData = () => {
  const { getContent, currentLanguage } = useLocalizedContent();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryPosts, setCategoryPosts] = useState<Record<string, Post[]>>({});
  const [docsData, setDocsData] = useState<DocSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocsData = async () => {
      try {
        setLoading(true);

        // Check cache first (by language)
        const now = Date.now();
        const languageCache = docsCache[currentLanguage];
        if (languageCache && languageCache.categories && languageCache.categoryPosts && languageCache.docsData && 
            languageCache.timestamp && (now - languageCache.timestamp < CACHE_DURATION)) {
          console.log(`Using cached documentation data for language: ${currentLanguage}`);
          setCategories(languageCache.categories);
          setCategoryPosts(languageCache.categoryPosts);
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

        // Fetch all posts
        let allPosts: any[] = [];
        let currentPage = 1;
        let hasMorePosts = true;

        while (hasMorePosts) {
          const fetchedPosts = await ApiService.getAllPosts(currentPage, 500);
          allPosts = [...allPosts, ...fetchedPosts];
          hasMorePosts = fetchedPosts.length === 500;
          currentPage++;
        }

        // Group posts by category
        const categoryPostsData: Record<string, Post[]> = {};
        categoriesData.forEach((category: Category) => {
          categoryPostsData[category.id] = [];
        });

        allPosts.forEach((item: any) => {
          const mappedPost = ContentMapper.mapPost(item, getContent);
          if (mappedPost.categoryId && categoryPostsData[mappedPost.categoryId]) {
            categoryPostsData[mappedPost.categoryId].push(mappedPost);
          }
        });

        // Sort posts within each category
        Object.keys(categoryPostsData).forEach(categoryId => {
          categoryPostsData[categoryId].sort((a, b) =>
            new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
          );
        });

        // Update category post counts
        const categoriesWithCounts = categoriesData.map((category: Category) => ({
          ...category,
          postCount: categoryPostsData[category.id]?.length || 0
        }));

        const finalDocsData = createDocsData(categoriesWithCounts, categoryPostsData);

        // Update cache for current language
        docsCache[currentLanguage] = {
          categories: categoriesWithCounts,
          categoryPosts: categoryPostsData,
          docsData: finalDocsData,
          timestamp: now
        };

        setCategories(categoriesWithCounts);
        setCategoryPosts(categoryPostsData);
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

  return { categories, categoryPosts, docsData, loading };
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

const createDocsData = (categories: Category[], categoryPosts: Record<string, Post[]>): DocSection[] => {
  return [
    ...categories.map((category: Category) => {
      const posts = categoryPosts[category.id] || [];
      return {
        id: category.id,
        title: category.name,
        iconName: getCategoryIconName(category.name),
        category: category,
        posts: posts,
        content: `# ${category.name}\n\n${category.description || `Comprehensive guide to ${category.name} development and best practices.`}\n\n## Available Content\n\nThis section contains ${posts.length} posts covering various aspects of ${category.name}.\n\n${posts.length > 0 ? `\n\n### Learning Path (Start Here)\n\n${posts.slice(0, 5).map((post, index) => `\n#### ${index + 1}. ${post.title}\n\n${post.excerpt || 'Educational content and tutorials.'}\n\n*Published: ${new Date(post.publishedAt).toLocaleDateString()}*\n\n---`).join('\n')}\n\n${posts.length > 5 ? `\n*Continue with ${posts.length - 5} more articles in this learning path...*` : ''}` : '\n*No posts available in this category yet. Check back later for new content!*'}\n\n## Structured Learning\n\n${posts.length > 0 ? `These articles are organized chronologically to provide a structured learning experience. Start with the first article and progress through each one to build your knowledge step by step.\n\n**Learning progression:**\n${posts.slice(0, 5).map((post, index) => `${index + 1}. ${post.title}`).join('\n')}\n${posts.length > 5 ? `\n...and ${posts.length - 5} more articles` : ''}` : ''}`,
      };
    })
  ];
};