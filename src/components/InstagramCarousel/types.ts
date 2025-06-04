
export interface InstagramPost {
  id: string;
  instagram_post_id: string;
  media_url: string;
  thumbnail_url?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  caption?: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
  location_name?: string;
  location_id?: string;
  hashtags?: string[];
  mentions?: string[];
  carousel_media?: any;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
  route66_relevant: boolean;
  likes: number;
}
