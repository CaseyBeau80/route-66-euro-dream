
import { RoutePolylineManager } from './RoutePolylineManager';
import { EnhancedPathInterpolationService } from './EnhancedPathInterpolationService';
import { SimpleRoute66Validator } from './SimpleRoute66Validator';
import { RouteGlobalState } from './RouteGlobalState';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class RouteCreationService {
  private polylineManager: RoutePolylineManager;
  private isCreating: boolean = false;

  constructor(private map: google.maps.Map) {
    this.polylineManager = new RoutePolylineManager(map);
  }

  async createFlowingRoute66(destinationCities: DestinationCity[]): Promise<void> {
    if (this.isCreating) {
      console.log('🚫 RouteCreationService: Already creating route, skipping');
      return;
    }

    if (RouteGlobalState.isRouteCreated()) {
      console.log('🚫 RouteCreationService: Route already exists globally, skipping');
      return;
    }

    this.isCreating = true;
    
    try {
      console.log('🛣️ RouteCreationService: Creating flowing Route 66 with improved logic');
      
      if (destinationCities.length < 2) {
        throw new Error('Need at least 2 cities to create a route');
      }

      // Enhanced validation with fallback
      console.log('🔍 RouteCreationService: Running enhanced validation...');
      const validation = SimpleRoute66Validator.validateDestinationCitySequence(destinationCities);
      
      if (!validation.isValid && validation.errors.length > 0) {
        console.warn('⚠️ RouteCreationService: Validation warnings:', validation.errors);
        // Continue with original sequence if validation fails
      }

      const validatedCities = validation.correctedSequence as DestinationCity[] || destinationCities;

      // Convert destination cities to waypoints format
      const waypoints = validatedCities.map(city => ({
        lat: city.latitude,
        lng: city.longitude,
        description: `${city.name}, ${city.state}`
      }));

      console.log('📍 RouteCreationService: Creating route with waypoints:', waypoints.length);

      // Create smooth interpolated path with error handling
      let smoothPath;
      try {
        smoothPath = EnhancedPathInterpolationService.createFlowingCurvedPath(waypoints, 15);
      } catch (error) {
        console.warn('⚠️ RouteCreationService: Path interpolation failed, using direct path:', error);
        smoothPath = waypoints;
      }
      
      // Convert cities to Route66Waypoint format for polyline manager
      const route66Waypoints = validatedCities.map((city, index) => ({
        id: city.id,
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
        state: city.state,
        sequence_order: index + 1,
        is_major_stop: true,
        highway_designation: 'US-66',
        description: `${city.name}, ${city.state}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      // Create the polylines with persistence check
      console.log('🛣️ RouteCreationService: Creating persistent polylines...');
      await this.createPersistentPolylines(smoothPath, route66Waypoints);
      
      // Fit map to show the entire route
      this.polylineManager.fitMapToBounds(route66Waypoints);

      // Mark route as created globally
      RouteGlobalState.setRouteCreated(true);
      console.log('✅ RouteCreationService: Route 66 created successfully and marked as persistent');
      
    } catch (error) {
      console.error('❌ RouteCreationService: Error creating Route 66:', error);
      // Clear the creation flag so we can retry
      RouteGlobalState.setRouteCreated(false);
      throw error;
    } finally {
      this.isCreating = false;
    }
  }

  private async createPersistentPolylines(smoothPath: any[], route66Waypoints: any[]): Promise<void> {
    try {
      // Create polylines with persistence
      this.polylineManager.createPolylines(smoothPath, route66Waypoints);
      
      // Verify polylines were created
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const polylineCount = RouteGlobalState.getPolylineCount();
      console.log('🔍 RouteCreationService: Polyline verification:', {
        created: polylineCount > 0,
        count: polylineCount
      });
      
      if (polylineCount === 0) {
        throw new Error('Polylines were not created successfully');
      }
      
    } catch (error) {
      console.error('❌ RouteCreationService: Persistent polyline creation failed:', error);
      throw error;
    }
  }

  cleanup(): void {
    console.log('🧹 RouteCreationService: Gentle cleanup');
    // Only cleanup if we're not in the middle of creating
    if (!this.isCreating) {
      this.polylineManager.cleanupPolylines();
    }
  }
}
