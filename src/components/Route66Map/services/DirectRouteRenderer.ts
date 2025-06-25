
import type { Route66Waypoint } from '../types/supabaseTypes';

export class DirectRouteRenderer {
  private map: google.maps.Map;
  private routePolylines: google.maps.Polyline[] = [];

  constructor(map: google.maps.Map) {
    this.map = map;
  }

  createVisibleRoute(waypoints: Route66Waypoint[]): void {
    console.log('🛣️ DirectRouteRenderer: Creating GUARANTEED VISIBLE Route 66');
    
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

    // Create path from waypoints
    const routePath = majorStops.map(stop => ({
      lat: stop.latitude,
      lng: stop.longitude
    }));

    console.log('🗺️ DirectRouteRenderer: Route path coordinates:', routePath);

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
    
    console.log('✅ DirectRouteRenderer: IMMEDIATE verification:', {
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

    console.log('✅ DirectRouteRenderer: Route 66 creation completed with forced visibility');
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
