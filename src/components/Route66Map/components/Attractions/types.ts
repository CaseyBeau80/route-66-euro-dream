
import type { Route66Waypoint } from '../../types/supabaseTypes';

export interface Attraction extends Route66Waypoint {
  // Attractions are regular stops (non-major destinations)
}

export interface AttractionsProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
  onAttractionClick?: (attraction: Attraction) => void;
}

export interface AttractionMarkerRefs {
  markersRef: React.MutableRefObject<google.maps.Marker[]>;
  infoWindowsRef: React.MutableRefObject<WeakMap<google.maps.Marker, google.maps.InfoWindow>>;
}

export interface AttractionHoverProps {
  attraction: Attraction;
  isVisible: boolean;
  position: { x: number; y: number };
  onWebsiteClick?: (website: string) => void;
}
