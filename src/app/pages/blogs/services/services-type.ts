import { User } from '@pages/users/services/services-type';

export interface Blog {
  id: number;
  order: number;
  views: number;
  isFeatured: boolean;
  isPublished: boolean;
  startDate: string;
  endDate: string;
  postType: string;
  slug: string;
  mediaType: string;
  featuredImages: string[];
  thumb: string;
  video: string;
  content: Array<{
    title: string;
    subTitle: string;
    description: string;
    shortDescription: string;
    metaTitle: string;
    metaDescription: string;
    language_id: number;
  }>;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
}

export class BlogModel {
  id: number | null;
  order: number | null;
  mediaType: string | null;
  video: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  postType: string | null;
  slug: string | null;
  startDate: string | null;
  endDate: string | null;
  publishedAt: string | null;
  featuredImages: string[] | null;
  categoryIds: number | null;
  thumb: string | null;
  content: Array<{
    title: string | null;
    subTitle: string | null;
    description: string | null;
    shortDescription: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    language_id: number | null;
  }>;

  constructor(data?: BlogModel) {
    this.id = data?.id || null;
    this.order = data?.order ?? 1;
    this.video = data?.video || null;
    this.isFeatured = data?.isFeatured ?? true;
    this.isPublished = data?.isPublished ?? true;
    this.publishedAt = data?.publishedAt || null;
    this.postType = data?.postType || 'gallery';
    this.slug = data?.slug || null;
    this.startDate = data?.startDate || null;
    this.endDate = data?.endDate || null;
    this.categoryIds = data?.categoryIds || null;
    this.featuredImages = data?.featuredImages || null;
    this.thumb = data?.thumb || null;
    this.mediaType = data?.mediaType || null;
    this.content = data?.content || [
      {
        title: null,
        subTitle: null,
        description: null,
        shortDescription: null,
        metaTitle: null,
        metaDescription: null,
        language_id: 1,
      },
    ];
  }
}
