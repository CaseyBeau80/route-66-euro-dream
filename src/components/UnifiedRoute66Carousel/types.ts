
export interface UnifiedRoute66Item {
  id: string;
  name: string;
  title?: string;
  description?: string | null;
  city_name: string;
  state?: string;
  image_url?: string | null;
  thumbnail_url?: string | null;
  website?: string | null;
  latitude?: number;
  longitude?: number;
  category: 'attractions' | 'drive_ins' | 'hidden_gems';
  tags: string[];
  founded_year?: number;
  year_opened?: number;
  featured?: boolean;
  slug?: string;
}

export interface FilterState {
  type: 'all' | 'attractions' | 'drive_ins' | 'hidden_gems';
  state: string;
  city: string;
  search: string;
}

export interface UnifiedCarouselProps {
  className?: string;
}
