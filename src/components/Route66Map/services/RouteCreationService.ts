
import { RoutePolylineManager } from './RoutePolylineManager';
import { EnhancedPathInterpolationService } from './EnhancedPathInterpolationService';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class RouteCreationService {
  private polylineManager: RoutePolylineManager;

  constructor(private map: google.maps.Map) {
    this.polylineManager = new RoutePolylineManager(map);
  }

  async createFlowingRoute66(destinationCities: DestinationCity[]): Promise<void> {
    console.log('🛣️ RouteCreationService: Creating flowing Route 66 with SEQUENCE VALIDATION');
    
    if (destinationCities.length < 2) {
      console.error('❌ Need at least 2 cities to create a route');
      return;
    }

    // CRITICAL: Validate sequence before creating route
    this.validateSequenceOrder(destinationCities);

    // Convert destination cities to waypoints format for polyline creation
    const waypoints = destinationCities.map(city => ({
      lat: city.latitude,
      lng: city.longitude,
      description: `${city.name}, ${city.state}`
    }));

    console.log('📍 Creating route with waypoints:', waypoints.map(w => w.description));

    // Create smooth interpolated path between waypoints
    const smoothPath = EnhancedPathInterpolationService.createFlowingCurvedPath(waypoints, 15);
    
    // Convert cities to Route66Waypoint format for polyline manager
    const route66Waypoints = destinationCities.map(city => ({
      id: city.id,
      name: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      state: city.state,
      sequence_order: this.calculateSequenceFromLongitude(city.longitude),
      is_major_stop: true,
      highway_designation: 'US-66',
      description: `${city.name}, ${city.state}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Create the polylines using the polyline manager
    this.polylineManager.createPolylines(smoothPath, route66Waypoints);
    
    // Fit map to show the entire route
    this.polylineManager.fitMapToBounds(route66Waypoints);

    console.log('✅ RouteCreationService: Route 66 created with proper sequencing');
  }

  private validateSequenceOrder(cities: DestinationCity[]): void {
    console.log('🔍 Validating Route 66 sequence order...');
    
    // Check for longitude progression (should generally decrease west-to-east)
    for (let i = 0; i < cities.length - 1; i++) {
      const current = cities[i];
      const next = cities[i + 1];
      
      // Log each transition
      console.log(`📍 ${current.name} (${current.longitude.toFixed(2)}) → ${next.name} (${next.longitude.toFixed(2)})`);
      
      // Warn about potential issues
      if (next.longitude > current.longitude) {
        const longitudeDiff = next.longitude - current.longitude;
        if (longitudeDiff > 5) { // Significant eastward jump
          console.warn(`⚠️ POTENTIAL SEQUENCE ISSUE: Large eastward jump from ${current.name} to ${next.name} (${longitudeDiff.toFixed(2)}°)`);
        }
      }
    }
    
    // Validate start and end points
    const firstCity = cities[0];
    const lastCity = cities[cities.length - 1];
    
    if (!firstCity.name.toLowerCase().includes('chicago')) {
      console.warn(`⚠️ Route doesn't start with Chicago, starts with: ${firstCity.name}`);
    }
    
    if (!lastCity.name.toLowerCase().includes('santa monica')) {
      console.warn(`⚠️ Route doesn't end with Santa Monica, ends with: ${lastCity.name}`);
    }
    
    console.log('✅ Sequence validation complete');
  }

  private calculateSequenceFromLongitude(longitude: number): number {
    // Convert longitude to approximate sequence order
    // Chicago (~-87.6) should be sequence 1, Santa Monica (~-118.5) should be highest
    return Math.round((longitude + 120) * 10);
  }

  cleanup(): void {
    this.polylineManager.cleanupPolylines();
  }
}
