
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
      // Create main asphalt polyline - MAXIMUM VISIBILITY
      const fallbackPolyline = new google.maps.Polyline({
        path: routePath,
        geodesic: true,
        strokeColor: '#FF0000', // BRIGHT RED to ensure visibility
        strokeOpacity: 1.0, // Full opacity
        strokeWeight: 12, // Very thick line
        zIndex: 10000, // High z-index
        clickable: false,
        draggable: false,
        editable: false,
        visible: true // Explicitly set visible
      });

      // EXPLICITLY set the map
      fallbackPolyline.setMap(this.map);
      console.log('✅ FallbackRouteCreator: Main polyline created and explicitly set to map');

      // Verify the polyline is attached to the map
      const isAttachedToMap = fallbackPolyline.getMap() === this.map;
      console.log('🔍 FallbackRouteCreator: Polyline attached to map?', isAttachedToMap);

      // Create bright yellow center line
      const fallbackCenterLine = new google.maps.Polyline({
        path: routePath,
        geodesic: true,
        strokeColor: '#FFFF00', // BRIGHT YELLOW
        strokeOpacity: 1.0,
        strokeWeight: 4,
        zIndex: 10001,
        clickable: false,
        draggable: false,
        editable: false,
        visible: true
      });

      // EXPLICITLY set the map for center line
      fallbackCenterLine.setMap(this.map);
      console.log('✅ FallbackRouteCreator: Center line created and explicitly set to map');

      // Verify the center line is attached to the map
      const isCenterLineAttachedToMap = fallbackCenterLine.getMap() === this.map;
      console.log('🔍 FallbackRouteCreator: Center line attached to map?', isCenterLineAttachedToMap);

      // Store in global state for cleanup
      RouteGlobalState.addPolylines([fallbackPolyline, fallbackCenterLine]);
      
      // Final verification - check if polylines are actually visible on the map
      setTimeout(() => {
        const mainPolylineStillOnMap = fallbackPolyline.getMap() === this.map;
        const centerLineStillOnMap = fallbackCenterLine.getMap() === this.map;
        console.log('🔍 FallbackRouteCreator: Final verification after 100ms:', {
          mainPolylineStillOnMap,
          centerLineStillOnMap,
          globalPolylineCount: RouteGlobalState.getPolylineCount()
        });
      }, 100);

      console.log('✅ FallbackRouteCreator: GUARANTEED VISIBLE route created successfully');
      
    } catch (error) {
      console.error('❌ FallbackRouteCreator: Error creating fallback route:', error);
      throw error;
    }
  }
}
