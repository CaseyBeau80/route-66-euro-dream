
import type { Route66Waypoint } from '../types/supabaseTypes';

export class AuthoritativeRoute66Renderer {
  private map: google.maps.Map;
  private polyline: google.maps.Polyline | null = null;
  private static instance: AuthoritativeRoute66Renderer | null = null;

  constructor(map: google.maps.Map) {
    this.map = map;
    
    // Ensure only one instance exists
    if (AuthoritativeRoute66Renderer.instance) {
      AuthoritativeRoute66Renderer.instance.clearRoute();
    }
    AuthoritativeRoute66Renderer.instance = this;
  }

  static clearAllInstances(): void {
    if (AuthoritativeRoute66Renderer.instance) {
      AuthoritativeRoute66Renderer.instance.clearRoute();
      AuthoritativeRoute66Renderer.instance = null;
    }
  }

  createRoute66(waypoints: Route66Waypoint[]): void {
    console.log('🚀 AuthoritativeRoute66Renderer: Creating the ONE TRUE Route 66');
    
    // Clear any existing route first
    this.clearRoute();
    
    if (waypoints.length < 2) {
      console.warn('⚠️ Need at least 2 waypoints');
      return;
    }

    // Get ONLY major stops and sort by sequence_order
    const majorStops = waypoints
      .filter(wp => wp.is_major_stop === true)
      .sort((a, b) => a.sequence_order - b.sequence_order);

    console.log('📍 Major stops for Route 66:', majorStops.map(s => `${s.sequence_order}. ${s.name}, ${s.state}`));

    if (majorStops.length < 2) {
      console.warn('⚠️ Need at least 2 major stops');
      return;
    }

    // Create simple, clean path
    const routePath: google.maps.LatLngLiteral[] = majorStops.map(stop => ({
      lat: stop.latitude,
      lng: stop.longitude
    }));

    console.log('🛣️ Creating route with path:', routePath.length, 'points');

    // Create the ONE polyline with maximum visibility
    this.polyline = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#FF0000', // Bright red for maximum visibility
      strokeOpacity: 1.0,     // Full opacity
      strokeWeight: 8,        // Thick line
      zIndex: 10000,          // Highest z-index
      clickable: true,
      editable: false,
      draggable: false,
      visible: true,
      map: this.map
    });

    // Add click listener
    this.polyline.addListener('click', (event: google.maps.MapMouseEvent) => {
      console.log('🛣️ Route 66 clicked at:', event.latLng?.toString());
    });

    console.log('✅ AuthoritativeRoute66Renderer: Route created successfully');
    
    // Verify it's attached
    setTimeout(() => {
      const isAttached = this.polyline?.getMap() === this.map;
      console.log('🔍 Route attachment verification:', isAttached);
    }, 100);
  }

  clearRoute(): void {
    console.log('🧹 AuthoritativeRoute66Renderer: Clearing route');
    if (this.polyline) {
      this.polyline.setMap(null);
      this.polyline = null;
    }
  }

  isVisible(): boolean {
    return this.polyline !== null && this.polyline.getMap() === this.map;
  }

  getPolyline(): google.maps.Polyline | null {
    return this.polyline;
  }
}
