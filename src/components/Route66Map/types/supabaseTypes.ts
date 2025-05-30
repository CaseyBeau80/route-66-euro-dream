
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
}

export interface SupabaseRoute66Props {
  map: google.maps.Map;
}
