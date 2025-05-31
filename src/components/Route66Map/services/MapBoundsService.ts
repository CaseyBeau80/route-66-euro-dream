
import type { Route66Waypoint } from '../types/supabaseTypes';

export class MapBoundsService {
  constructor(private map: google.maps.Map) {}

  fitMapToBounds(majorStopsOnly: Route66Waypoint[]): void {
    if (majorStopsOnly.length === 0) return;

    setTimeout(() => {
      const bounds = new google.maps.LatLngBounds();
      majorStopsOnly.forEach(stop => {
        bounds.extend(new google.maps.LatLng(stop.latitude, stop.longitude));
      });
      this.map.fitBounds(bounds, { 
        top: 60, 
        right: 60, 
        bottom: 60, 
        left: 60 
      });
    }, 1000);
  }
}
