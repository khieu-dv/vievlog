import PocketBase from 'pocketbase';

export const pb = new PocketBase('https://pocketbase.vietopik.com');

// Types for better TypeScript support
export interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  website?: string;
  founded?: number;
  averageRating?: number;
  totalReviews?: number;
  created: string;
  updated: string;
  expand?: {
    industry?: {
      id: string;
      name: string;
      slug: string;
      color?: string;
    };
    company_stats?: CompanyStat[];
  };
}

export interface Review {
  id: string;
  company: string;
  author: string;
  authorAvatarUrl?: string;
  position?: string;
  department?: string;
  workDuration?: string;
  employmentStatus?: string;
  reviewTitle?: string;
  overallRating: number;
  pros?: string;
  cons?: string;
  advice?: string;
  generalContent?: string;
  reviewDate?: string;
  helpfulCount?: number;
  isVerified?: boolean;
  status?: string;
  originalId?: string;
  created: string;
  updated: string;
  expand?: {
    review_ratings?: ReviewRating[];
    review_replies?: ReviewReply[];
    ['review_reactions(review)']?: ReviewReaction[];
  };
}

export interface ReviewRating {
  id: string;
  review: string;
  workEnvironment?: number;
  compensation?: number;
  management?: number;
  careerGrowth?: number;
  workLifeBalance?: number;
  benefits?: number;
  companyCulture?: number;
  created: string;
  updated: string;
}

export interface ReviewReply {
  id: string;
  review: string;
  author: string;
  authorType: 'company' | 'user' | 'admin';
  content: string;
  replyDate?: string;
  isOfficial?: boolean;
  created: string;
  updated: string;
  expand?: {
    ['review_reactions(reply)']?: ReviewReaction[];
  };
}

export interface ReviewReaction {
  id: string;
  review?: string;
  reply?: string;
  count: number;
  created: string;
  updated: string;
}

export interface CompanyStat {
  id: string;
  company: string;
  totalReviews: number;
  averageOverallRating: number;
  averageWorkEnvironment?: number;
  averageCompensation?: number;
  averageManagement?: number;
  averageCareerGrowth?: number;
  averageWorkLifeBalance?: number;
  recommendationPercentage?: number;
  lastUpdated: string;
  created: string;
  updated: string;
}

// API functions
export const companyAPI = {
  // Get all companies with pagination
  async getAll(page = 1, limit = 20, search = '') {
    try {
      const searchFilter = search ? `name~"${search}" || description~"${search}"` : '';
      
      return await pb.collection('companies').getList(page, limit, {
        sort: '-averageRating,-totalReviews',
        filter: searchFilter,
        expand: 'industry',
        requestKey: `companies_list_${page}_${limit}_${search}` // Unique key to prevent auto-cancellation
      });
    } catch (error: any) {
      if (error.status === 0 && error.message.includes('autocancelled')) {
        // Retry once for auto-cancelled requests
        await new Promise(resolve => setTimeout(resolve, 100));
        const searchFilter = search ? `name~"${search}" || description~"${search}"` : '';
        return await pb.collection('companies').getList(page, limit, {
          sort: '-averageRating,-totalReviews',
          filter: searchFilter,
          expand: 'industry'
        });
      }
      throw error
    }
  },

  // Get company by slug
  async getBySlug(slug: string) {
    try {
      const company = await pb.collection('companies').getFirstListItem(
        `slug="${slug}"`,
        {
          expand: 'industry,company_stats(company)',
          requestKey: `company_slug_${slug}`
        }
      );
      return company;
    } catch (error: any) {
      if (error.status === 0 && error.message.includes('autocancelled')) {
        // Retry once for auto-cancelled requests
        await new Promise(resolve => setTimeout(resolve, 100));
        const company = await pb.collection('companies').getFirstListItem(
          `slug="${slug}"`,
          {
            expand: 'industry,company_stats(company)'
          }
        );
        return company;
      }
      if (error.status === 404) {
        return null; // Company not found
      }
      console.error('Company not found:', error);
      return null;
    }
  },

  // Get company reviews
  async getReviews(companyId: string, page = 1, limit = 10, filterRating = 0) {
    try {
      // Build filter string
      let filterString = `company="${companyId}"`;
      if (filterRating > 0) {
        filterString += ` && overallRating=${filterRating}`;
      }

      // First get reviews - sort by reviewDate (newest first), fallback to created date
      const reviewsResponse = await pb.collection('reviews').getList(page, limit, {
        filter: filterString,
        sort: '-reviewDate,-created',
        expand: 'review_ratings,review_reactions(review)',
        requestKey: `reviews_${companyId}_${page}_${limit}_${filterRating}`
      });

      // Then get replies for each review manually
      const reviewsWithReplies = await Promise.all(
        reviewsResponse.items.map(async (review) => {
          try {
            const repliesResponse = await pb.collection('review_replies').getList(1, 100, {
              filter: `review="${review.id}"`,
              sort: '-created',
              expand: 'review_reactions(reply)'
            });
            
            return {
              ...review,
              expand: {
                ...review.expand,
                review_replies: repliesResponse.items
              }
            };
          } catch (error) {
            console.warn(`Could not load replies for review ${review.id}:`, error);
            return review;
          }
        })
      );

      return {
        ...reviewsResponse,
        items: reviewsWithReplies
      };
    } catch (error: any) {
      if (error.status === 0 && error.message.includes('autocancelled')) {
        // Retry once for auto-cancelled requests - simplified version
        await new Promise(resolve => setTimeout(resolve, 100));
        
        let filterString = `company="${companyId}"`;
        if (filterRating > 0) {
          filterString += ` && overallRating=${filterRating}`;
        }
        
        return await pb.collection('reviews').getList(page, limit, {
          filter: filterString,
          sort: '-reviewDate,-created',
          expand: 'review_ratings'
        });
      }
      throw error;
    }
  },

  // Search companies
  async search(query: string, filters?: {
    industry?: string;
    companySize?: string;
    minRating?: number;
  }) {
    try {
      let filterConditions = query ? [`name~"${query}" || description~"${query}"`] : [];
      
      if (filters?.industry) {
        filterConditions.push(`industry="${filters.industry}"`);
      }
      
      if (filters?.companySize) {
        filterConditions.push(`companySize="${filters.companySize}"`);
      }
      
      if (filters?.minRating) {
        filterConditions.push(`averageRating>=${filters.minRating}`);
      }

      const filter = filterConditions.length > 0 ? filterConditions.join(' && ') : '';
      const searchKey = `search_${query}_${JSON.stringify(filters)}`;

      return await pb.collection('companies').getList(1, 50, {
        filter,
        sort: '-averageRating,-totalReviews',
        expand: 'industry',
        requestKey: searchKey
      });
    } catch (error: any) {
      if (error.status === 0 && error.message.includes('autocancelled')) {
        // Retry once for auto-cancelled requests
        await new Promise(resolve => setTimeout(resolve, 100));
        
        let filterConditions = query ? [`name~"${query}" || description~"${query}"`] : [];
        
        if (filters?.industry) {
          filterConditions.push(`industry="${filters.industry}"`);
        }
        
        if (filters?.companySize) {
          filterConditions.push(`companySize="${filters.companySize}"`);
        }
        
        if (filters?.minRating) {
          filterConditions.push(`averageRating>=${filters.minRating}`);
        }

        const filter = filterConditions.length > 0 ? filterConditions.join(' && ') : '';

        return await pb.collection('companies').getList(1, 50, {
          filter,
          sort: '-averageRating,-totalReviews',
          expand: 'industry'
        });
      }
      throw error;
    }
  }
};

export const reviewAPI = {
  // Get review by ID
  async getById(id: string) {
    try {
      return await pb.collection('reviews').getOne(id, {
        expand: 'company,review_ratings,review_replies(review)',
        requestKey: `review_${id}`
      });
    } catch (error: any) {
      if (error.status === 0 && error.message.includes('autocancelled')) {
        // Retry once for auto-cancelled requests
        await new Promise(resolve => setTimeout(resolve, 100));
        return await pb.collection('reviews').getOne(id, {
          expand: 'company,review_ratings,review_replies(review)'
        });
      }
      throw error;
    }
  },

  // Get recent reviews across all companies
  async getRecent(limit = 10) {
    try {
      return await pb.collection('reviews').getList(1, limit, {
        filter: 'status="published"',
        sort: '-created',
        expand: 'company,review_ratings',
        requestKey: `recent_reviews_${limit}`
      });
    } catch (error: any) {
      if (error.status === 0 && error.message.includes('autocancelled')) {
        // Retry once for auto-cancelled requests
        await new Promise(resolve => setTimeout(resolve, 100));
        return await pb.collection('reviews').getList(1, limit, {
          filter: 'status="published"',
          sort: '-created',
          expand: 'company,review_ratings'
        });
      }
      throw error;
    }
  }
};

export const industryAPI = {
  async getAll() {
    try {
      return await pb.collection('industries').getFullList({
        sort: 'name',
        requestKey: 'industries_list' // Unique key to prevent auto-cancellation
      });
    } catch (error: any) {
      if (error.status === 0 && error.message.includes('autocancelled')) {
        // Retry once for auto-cancelled requests
        await new Promise(resolve => setTimeout(resolve, 100));
        return await pb.collection('industries').getFullList({
          sort: 'name'
        });
      }
      throw error;
    }
  }
};