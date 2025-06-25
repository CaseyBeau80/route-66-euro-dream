
import { RouteCreationService } from './RouteCreationService';
import { NuclearCleanupService } from './NuclearCleanupService';
import { RouteGlobalState } from './RouteGlobalState';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class DestinationCitiesRouteRenderer {
  private routeCreationService: RouteCreationService;
  private cleanupService: NuclearCleanupService;

  constructor(private map: google.maps.Map) {
    this.routeCreationService = new RouteCreationService(map);
    this.cleanupService = new NuclearCleanupService(map);
  }

  async createRoute66FromDestinations(destinationCities: DestinationCity[]): Promise<void> {
    console.log('🛣️ FIXED: Creating Route 66 with PROPER SEQUENCE ORDERING from destination cities');
    
    if (destinationCities.length === 0) {
      console.error('❌ No destination cities provided');
      return;
    }

    // CRITICAL FIX: Sort cities by longitude (west-to-east) to prevent ping-ponging
    const sortedCities = [...destinationCities].sort((a, b) => {
      // Route 66 runs from Chicago (east, higher longitude) to Santa Monica (west, lower longitude)
      // For proper sequence: Chicago (-87.6) → Springfield IL (-89.6) → St. Louis (-90.1) → Springfield MO (-93.2) → etc.
      return b.longitude - a.longitude; // Descending order: east to west
    });

    console.log('🔄 SEQUENCE FIX: Sorted cities by longitude (east-to-west):', 
      sortedCities.map(city => `${city.name} (${city.longitude.toFixed(1)})`));

    // Validate that we have the correct sequence
    const chicagoIndex = sortedCities.findIndex(city => city.name.toLowerCase().includes('chicago'));
    const santaMonicaIndex = sortedCities.findIndex(city => city.name.toLowerCase().includes('santa monica'));
    
    if (chicagoIndex !== 0) {
      console.warn('⚠️ Chicago is not first in sequence, manual adjustment needed');
    }
    if (santaMonicaIndex !== sortedCities.length - 1) {
      console.warn('⚠️ Santa Monica is not last in sequence, manual adjustment needed');
    }

    // Clean up any existing routes before creating new one
    this.cleanupService.performNuclearCleanup();

    try {
      // Create the route with properly sequenced cities
      await this.routeCreationService.createFlowingRoute66(sortedCities);
      
      console.log('✅ Route 66 created successfully with corrected sequence - NO MORE PING PONGING!');
      
      // Mark route as created
      RouteGlobalState.setRouteCreated(true);
      
    } catch (error) {
      console.error('❌ Error creating Route 66 from destination cities:', error);
      throw error;
    }
  }

  cleanup(): void {
    this.cleanupService.performNuclearCleanup();
  }
}
