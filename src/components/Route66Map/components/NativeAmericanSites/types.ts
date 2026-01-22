
export interface NativeAmericanSite {
  id: string;
  name: string;
  description: string | null;
  city_name: string | null;
  state: string | null;
  latitude: number;
  longitude: number;
  website: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  featured: boolean;
  category: string | null;
  created_at: string | null;
  tags: string[] | null;
  tribe_nation: string | null;
  site_type: string | null;
}

export interface NativeAmericanSitesProps {
  map: google.maps.Map;
  onSiteClick?: (site: NativeAmericanSite) => void;
}
