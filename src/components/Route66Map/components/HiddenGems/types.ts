
export interface HiddenGem {
  id: string;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
  city_name: string;
  website: string | null;
  slug: string | null;
  state: string | null;
  category: string | null;
  year_opened: number | null;
  founded_year: number | null;
  tags: string[] | null;
  featured: boolean | null;
  image_url: string | null;
  thumbnail_url: string | null;
}

export interface HiddenGemsProps {
  map: google.maps.Map;
  onGemClick?: (gem: HiddenGem) => void;
}
