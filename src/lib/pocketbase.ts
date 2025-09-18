// ~/lib/pocketbase.ts
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090');

export default pb;

export interface MarkdownDocument {
  id?: string;
  title: string;
  slug: string;
  content: string;
  description?: string;
  author: string;
  category?: string;
  tags?: string[];
  published?: boolean;
  created?: string;
  updated?: string;
}

export const documentsService = {
  // Get all documents
  async getAll(page = 1, perPage = 20, filter = '') {
    return await pb.collection('markdown_documents').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'author'
    });
  },

  // Get document by slug
  async getBySlug(slug: string) {
    return await pb.collection('markdown_documents').getFirstListItem(`slug="${slug}"`, {
      expand: 'author'
    });
  },

  // Get document by ID
  async getById(id: string) {
    return await pb.collection('markdown_documents').getOne(id, {
      expand: 'author'
    });
  },

  // Create new document
  async create(data: MarkdownDocument) {
    return await pb.collection('markdown_documents').create(data);
  },

  // Update document
  async update(id: string, data: Partial<MarkdownDocument>) {
    return await pb.collection('markdown_documents').update(id, data);
  },

  // Delete document
  async delete(id: string) {
    return await pb.collection('markdown_documents').delete(id);
  },

  // Get user's documents
  async getUserDocuments(userId: string, page = 1, perPage = 20) {
    return await pb.collection('markdown_documents').getList(page, perPage, {
      filter: `author="${userId}"`,
      sort: '-created'
    });
  }
};