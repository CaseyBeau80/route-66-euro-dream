
import { RouteGlobalState } from './RouteGlobalState';
import { PolylineCreationService } from './PolylineCreationService';
import { MapBoundsService } from './MapBoundsService';
import type { Route66Waypoint } from '../types/supabaseTypes';

export class RoutePolylineManager {
  private boundsService: MapBoundsService;

  constructor(private map: google.maps.Map) {
    this.boundsService = new MapBoundsService(map);
  }

  createPolylines(smoothRoutePath: google.maps.LatLngLiteral[], majorStopsOnly: Route66Waypoint[]): void {
    // FORCE cleanup of existing polylines first
    console.log('🧹 FORCING cleanup of existing polylines before creating new asphalt-colored route');
    this.cleanupPolylines();
    
    // Reset global state to allow recreation
    RouteGlobalState.setRouteCreated(false);
    
    if (majorStopsOnly.length === 0) {
      console.error('❌ Cannot create polylines with empty major stops array');
      return;
    }

    // VALIDATION: Ensure we're only working with major stops
    const nonMajorStops = majorStopsOnly.filter(wp => wp.is_major_stop !== true);
    if (nonMajorStops.length > 0) {
      console.error('❌ CRITICAL ERROR: Non-major stops detected in majorStopsOnly array:', 
        nonMajorStops.map(s => s.name));
      return;
    }

    console.log('🛣️ Creating NEW ASPHALT-COLORED Route 66 road path with YELLOW center stripes');
    console.log(`🎯 Input validation: ${majorStopsOnly.length} major stops confirmed`);

    if (majorStopsOnly.length < 2) {
      console.log('⚠️ Not enough major stops to create city-to-city road segments');
      return;
    }

    // Sort by sequence order to ensure proper city-to-city connections
    const sortedMajorStops = majorStopsOnly.sort((a, b) => a.sequence_order - b.sequence_order);
    
    // Create route segments using the enhanced polyline creation
    this.createRouteSegments(sortedMajorStops);

    // Mark route as created with new colors
    RouteGlobalState.setRouteCreated(true);

    console.log(`🛣️ ASPHALT Route 66 road with BRIGHT YELLOW stripes is now VISIBLE: ${sortedMajorStops.length - 1} segments between ${sortedMajorStops.length} major stops`);
  }

  private createRouteSegments(waypoints: Route66Waypoint[]): void {
    console.log('🛣️ Creating route segments from waypoints:', waypoints.length);
    
    // Create enhanced polylines using the existing service
    const polylines = PolylineCreationService.createEnhancedPolyline(this.map, waypoints);
    
    // Register polylines with global state
    polylines.forEach(polyline => {
      RouteGlobalState.addPolylineSegment(polyline);
    });
  }

  fitMapToBounds(majorStopsOnly: Route66Waypoint[]): void {
    this.boundsService.fitMapToBounds(majorStopsOnly);
  }

  cleanupPolylines(): void {
    const polylines = RouteGlobalState.getPolylineSegments();
    
    polylines.forEach(polyline => {
      polyline.setMap(null);
    });
    
    RouteGlobalState.clearPolylineSegments();

    // Legacy cleanup
    const smoothPolyline = RouteGlobalState.getSmoothPolyline();
    const centerLine = RouteGlobalState.getCenterLine();

    if (smoothPolyline) {
      smoothPolyline.setMap(null);
      RouteGlobalState.setSmoothPolyline(null);
    }
    
    if (centerLine) {
      centerLine.setMap(null);
      RouteGlobalState.setCenterLine(null);
    }
  }
}
