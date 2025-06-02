
export interface InstagramPost {
  id: string;
  instagram_post_id: string;
  caption: string | null;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url: string | null;
  permalink: string;
  timestamp: string;
  like_count: number | null;
  comments_count: number | null;
  is_featured: boolean | null;
  hashtags: string[] | null;
  mentions: string[] | null;
  location_name: string | null;
  location_id: string | null;
  carousel_media: any | null;
  created_at: string;
  updated_at: string;
}
