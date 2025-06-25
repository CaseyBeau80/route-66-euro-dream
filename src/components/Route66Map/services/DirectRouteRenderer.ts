
import type { Route66Waypoint } from '../types/supabaseTypes';

export class DirectRouteRenderer {
  private map: google.maps.Map;
  private routePolylines: google.maps.Polyline[] = [];

  constructor(map: google.maps.Map) {
    this.map = map;
  }

  createVisibleRoute(waypoints: Route66Waypoint[]): void {
    console.log('🛣️ DirectRouteRenderer: Creating SMOOTH Route 66 with proper sequencing');
    
    // Clear any existing polylines first
    this.clearRoute();
    
    if (waypoints.length < 2) {
      console.warn('⚠️ DirectRouteRenderer: Need at least 2 waypoints');
      return;
    }

    // Get major stops and ensure proper west-to-east sequence
    const majorStops = this.getProperlySequencedStops(waypoints);

    if (majorStops.length < 2) {
      console.warn('⚠️ DirectRouteRenderer: Need at least 2 properly sequenced major stops');
      return;
    }

    console.log('🛣️ DirectRouteRenderer: Using properly sequenced stops:', majorStops.map(s => `${s.name} (${s.longitude.toFixed(2)})`));

    // Validate no ping-ponging
    this.validateSequence(majorStops);

    // Create path from waypoints
    const routePath = majorStops.map(stop => ({
      lat: stop.latitude,
      lng: stop.longitude
    }));

    // Create main road surface (asphalt gray)
    const roadSurface = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#404040', // Dark asphalt gray
      strokeOpacity: 0.9,
      strokeWeight: 12,
      zIndex: 999,
      clickable: true,
      editable: false,
      draggable: false,
      visible: true
    });

    // Create yellow center line (classic Route 66)
    const centerLine = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#FFD700', // Classic yellow
      strokeOpacity: 1.0,
      strokeWeight: 2,
      zIndex: 1000,
      clickable: false,
      editable: false,
      draggable: false,
      visible: true
    });

    // Create road edges for more realistic look
    const roadEdge = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#2A2A2A', // Darker edge
      strokeOpacity: 0.7,
      strokeWeight: 14,
      zIndex: 998,
      clickable: false,
      editable: false,
      draggable: false,
      visible: true
    });

    // CRITICAL: Set map directly and verify
    roadEdge.setMap(this.map);
    roadSurface.setMap(this.map);
    centerLine.setMap(this.map);

    // Store references
    this.routePolylines = [roadEdge, roadSurface, centerLine];

    // Add click listener to main surface
    roadSurface.addListener('click', (event: google.maps.MapMouseEvent) => {
      console.log('🛣️ Route 66 clicked at:', event.latLng?.toString());
    });

    // Verify creation immediately
    const edgeAttached = roadEdge.getMap() === this.map;
    const surfaceAttached = roadSurface.getMap() === this.map;
    const centerAttached = centerLine.getMap() === this.map;
    
    console.log('✅ DirectRouteRenderer: Route 66 creation verification:', {
      roadEdgeAttached: edgeAttached,
      roadSurfaceAttached: surfaceAttached,
      centerLineAttached: centerAttached,
      pathLength: routePath.length,
      sequenceValidated: true
    });

    if (!edgeAttached || !surfaceAttached || !centerAttached) {
      console.error('❌ DirectRouteRenderer: Some polylines failed to attach to map!');
    } else {
      console.log('✅ DirectRouteRenderer: SMOOTH Route 66 successfully created - NO PING PONGING');
    }
  }

  private getProperlySequencedStops(waypoints: Route66Waypoint[]): Route66Waypoint[] {
    // Filter to major stops only
    const majorStops = waypoints.filter(wp => wp.is_major_stop);
    
    // Sort by sequence order first, then by longitude (west to east) as backup
    const sortedStops = majorStops.sort((a, b) => {
      // Primary sort: sequence order
      if (a.sequence_order !== b.sequence_order) {
        return a.sequence_order - b.sequence_order;
      }
      // Secondary sort: longitude (west to east)
      return a.longitude - b.longitude;
    });

    // Take a reasonable subset to avoid overcrowding while maintaining flow
    const selectedStops = this.selectKeyStops(sortedStops);
    
    console.log('🔍 DirectRouteRenderer: Selected key stops for smooth route:', 
      selectedStops.map(s => `${s.name} (seq: ${s.sequence_order}, lng: ${s.longitude.toFixed(2)})`));
    
    return selectedStops;
  }

  private selectKeyStops(sortedStops: Route66Waypoint[]): Route66Waypoint[] {
    if (sortedStops.length <= 12) {
      return sortedStops;
    }

    // Always include start and end
    const result = [sortedStops[0]];
    
    // Select evenly spaced major stops
    const step = Math.floor(sortedStops.length / 10);
    for (let i = step; i < sortedStops.length - 1; i += step) {
      result.push(sortedStops[i]);
    }
    
    // Always include the end
    result.push(sortedStops[sortedStops.length - 1]);
    
    return result;
  }

  private validateSequence(stops: Route66Waypoint[]): void {
    console.log('🔍 DirectRouteRenderer: Validating sequence to prevent ping-ponging...');
    
    let pingPongDetected = false;
    
    for (let i = 0; i < stops.length - 2; i++) {
      const current = stops[i];
      const next = stops[i + 1];
      const afterNext = stops[i + 2];
      
      // Check for longitude ping-ponging (east-west-east or west-east-west)
      const lng1 = current.longitude;
      const lng2 = next.longitude;
      const lng3 = afterNext.longitude;
      
      // Detect if direction changes significantly (more than 1 degree backtrack)
      const direction1 = lng2 - lng1;
      const direction2 = lng3 - lng2;
      
      if (Math.sign(direction1) !== Math.sign(direction2) && 
          Math.abs(direction1) > 1 && Math.abs(direction2) > 1) {
        console.warn(`🚨 DirectRouteRenderer: PING-PONG DETECTED between ${current.name} → ${next.name} → ${afterNext.name}`);
        console.warn(`   Longitudes: ${lng1.toFixed(2)} → ${lng2.toFixed(2)} → ${lng3.toFixed(2)}`);
        pingPongDetected = true;
      }
    }
    
    if (!pingPongDetected) {
      console.log('✅ DirectRouteRenderer: Sequence validation passed - NO PING-PONGING');
    } else {
      console.error('❌ DirectRouteRenderer: PING-PONGING DETECTED! Route will zigzag');
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
