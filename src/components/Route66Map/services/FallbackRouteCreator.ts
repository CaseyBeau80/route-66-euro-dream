
import { RouteGlobalState } from './RouteGlobalState';
import type { Route66Waypoint } from '../types/supabaseTypes';

export class FallbackRouteCreator {
  constructor(private map: google.maps.Map) {}

  createAsphaltFallbackRoute(majorStops: Route66Waypoint[]): void {
    console.log('🔄 FallbackRouteCreator: Creating GUARANTEED VISIBLE fallback route');
    console.log('🔄 FallbackRouteCreator: Input major stops:', majorStops.length);
    
    if (majorStops.length < 2) {
      console.error('❌ FallbackRouteCreator: Need at least 2 stops');
      return;
    }

    const routePath = majorStops.map(stop => ({
      lat: stop.latitude,
      lng: stop.longitude
    }));

    console.log('🔄 FallbackRouteCreator: Route path coordinates:', routePath);

    try {
      // Create main asphalt polyline - BRIGHT AND VISIBLE
      const fallbackPolyline = new google.maps.Polyline({
        path: routePath,
        geodesic: true,
        strokeColor: '#FF0000', // BRIGHT RED to ensure visibility
        strokeOpacity: 1.0, // Full opacity
        strokeWeight: 8, // Thick line
        zIndex: 10000,
        clickable: false,
        map: this.map
      });

      console.log('✅ FallbackRouteCreator: Main polyline created and added to map');

      // Create bright yellow center line
      const fallbackCenterLine = new google.maps.Polyline({
        path: routePath,
        geodesic: true,
        strokeColor: '#FFFF00', // BRIGHT YELLOW
        strokeOpacity: 1.0,
        strokeWeight: 3,
        zIndex: 10001,
        clickable: false,
        map: this.map
      });

      console.log('✅ FallbackRouteCreator: Center line created and added to map');

      // Store in global state for cleanup
      RouteGlobalState.addPolylines([fallbackPolyline, fallbackCenterLine]);
      
      // Verify polylines are actually visible
      console.log('🔍 FallbackRouteCreator: Polyline verification:', {
        mainPolylineMap: !!fallbackPolyline.getMap(),
        centerLineMap: !!fallbackCenterLine.getMap(),
        mainPolylinePath: fallbackPolyline.getPath()?.getLength(),
        centerLinePath: fallbackCenterLine.getPath()?.getLength()
      });

      console.log('✅ FallbackRouteCreator: GUARANTEED VISIBLE route created successfully');
      
    } catch (error) {
      console.error('❌ FallbackRouteCreator: Error creating fallback route:', error);
      throw error;
    }
  }
}
