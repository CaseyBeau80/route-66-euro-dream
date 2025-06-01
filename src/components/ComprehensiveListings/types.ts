
export interface ListingItem {
  id: string;
  name: string;
  description?: string | null;
  city_name: string;
  state?: string;
  image_url?: string | null;
  thumbnail_url?: string | null;
  website?: string | null;
  latitude?: number;
  longitude?: number;
  category: string;
  tags: string[];
  population?: number;
  founded_year?: number;
  year_opened?: number;
  featured?: boolean;
}
