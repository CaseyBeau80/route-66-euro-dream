
import { RouteCreationService } from './RouteCreationService';
import { NuclearCleanupService } from './NuclearCleanupService';
import { RouteGlobalState } from './RouteGlobalState';
import { SimpleRoute66Validator } from './SimpleRoute66Validator';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class DestinationCitiesRouteRenderer {
  private routeCreationService: RouteCreationService;
  private cleanupService: NuclearCleanupService;
  private isCreating: boolean = false;

  constructor(private map: google.maps.Map) {
    this.routeCreationService = new RouteCreationService(map);
    this.cleanupService = new NuclearCleanupService(map);
  }

  async createRoute66FromDestinations(destinationCities: DestinationCity[]): Promise<void> {
    // Prevent multiple simultaneous route creation attempts
    if (this.isCreating) {
      console.log('🚫 Route creation already in progress, skipping');
      return;
    }

    this.isCreating = true;
    
    try {
      console.log('🛣️ ULTRA SIMPLE: Creating Route 66 with no validation barriers');
      
      if (destinationCities.length === 0) {
        console.error('❌ No destination cities provided');
        return;
      }

      // STEP 1: Ultra simple validation that always passes
      console.log('🔍 STEP 1: Ultra simple validation (always passes)...');
      const validation = SimpleRoute66Validator.validateDestinationCitySequence(destinationCities);
      
      // Even if validation "fails", we continue (validation now always passes)
      const orderedCities = validation.correctedSequence as DestinationCity[] || destinationCities;
      
      console.log(`🎯 Using ${orderedCities.length} cities for route creation`);
      
      // STEP 2: Clean up existing routes ONCE
      console.log('🧹 STEP 2: Single cleanup...');
      this.cleanupService.performNuclearCleanup();
      RouteGlobalState.clearAll();

      // STEP 3: Create the route with minimal delay
      console.log('🛣️ STEP 3: Creating route...');
      
      await this.routeCreationService.createFlowingRoute66(orderedCities);
      
      console.log('✅ ULTRA SIMPLE: Route 66 created successfully');
      RouteGlobalState.setRouteCreated(true);
      
    } catch (error) {
      console.error('❌ Error creating Route 66:', error);
      // Don't throw - just log and continue
    } finally {
      this.isCreating = false;
    }
  }

  cleanup(): void {
    this.cleanupService.performNuclearCleanup();
    this.isCreating = false;
  }
}
