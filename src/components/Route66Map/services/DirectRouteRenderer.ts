
import type { Route66Waypoint } from '../types/supabaseTypes';

export class DirectRouteRenderer {
  private map: google.maps.Map;
  private routePolylines: google.maps.Polyline[] = [];

  constructor(map: google.maps.Map) {
    this.map = map;
  }

  createVisibleRoute(waypoints: Route66Waypoint[]): void {
    console.log('🛣️ DirectRouteRenderer: Creating DIRECT visible route with', waypoints.length, 'waypoints');
    
    // Clear any existing polylines first
    this.clearRoute();
    
    if (waypoints.length < 2) {
      console.warn('⚠️ DirectRouteRenderer: Need at least 2 waypoints');
      return;
    }

    // Filter to major stops and sort by sequence order
    const majorStops = waypoints
      .filter(wp => wp.is_major_stop)
      .sort((a, b) => a.sequence_order - b.sequence_order)
      .slice(0, 15); // Limit to prevent overcrowding

    if (majorStops.length < 2) {
      console.warn('⚠️ DirectRouteRenderer: Need at least 2 major stops');
      return;
    }

    console.log('🛣️ DirectRouteRenderer: Using major stops:', majorStops.map(s => s.name));

    // Create path from waypoints
    const routePath = majorStops.map(stop => ({
      lat: stop.latitude,
      lng: stop.longitude
    }));

    // Create main route polyline with maximum visibility
    const mainPolyline = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#8B0000', // Dark red - classic Route 66 color
      strokeOpacity: 0.8,
      strokeWeight: 8,
      zIndex: 1000,
      clickable: true,
      editable: false,
      draggable: false,
      visible: true
    });

    // Create center line for classic highway look
    const centerLine = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#FFD700', // Gold yellow center line
      strokeOpacity: 0.9,
      strokeWeight: 2,
      zIndex: 1001,
      clickable: false,
      editable: false,
      draggable: false,
      visible: true
    });

    // CRITICAL: Set map directly and verify
    mainPolyline.setMap(this.map);
    centerLine.setMap(this.map);

    // Store references
    this.routePolylines = [mainPolyline, centerLine];

    // Add click listener to main polyline
    mainPolyline.addListener('click', (event: google.maps.MapMouseEvent) => {
      console.log('🛣️ Route clicked at:', event.latLng?.toString());
    });

    // Verify creation immediately
    const mainAttached = mainPolyline.getMap() === this.map;
    const centerAttached = centerLine.getMap() === this.map;
    
    console.log('✅ DirectRouteRenderer: Route creation verification:', {
      mainPolylineAttached: mainAttached,
      centerLineAttached: centerAttached,
      pathLength: routePath.length,
      mapExists: !!this.map
    });

    if (!mainAttached || !centerAttached) {
      console.error('❌ DirectRouteRenderer: Polylines failed to attach to map!');
    } else {
      console.log('✅ DirectRouteRenderer: Route 66 successfully created and visible');
    }
  }

  clearRoute(): void {
    console.log('🧹 DirectRouteRenderer: Clearing existing route');
    this.routePolylines.forEach((polyline, index) => {
      try {
        polyline.setMap(null);
        console.log(`🧹 Cleared polyline ${index + 1}`);
      } catch (error) {
        console.warn(`⚠️ Error clearing polyline ${index + 1}:`, error);
      }
    });
    this.routePolylines = [];
  }

  getPolylines(): google.maps.Polyline[] {
    return this.routePolylines;
  }

  isRouteVisible(): boolean {
    return this.routePolylines.length > 0 && 
           this.routePolylines.every(polyline => polyline.getMap() === this.map);
  }
}
