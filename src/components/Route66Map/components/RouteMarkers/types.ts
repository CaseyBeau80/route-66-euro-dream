
import type { Route66Waypoint } from '../../types/supabaseTypes';

export interface RouteMarkersProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

export interface MarkerRefs {
  markersRef: React.MutableRefObject<google.maps.Marker[]>;
  infoWindowsRef: React.MutableRefObject<WeakMap<google.maps.Marker, google.maps.InfoWindow>>;
}
