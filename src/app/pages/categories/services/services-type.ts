export interface Category {
  id: number;
  content: Array<{
    name: string;
    description: string;
    language_id: number;
  }>;
  image: string;
  icon: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export class CategoryModel {
  id: number | null;
  content: Array<{
    name: string | null;
    description: string | null;
    language_id: number | null;
  }>;
  categoryId: number | null;
  image: string | null;
  categoryType: 'product' | 'blog' | null;
  icon: string | null;
  slug: string | null;
  constructor(data?: CategoryModel) {
    this.id = data?.id || null;
    this.content = data?.content || [
      {
        name: null,
        description: null,
        language_id: 1,
      },
    ];
    this.categoryId = data?.categoryId || null;
    this.image = data?.image || null;
    this.categoryType = data?.categoryType || 'blog';
    this.icon = data?.icon || null;
    this.slug = data?.slug || null;
  }
}
