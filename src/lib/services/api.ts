import axios from 'axios';
import { Category, Post } from '~/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiService {
  static async getCategories(): Promise<Category[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/collections/categories_tbl/records`,
        {
          params: {
            page: 1,
            perPage: 50,
            sort: 'name'
          }
        }
      );
      return response.data.items;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  }

  static async getCategoryWithPostCount(categoryId: string): Promise<number> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/collections/posts_tbl/records`,
        {
          params: {
            page: 1,
            perPage: 1,
            filter: `categoryId="${categoryId}"`
          }
        }
      );
      return response.data.totalItems || 0;
    } catch (error) {
      console.error(`Failed to get post count for category ${categoryId}:`, error);
      return 0;
    }
  }

  static async getAllPosts(page = 1, perPage = 500): Promise<any[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/collections/posts_tbl/records`,
        {
          params: {
            page,
            perPage,
            sort: '-created',
            expand: 'categoryId'
          },
          timeout: 15000
        }
      );
      return response.data.items;
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      return [];
    }
  }

  static async getPost(postId: string): Promise<any | null> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/collections/posts_tbl/records/${postId}?expand=author,categoryId`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch post ${postId}:`, error);
      return null;
    }
  }

  static async getComments(postId: string, page = 1, perPage = 20): Promise<any[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/collections/comments_tbl/records`,
        {
          params: {
            page,
            perPage,
            filter: `postId="${postId}"`,
            sort: '-created',
            expand: 'userId'
          }
        }
      );
      return response.data.items || [];
    } catch (error) {
      console.error(`Failed to fetch comments for post ${postId}:`, error);
      return [];
    }
  }
}