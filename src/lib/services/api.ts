import axios from 'axios';
import { Category } from '~/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiService {
  static async getCategories(): Promise<Category[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/collections/categories_tbl/records`,
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
}