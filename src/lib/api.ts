import axios from 'axios';
import { ApiResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pocketbase.vietopik.com';

// Common API fetch function with error handling
export const fetchFromAPI = async <T>(
  endpoint: string,
  params: Record<string, unknown> = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, { params });
    return response.data as ApiResponse<T>;
  } catch (error) {
    console.error(`API fetch error for ${endpoint}:`, error);
    throw error;
  }
};

// Common post fetching with sorting
export const fetchPosts = async (
  page = 1,
  perPage = 20,
  categoryId?: string,
  sortOrder: 'created' | '-created' = '-created'
) => {
  const params: Record<string, unknown> = {
    page,
    perPage,
    sort: sortOrder,
    expand: 'categoryId'
  };

  if (categoryId) {
    params.filter = `categoryId="${categoryId}"`;
  }

  return fetchFromAPI('/collections/posts_tbl/records', params);
};

// Common categories fetching
export const fetchCategories = async () => {
  return fetchFromAPI('/collections/categories_tbl/records', {
    page: 1,
    perPage: 50,
    sort: 'name'
  });
};

// Common comments fetching
export const fetchComments = async (postId: string, page = 1) => {
  return fetchFromAPI('/collections/comments_tbl/records', {
    page,
    perPage: 20,
    filter: `postId="${postId}"`,
    sort: '-created'
  });
};