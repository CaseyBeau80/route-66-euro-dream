
export interface Route66Waypoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  state: string;
  sequence_order: number;
  is_major_stop: boolean | null;
  highway_designation: string | null;
  description: string | null;
  city_name?: string; // Added city_name as optional property
  website?: string; // Added website field for attractions
  slug?: string | null; // Added slug for routing
  title?: string | null; // Added title for attractions
}

export interface SupabaseRoute66Props {
  map: google.maps.Map;
  onRouteError?: () => void;
}
