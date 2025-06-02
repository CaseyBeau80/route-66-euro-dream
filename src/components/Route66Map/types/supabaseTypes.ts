
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
}

export interface SupabaseRoute66Props {
  map: google.maps.Map;
  onRouteError?: () => void;
}
