import { Category } from '~/lib/types';

export class ContentMapper {
  static mapCategory(item: any, getContent: (item: any, field: string) => string): Category {
    return {
      id: item.id,
      name: getContent(item, 'name'),
      slug: item.slug,
      color: item.color || '#6366f1',
      description: getContent(item, 'description'),
      mainName: item.mainName || 'Languages'
    };
  }
}