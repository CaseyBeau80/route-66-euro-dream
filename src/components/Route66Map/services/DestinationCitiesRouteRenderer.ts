
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
      console.log('🛣️ CREATING flowing Route 66 with integrated Santa Fe branch');
      console.log('🔧 DEBUG: Starting flowing route creation with Santa Fe branch in main route');
      
      // Step 1: NUCLEAR cleanup with cache clearing
      await this.performNuclearCleanupWithCacheClearing();
      
      // Step 2: Force recreation flag
      this.forceRecreateFlag = true;
      
      // Step 3: Create the flowing route with integrated Santa Fe branch
      await this.routeCreationService.createMainRoute(cities);

      console.log('✅ FLOWING Route 66 CREATED: Santa Rosa → Santa Fe → Albuquerque → Gallup continuous flow');

    } catch (error) {
      console.error('❌ Error creating flowing Route 66 with Santa Fe branch:', error);
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
    console.log('🧹 Cleaning up flowing Route 66 with integrated Santa Fe branch');
    this.routeCreationService.cleanup();
  }
}
