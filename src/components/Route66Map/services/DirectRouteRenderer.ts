
import type { Route66Waypoint } from '../types/supabaseTypes';

export class DirectRouteRenderer {
  private map: google.maps.Map;
  private routePolylines: google.maps.Polyline[] = [];

  constructor(map: google.maps.Map) {
    this.map = map;
  }

  createVisibleRoute(waypoints: Route66Waypoint[]): void {
    console.log('🛣️ DirectRouteRenderer: Creating ANTI-PING-PONG Route 66');
    
    // Clear any existing polylines first
    this.clearRoute();
    
    if (waypoints.length < 2) {
      console.warn('⚠️ DirectRouteRenderer: Need at least 2 waypoints');
      return;
    }

    // Get major stops with STRICT anti-ping-pong filtering
    const smoothedStops = this.createSmoothWestToEastRoute(waypoints);

    if (smoothedStops.length < 2) {
      console.warn('⚠️ DirectRouteRenderer: Need at least 2 smoothed stops');
      return;
    }

    console.log('🛣️ DirectRouteRenderer: Using ANTI-PING-PONG stops:', smoothedStops.map(s => `${s.name} (${s.longitude.toFixed(2)})`));

    // Create path from smoothed waypoints
    const routePath = smoothedStops.map(stop => ({
      lat: stop.latitude,
      lng: stop.longitude
    }));

    console.log('🗺️ DirectRouteRenderer: Anti-ping-pong route path:', routePath);

    // Create road edge (darker outline) first
    const roadEdge = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#2A2A2A',
      strokeOpacity: 0.8,
      strokeWeight: 16,
      zIndex: 1000,
      clickable: false,
      editable: false,
      draggable: false,
      visible: true
    });

    // Create main road surface (asphalt gray)
    const roadSurface = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#404040',
      strokeOpacity: 0.9,
      strokeWeight: 12,
      zIndex: 1001,
      clickable: true,
      editable: false,
      draggable: false,
      visible: true
    });

    // Create yellow center line (classic Route 66)
    const centerLine = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#FFD700',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      zIndex: 1002,
      clickable: false,
      editable: false,
      draggable: false,
      visible: true
    });

    // CRITICAL: Set map and force visibility
    console.log('🔧 DirectRouteRenderer: Setting polylines to map');
    roadEdge.setMap(this.map);
    roadSurface.setMap(this.map);
    centerLine.setMap(this.map);

    // Store references AFTER setting to map
    this.routePolylines = [roadEdge, roadSurface, centerLine];

    // Verify immediate attachment
    const edgeAttached = roadEdge.getMap() === this.map;
    const surfaceAttached = roadSurface.getMap() === this.map;
    const centerAttached = centerLine.getMap() === this.map;
    
    console.log('✅ DirectRouteRenderer: ANTI-PING-PONG verification:', {
      roadEdgeAttached: edgeAttached,
      roadSurfaceAttached: surfaceAttached,
      centerLineAttached: centerAttached,
      pathLength: routePath.length,
      polylineCount: this.routePolylines.length
    });

    // Add click listener to main surface
    roadSurface.addListener('click', (event: google.maps.MapMouseEvent) => {
      console.log('🛣️ Route 66 clicked at:', event.latLng?.toString());
    });

    // Force a map refresh to ensure visibility
    setTimeout(() => {
      console.log('🔄 DirectRouteRenderer: Forcing map refresh for visibility');
      
      // Check if polylines are still attached
      this.routePolylines.forEach((polyline, index) => {
        const isAttached = polyline.getMap() === this.map;
        console.log(`🔍 Polyline ${index + 1} attachment check:`, isAttached);
        
        if (!isAttached) {
          console.log(`🔧 Re-attaching polyline ${index + 1} to map`);
          polyline.setMap(this.map);
        }
      });

      // Trigger a small map movement to force redraw
      const currentCenter = this.map.getCenter();
      if (currentCenter) {
        const lat = currentCenter.lat();
        const lng = currentCenter.lng();
        this.map.panTo(new google.maps.LatLng(lat + 0.0001, lng + 0.0001));
        setTimeout(() => {
          this.map.panTo(new google.maps.LatLng(lat, lng));
        }, 100);
      }
    }, 100);

    console.log('✅ DirectRouteRenderer: ANTI-PING-PONG Route 66 creation completed');
  }

  /**
   * Creates a perfectly smooth west-to-east route by eliminating ALL ping-ponging
   */
  private createSmoothWestToEastRoute(waypoints: Route66Waypoint[]): Route66Waypoint[] {
    console.log('🚫 ANTI-PING-PONG: Creating perfectly smooth west-to-east route');
    
    // Filter to major stops only first
    const majorStops = waypoints.filter(wp => wp.is_major_stop);
    
    // Sort by longitude (west to east) - ignore sequence_order as it may be causing ping-pong
    const westToEastSorted = majorStops.sort((a, b) => a.longitude - b.longitude);
    
    console.log('📍 All major stops west-to-east:', westToEastSorted.map(s => `${s.name} (${s.longitude.toFixed(2)})`));
    
    // Apply strict anti-ping-pong filtering
    const smoothRoute = this.applyStrictAntiPingPongFilter(westToEastSorted);
    
    console.log('✅ ANTI-PING-PONG: Final smooth route:', smoothRoute.map(s => `${s.name} (${s.longitude.toFixed(2)})`));
    
    return smoothRoute;
  }

  /**
   * Applies strict filtering to prevent ANY backtracking
   */
  private applyStrictAntiPingPongFilter(sortedStops: Route66Waypoint[]): Route66Waypoint[] {
    if (sortedStops.length <= 2) return sortedStops;
    
    console.log('🔍 ANTI-PING-PONG: Applying strict backtracking prevention');
    
    const smoothStops: Route66Waypoint[] = [sortedStops[0]]; // Always include first stop
    let lastLongitude = sortedStops[0].longitude;
    
    // Only include stops that continue the eastward progression
    for (let i = 1; i < sortedStops.length; i++) {
      const currentStop = sortedStops[i];
      
      // Only add if it's definitely east of the last added stop
      if (currentStop.longitude > lastLongitude + 0.1) { // 0.1 degree buffer to prevent tiny ping-pongs
        smoothStops.push(currentStop);
        lastLongitude = currentStop.longitude;
        console.log(`✅ Added ${currentStop.name} (${currentStop.longitude.toFixed(2)}) - continuing eastward`);
      } else {
        console.log(`🚫 Skipped ${currentStop.name} (${currentStop.longitude.toFixed(2)}) - would cause backtrack from ${lastLongitude.toFixed(2)}`);
      }
    }
    
    // If we have too few stops, space them out more evenly
    if (smoothStops.length < 8) {
      return this.selectEvenlySpacedStops(smoothStops, Math.min(10, sortedStops.length));
    }
    
    return smoothStops;
  }

  /**
   * Selects evenly spaced stops for a smoother route
   */
  private selectEvenlySpacedStops(stops: Route66Waypoint[], targetCount: number): Route66Waypoint[] {
    if (stops.length <= targetCount) return stops;
    
    const result: Route66Waypoint[] = [stops[0]]; // Always include first
    
    const step = Math.floor(stops.length / (targetCount - 1));
    for (let i = step; i < stops.length - 1; i += step) {
      result.push(stops[i]);
    }
    
    result.push(stops[stops.length - 1]); // Always include last
    
    console.log('📏 Selected evenly spaced stops:', result.map(s => `${s.name} (${s.longitude.toFixed(2)})`));
    
    return result;
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
    const visible = this.routePolylines.length > 0 && 
           this.routePolylines.every(polyline => polyline.getMap() === this.map);
    
    console.log('🔍 DirectRouteRenderer: Route visibility check:', {
      polylineCount: this.routePolylines.length,
      allAttached: visible,
      individualStatus: this.routePolylines.map((p, i) => ({
        index: i + 1,
        attached: p.getMap() === this.map
      }))
    });
    
    return visible;
  }
}
