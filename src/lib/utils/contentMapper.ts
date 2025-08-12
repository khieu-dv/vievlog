import { Post, Category } from '~/lib/types';

export class ContentMapper {
  static mapCategory(item: any, getContent: (item: any, field: string) => string): Category {
    return {
      id: item.id,
      name: getContent(item, 'name'),
      slug: item.slug,
      color: item.color || '#6366f1',
      description: getContent(item, 'description'),
      postCount: 0
    };
  }

  static mapPost(item: any, getContent: (item: any, field: string) => string): Post {
    return {
      id: item.id,
      title: getContent(item, 'title'),
      excerpt: getContent(item, 'excerpt'),
      content: getContent(item, 'content'),
      publishedAt: item.created || item.publishedAt,
      coverImage: item.coverImage || "",
      author: {
        name: item.expand?.author?.name || item.author?.name || "Anonymous",
        avatar: item.expand?.author?.avatar || item.author?.avatar || "/default-avatar.png",
      },
      likes: item.likes || 0,
      commentCount: item.commentCount || 0,
      tags: item.tags || [],
      comments: [],
      categoryId: item.categoryId || "",
      category: item.expand?.categoryId ? {
        id: item.expand.categoryId.id,
        name: getContent(item.expand.categoryId, 'name'),
        slug: item.expand.categoryId.slug,
        color: item.expand.categoryId.color || '#6366f1',
        postCount: 0
      } : undefined
    };
  }

  static mapComment(item: any): any {
    return {
      id: item.id,
      postId: item.postId,
      userId: item.userId,
      userName: item.userName || "Anonymous",
      userAvatar: item.userAvatar || "/default-avatar.png",
      content: item.content || "",
      created: item.created || new Date().toISOString(),
    };
  }
}