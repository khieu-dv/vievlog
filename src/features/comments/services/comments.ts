// ~/lib/comments.ts
import PocketBase from "pocketbase";

const pb = new PocketBase("https://pocketbase.vietopik.com");

export interface Comment {
  id: string;
  doc_path: string;
  content: string;
  author_id: string;
  author_name: string;
  created: string;
  updated: string;
}

export interface CreateCommentData {
  doc_path: string;
  content: string;
  author_id: string;
  author_name: string;
}

export async function getComments(docPath: string): Promise<Comment[]> {
  try {
    const records = await pb.collection('doc_comments_tbl').getList(1, 50, {
      filter: `doc_path = "${docPath}"`,
      sort: 'created',
    });
    return records.items.map((item: any) => ({
      id: item.id,
      doc_path: item.doc_path,
      content: item.content,
      author_id: item.author_id,
      author_name: item.author_name,
      created: item.created,
      updated: item.updated,
    }));
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export async function createComment(data: CreateCommentData): Promise<Comment | null> {
  try {
    const record = await pb.collection('doc_comments_tbl').create(data);
    return {
      id: record.id,
      doc_path: record.doc_path,
      content: record.content,
      author_id: record.author_id,
      author_name: record.author_name,
      created: record.created,
      updated: record.updated,
    };
  } catch (error) {
    console.error('Error creating comment:', error);
    return null;
  }
}

export async function deleteComment(commentId: string, userId: string): Promise<boolean> {
  try {
    await pb.collection('doc_comments_tbl').delete(commentId);
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
}

export function getDocPathFromUrl(pathname: string): string {
  return pathname.replace('/docs/', '').replace(/\/$/, '') || 'index';
}