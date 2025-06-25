
import type { Route66Waypoint } from '../../types/supabaseTypes';

export class SimplifiedRouteRenderer {
  private map: google.maps.Map;
  private polylines: google.maps.Polyline[] = [];

  constructor(map: google.maps.Map) {
    this.map = map;
  }

  createRoute66(waypoints: Route66Waypoint[]): void {
    console.log('🛣️ SimplifiedRouteRenderer: Creating Route 66 with ZERO complexity');
    
    // Clear any existing polylines
    this.clearRoute();
    
    if (waypoints.length < 2) {
      console.warn('⚠️ Need at least 2 waypoints to create route');
      return;
    }

    // Get major stops only and sort by sequence_order (no complex filtering)
    const majorStops = waypoints
      .filter(wp => wp.is_major_stop === true)
      .sort((a, b) => a.sequence_order - b.sequence_order);

    if (majorStops.length < 2) {
      console.warn('⚠️ Need at least 2 major stops');
      return;
    }

    console.log('📍 Using major stops in sequence order:', majorStops.map(s => `${s.sequence_order}. ${s.name}, ${s.state}`));

    // Create simple path from major stops
    const routePath = majorStops.map(stop => ({
      lat: stop.latitude,
      lng: stop.longitude
    }));

    // Create single polyline with good visibility
    const polyline = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#DC2626', // Bright red for visibility
      strokeOpacity: 0.8,
      strokeWeight: 6,
      zIndex: 1000,
      map: this.map
    });

    // Store polyline
    this.polylines = [polyline];

    // Add click listener
    polyline.addListener('click', (event: google.maps.MapMouseEvent) => {
      console.log('🛣️ Route 66 clicked at:', event.latLng?.toString());
    });

    console.log('✅ SimplifiedRouteRenderer: Route created successfully with', this.polylines.length, 'polylines');
    
    // Verify visibility
    setTimeout(() => {
      const isVisible = this.polylines.every(p => p.getMap() === this.map);
      console.log('🔍 Route visibility check:', isVisible);
    }, 100);
  }

  clearRoute(): void {
    console.log('🧹 SimplifiedRouteRenderer: Clearing route');
    this.polylines.forEach(polyline => {
      polyline.setMap(null);
    });
    this.polylines = [];
  }

  getPolylines(): google.maps.Polyline[] {
    return this.polylines;
  }

  isVisible(): boolean {
    return this.polylines.length > 0 && this.polylines.every(p => p.getMap() === this.map);
  }
}
