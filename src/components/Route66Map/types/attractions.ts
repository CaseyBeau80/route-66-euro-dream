export interface Attraction {
  id: string;
  name: string;
  city_name: string;
  state: string;
  latitude: number;
  longitude: number;
  description?: string;
  website?: string;
  image_url?: string;
  category?: string;
  featured?: boolean;
}

export interface AttractionsContainerProps {
  map: google.maps.Map;
  waypoints?: any[];
  onAttractionClick?: (attraction: any) => void;
}