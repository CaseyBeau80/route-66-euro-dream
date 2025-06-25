
import { RouteCreationService } from './RouteCreationService';
import { NuclearCleanupService } from './NuclearCleanupService';
import { RouteGlobalState } from './RouteGlobalState';
import { SequenceOrderService } from './SequenceOrderService';
import { Route66SequenceValidator } from './Route66SequenceValidator';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class DestinationCitiesRouteRenderer {
  private routeCreationService: RouteCreationService;
  private cleanupService: NuclearCleanupService;

  constructor(private map: google.maps.Map) {
    this.routeCreationService = new RouteCreationService(map);
    this.cleanupService = new NuclearCleanupService(map);
  }

  async createRoute66FromDestinations(destinationCities: DestinationCity[]): Promise<void> {
    console.log('🛣️ ENHANCED: Creating Route 66 with SEQUENCE VALIDATION and ping-pong prevention');
    
    if (destinationCities.length === 0) {
      console.error('❌ No destination cities provided');
      return;
    }

    // STEP 1: Validate and correct sequence using enhanced validator
    console.log('🔍 STEP 1: Validating destination city sequence...');
    const validation = Route66SequenceValidator.validateDestinationCitySequence(destinationCities);
    
    if (!validation.isValid) {
      console.error('❌ CRITICAL: Sequence validation failed:', validation.errors);
      validation.errors.forEach(error => console.error(`  • ${error}`));
      
      // Don't proceed with invalid sequence to prevent ping-ponging
      if (validation.errors.some(error => error.includes('CRITICAL'))) {
        throw new Error('Critical sequence validation failed - would cause ping-ponging');
      }
    }

    if (validation.warnings.length > 0) {
      console.warn('⚠️ Sequence warnings detected:', validation.warnings);
      validation.warnings.forEach(warning => console.warn(`  • ${warning}`));
    }

    // STEP 2: Get properly ordered cities using enhanced service
    console.log('🔄 STEP 2: Applying enhanced sequence ordering...');
    const orderedCities = SequenceOrderService.getOrderedDestinationCities(destinationCities);
    
    // STEP 3: Log sequence metadata for debugging
    const metadata = SequenceOrderService.createSequenceMetadata(orderedCities);
    console.log('📊 ENHANCED: Route sequence metadata:', metadata);
    
    if (metadata.springfieldSequence.includes('incorrect')) {
      console.error('🚨 PING-PONG ALERT: Springfield sequence will cause ping-ponging!');
      throw new Error('Springfield sequence validation failed - would cause route ping-ponging');
    }

    // STEP 4: Clean up any existing routes before creating new one
    console.log('🧹 STEP 4: Performing nuclear cleanup...');
    this.cleanupService.performNuclearCleanup();

    // STEP 5: Create the route with validated sequence
    console.log('🛣️ STEP 5: Creating route with validated sequence...');
    console.log('🎯 Final sequence order (PING-PONG PROOF):');
    Route66SequenceValidator.logSequenceAnalysis(orderedCities, 'cities');

    try {
      await this.routeCreationService.createFlowingRoute66(orderedCities);
      
      console.log('✅ ENHANCED: Route 66 created successfully with VALIDATED sequence - NO MORE PING PONGING!');
      console.log('🎯 Springfield sequence verified: Springfield, IL → St. Louis, MO → Springfield, MO');
      
      // Mark route as created
      RouteGlobalState.setRouteCreated(true);
      
    } catch (error) {
      console.error('❌ Error creating validated Route 66:', error);
      throw error;
    }
  }

  /**
   * Validate sequence before route creation
   */
  private validateSequenceIntegrity(cities: DestinationCity[]): boolean {
    console.log('🔍 Validating sequence integrity to prevent ping-ponging...');
    
    // Find critical cities
    const springfieldIL = cities.find(city => 
      city.name.toLowerCase().includes('springfield') && city.state === 'IL'
    );
    const stLouis = cities.find(city => 
      city.name.toLowerCase().includes('st. louis') || city.name.toLowerCase().includes('saint louis')
    );
    const springfieldMO = cities.find(city => 
      city.name.toLowerCase().includes('springfield') && city.state === 'MO'
    );

    if (!springfieldIL || !stLouis || !springfieldMO) {
      console.warn('⚠️ Missing critical Springfield/St. Louis cities for validation');
      return true; // Continue with available cities
    }

    const ilIndex = cities.indexOf(springfieldIL);
    const stlIndex = cities.indexOf(stLouis);
    const moIndex = cities.indexOf(springfieldMO);

    const isCorrectSequence = ilIndex < stlIndex && stlIndex < moIndex;
    
    if (!isCorrectSequence) {
      console.error('🚨 SEQUENCE INTEGRITY FAILURE:');
      console.error(`  Springfield, IL index: ${ilIndex}`);
      console.error(`  St. Louis, MO index: ${stlIndex}`);
      console.error(`  Springfield, MO index: ${moIndex}`);
      console.error('  Expected: IL < STL < MO');
      return false;
    }

    console.log('✅ Sequence integrity validated - no ping-ponging will occur');
    return true;
  }

  cleanup(): void {
    this.cleanupService.performNuclearCleanup();
  }
}
