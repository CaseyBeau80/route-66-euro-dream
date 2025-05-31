
import type { Route66Waypoint } from '../../types/supabaseTypes';
import type { MarkerRefs } from './types';
import { DestinationMarkerService } from './DestinationMarkerService';
import { MarkerCleanupService } from './MarkerCleanupService';

export class MarkerManager {
  static createDestinationMarkers(
    destinationCities: Route66Waypoint[], 
    map: google.maps.Map, 
    markerRefs: MarkerRefs
  ): void {
    DestinationMarkerService.createDestinationMarkers(destinationCities, map, markerRefs);
  }

  static cleanupMarkers(markerRefs: MarkerRefs): void {
    MarkerCleanupService.cleanupMarkers(markerRefs);
  }
}
