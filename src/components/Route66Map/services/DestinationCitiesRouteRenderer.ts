
import { RouteCreationService } from './RouteCreationService';
import { NuclearCleanupService } from './NuclearCleanupService';
import { RouteGlobalState } from './RouteGlobalState';
import { SequenceOrderService } from './SequenceOrderService';
import { SimpleRoute66Validator } from './SimpleRoute66Validator';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class DestinationCitiesRouteRenderer {
  private routeCreationService: RouteCreationService;
  private cleanupService: NuclearCleanupService;

  constructor(private map: google.maps.Map) {
    this.routeCreationService = new RouteCreationService(map);
    this.cleanupService = new NuclearCleanupService(map);
  }

  async createRoute66FromDestinations(destinationCities: DestinationCity[]): Promise<void> {
    console.log('🛣️ SIMPLE: Creating Route 66 with simplified validation');
    
    if (destinationCities.length === 0) {
      console.error('❌ No destination cities provided');
      return;
    }

    // STEP 1: Simple validation and deduplication
    console.log('🔍 STEP 1: Simple validation and deduplication...');
    const validation = SimpleRoute66Validator.validateDestinationCitySequence(destinationCities);
    
    if (!validation.isValid) {
      console.error('❌ Validation failed:', validation.errors);
      return;
    }

    // STEP 2: Get deduplicated and ordered cities
    console.log('🔄 STEP 2: Using validated cities...');
    const orderedCities = validation.correctedSequence as DestinationCity[];
    
    // STEP 3: Log final sequence
    SimpleRoute66Validator.logSequenceAnalysis(orderedCities, 'cities');
    
    // STEP 4: Clean up existing routes
    console.log('🧹 STEP 4: Cleaning up existing routes...');
    this.cleanupService.performNuclearCleanup();
    RouteGlobalState.clearAll();

    // STEP 5: Create the route
    console.log('🛣️ STEP 5: Creating route with simplified process...');
    
    try {
      await this.routeCreationService.createFlowingRoute66(orderedCities);
      
      console.log('✅ SIMPLE: Route 66 created successfully');
      RouteGlobalState.setRouteCreated(true);
      
    } catch (error) {
      console.error('❌ Error creating Route 66:', error);
      throw error;
    }
  }

  cleanup(): void {
    this.cleanupService.performNuclearCleanup();
  }
}
