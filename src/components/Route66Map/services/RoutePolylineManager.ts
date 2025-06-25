
import { PolylineCreationService } from './PolylineCreationService';
import { RouteGlobalState } from './RouteGlobalState';
import type { Route66Waypoint } from '../types/supabaseTypes';

export class RoutePolylineManager {
  private polylines: google.maps.Polyline[] = [];
  private bounds: google.maps.LatLngBounds | null = null;

  constructor(private map: google.maps.Map) {}

  createPolylines(path: google.maps.LatLngLiteral[], waypoints: Route66Waypoint[]): void {
    try {
      console.log('🛣️ RoutePolylineManager: Creating polylines with improved persistence');
      
      // Gentle cleanup first - only remove our own polylines
      this.gentleCleanup();
      
      // Create enhanced polyline
      const newPolylines = PolylineCreationService.createEnhancedPolyline(this.map, waypoints);
      
      if (newPolylines && newPolylines.length > 0) {
        this.polylines = newPolylines;
        
        // Store in global state for persistence
        RouteGlobalState.addPolylines(this.polylines);
        
        console.log('✅ RoutePolylineManager: Created', this.polylines.length, 'polylines successfully');
        
        // Add persistence listeners
        this.addPersistenceListeners();
      } else {
        throw new Error('Failed to create polylines');
      }
      
    } catch (error) {
      console.error('❌ RoutePolylineManager: Error creating polylines:', error);
      throw error;
    }
  }

  private gentleCleanup(): void {
    console.log('🧹 RoutePolylineManager: Gentle cleanup of existing polylines');
    
    // Only clean up our own polylines
    this.polylines.forEach((polyline, index) => {
      try {
        polyline.setMap(null);
        console.log(`🧹 Cleaned up polyline ${index + 1}`);
      } catch (error) {
        console.warn(`⚠️ Error cleaning up polyline ${index + 1}:`, error);
      }
    });
    
    this.polylines = [];
  }

  private addPersistenceListeners(): void {
    // Add listeners to prevent accidental removal
    this.polylines.forEach((polyline, index) => {
      try {
        // Add a custom property to mark as Route 66 polyline
        (polyline as any).__route66_persistent = true;
        
        console.log(`🛡️ Added persistence protection to polyline ${index + 1}`);
      } catch (error) {
        console.warn(`⚠️ Could not add persistence to polyline ${index + 1}:`, error);
      }
    });
  }

  fitMapToBounds(waypoints: Route66Waypoint[]): void {
    if (!waypoints.length) return;

    try {
      this.bounds = new google.maps.LatLngBounds();
      
      waypoints.forEach(waypoint => {
        this.bounds!.extend({
          lat: Number(waypoint.latitude),
          lng: Number(waypoint.longitude)
        });
      });

      // Fit map with padding
      this.map.fitBounds(this.bounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
      });

      console.log('🗺️ RoutePolylineManager: Map bounds fitted to route');
      
    } catch (error) {
      console.error('❌ RoutePolylineManager: Error fitting map bounds:', error);
    }
  }

  cleanupPolylines(): void {
    console.log('🧹 RoutePolylineManager: Controlled cleanup');
    
    // Only cleanup if route is not marked as created
    if (!RouteGlobalState.isRouteCreated()) {
      this.gentleCleanup();
      console.log('✅ RoutePolylineManager: Cleanup completed');
    } else {
      console.log('🛡️ RoutePolylineManager: Skipping cleanup - route is marked as persistent');
    }
  }

  getPolylines(): google.maps.Polyline[] {
    return this.polylines;
  }
}
