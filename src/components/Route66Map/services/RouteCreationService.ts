
import { RoutePolylineManager } from './RoutePolylineManager';
import { EnhancedPathInterpolationService } from './EnhancedPathInterpolationService';
import { SimpleRoute66Validator } from './SimpleRoute66Validator';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class RouteCreationService {
  private polylineManager: RoutePolylineManager;

  constructor(private map: google.maps.Map) {
    this.polylineManager = new RoutePolylineManager(map);
  }

  async createFlowingRoute66(destinationCities: DestinationCity[]): Promise<void> {
    console.log('🛣️ SIMPLE: Creating flowing Route 66 with simple validation');
    
    if (destinationCities.length < 2) {
      console.error('❌ Need at least 2 cities to create a route');
      return;
    }

    // Simple validation
    console.log('🔍 SIMPLE: Running basic validation...');
    const validation = SimpleRoute66Validator.validateDestinationCitySequence(destinationCities);
    
    if (!validation.isValid) {
      console.error('❌ SIMPLE: Route creation failed validation:', validation.errors);
      throw new Error(`Route validation failed: ${validation.errors.join(', ')}`);
    }

    const validatedCities = validation.correctedSequence as DestinationCity[];

    // Convert destination cities to waypoints format
    const waypoints = validatedCities.map(city => ({
      lat: city.latitude,
      lng: city.longitude,
      description: `${city.name}, ${city.state}`
    }));

    console.log('📍 SIMPLE: Creating route with waypoints:', waypoints.length);

    // Create smooth interpolated path
    const smoothPath = EnhancedPathInterpolationService.createFlowingCurvedPath(waypoints, 15);
    
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

    // Create the polylines
    console.log('🛣️ SIMPLE: Creating polylines...');
    this.polylineManager.createPolylines(smoothPath, route66Waypoints);
    
    // Fit map to show the entire route
    this.polylineManager.fitMapToBounds(route66Waypoints);

    console.log('✅ SIMPLE: Route 66 created successfully');
  }

  cleanup(): void {
    this.polylineManager.cleanupPolylines();
  }
}
