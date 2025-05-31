
import { RouteGlobalState } from './RouteGlobalState';
import { RouteMarkersManager } from './RouteMarkersManager';
import { RoutePolylineManager } from './RoutePolylineManager';
import { RouteCleanupManager } from './RouteCleanupManager';
import type { Route66Waypoint } from '../types/supabaseTypes';

export class RouteRenderingService {
  private markersManager: RouteMarkersManager;
  private polylineManager: RoutePolylineManager;
  private cleanupManager: RouteCleanupManager;

  constructor(private map: google.maps.Map) {
    this.markersManager = new RouteMarkersManager(map);
    this.polylineManager = new RoutePolylineManager(map);
    this.cleanupManager = new RouteCleanupManager(map, this.markersManager, this.polylineManager);
  }

  async renderRoute(waypoints: Route66Waypoint[]): Promise<void> {
    try {
      console.log('🚀 RouteRenderingService: Creating ASPHALT Route 66 with YELLOW stripes');
      
      // Step 1: Clean up any existing routes
      console.log('🧹 FORCING cleanup of existing routes for yellow stripe update...');
      this.cleanupManager.performNuclearCleanup();
      
      // Step 2: Filter ONLY major stops (Route 66 city icons) - this is critical
      const majorStops = waypoints.filter(wp => wp.is_major_stop === true);
      console.log(`🎯 Filtered to ${majorStops.length} major stops for ASPHALT route:`);
      majorStops.forEach((stop, index) => {
        console.log(`  ${index + 1}. ${stop.name} (${stop.state}) - Sequence: ${stop.sequence_order}`);
      });
      
      if (majorStops.length < 2) {
        console.warn('⚠️ Not enough major stops to create asphalt road segments');
        return;
      }

      // Step 3: Sort major stops by sequence order to ensure proper city-to-city connections
      const sortedMajorStops = majorStops.sort((a, b) => a.sequence_order - b.sequence_order);
      console.log(`🔄 Sorted major stops by sequence order for ASPHALT city-to-city connections`);

      // Step 4: Create NEW ASPHALT polylines between consecutive major stops
      console.log(`🛣️ Creating ${sortedMajorStops.length - 1} ASPHALT city-to-city road segments...`);
      
      // Add a small delay to ensure map is fully ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        this.polylineManager.createPolylines([], sortedMajorStops);
        console.log('✅ ASPHALT Route polylines created successfully');
      } catch (polylineError) {
        console.error('❌ Error creating asphalt polylines:', polylineError);
        throw polylineError; // Re-throw to be handled by caller
      }

      // Step 5: Create Route 66 shield markers ONLY for major stops
      console.log(`🛡️ Creating Route 66 shield markers for ${sortedMajorStops.length} major stops...`);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        this.markersManager.createRouteMarkers(sortedMajorStops);
        console.log('✅ Route markers created successfully');
      } catch (markerError) {
        console.error('❌ Error creating markers:', markerError);
      }

      // Step 6: Mark as created
      RouteGlobalState.setRouteCreated(true);

      console.log(`✅ ASPHALT Route 66 spine created with ${sortedMajorStops.length - 1} city-to-city segments!`);

      // Step 7: Fit map to bounds of major stops only
      setTimeout(() => {
        this.polylineManager.fitMapToBounds(sortedMajorStops);
      }, 1000);

    } catch (error) {
      console.error('❌ Error in RouteRenderingService:', error);
      throw error;
    }
  }
}
