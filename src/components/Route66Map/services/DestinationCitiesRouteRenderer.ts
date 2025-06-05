
import { RouteCreationService } from './RouteCreationService';
import { NuclearCleanupService } from './NuclearCleanupService';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class DestinationCitiesRouteRenderer {
  private map: google.maps.Map;
  private routeCreationService: RouteCreationService;
  private forceRecreateFlag: boolean = false;

  constructor(map: google.maps.Map) {
    this.map = map;
    this.routeCreationService = new RouteCreationService(map);
  }

  async createRoute66FromDestinations(cities: DestinationCity[]): Promise<void> {
    try {
      console.log('🛣️ FORCE RECREATING Route 66: Santa Rosa → Santa Fe branch, NO Albuquerque main route');
      console.log('🔧 DEBUG: Starting route creation with cache clearing and force re-render');
      
      // Step 1: NUCLEAR cleanup with cache clearing
      await this.performNuclearCleanupWithCacheClearing();
      
      // Step 2: Force recreation flag
      this.forceRecreateFlag = true;
      
      // Step 3: Create the route using the refactored service
      await this.routeCreationService.createMainRoute(cities);

      console.log('✅ HISTORICALLY ACCURATE Route 66 FORCE CREATED: Santa Rosa → Santa Fe branch, consistent road formatting');

    } catch (error) {
      console.error('❌ Error creating FORCE RECREATED Route 66:', error);
      await this.cleanup();
      throw error;
    }
  }

  private async performNuclearCleanupWithCacheClearing(): Promise<void> {
    // Clean up existing route creation service
    this.routeCreationService.cleanup();
    
    // Perform nuclear cleanup
    await NuclearCleanupService.performNuclearCleanupWithCacheClearing(this.map);
  }

  async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up complete Route 66 with Santa Fe branch');
    this.routeCreationService.cleanup();
  }
}
