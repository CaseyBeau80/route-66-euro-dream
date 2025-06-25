
import { RoutePolylineManager } from './RoutePolylineManager';
import { EnhancedPathInterpolationService } from './EnhancedPathInterpolationService';
import { Route66SequenceValidator } from './Route66SequenceValidator';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class RouteCreationService {
  private polylineManager: RoutePolylineManager;

  constructor(private map: google.maps.Map) {
    this.polylineManager = new RoutePolylineManager(map);
  }

  async createFlowingRoute66(destinationCities: DestinationCity[]): Promise<void> {
    console.log('🛣️ ENHANCED: Creating flowing Route 66 with COMPREHENSIVE VALIDATION');
    
    if (destinationCities.length < 2) {
      console.error('❌ Need at least 2 cities to create a route');
      return;
    }

    // ENHANCED: Validate sequence before proceeding
    console.log('🔍 ENHANCED: Running comprehensive sequence validation...');
    const validation = Route66SequenceValidator.validateDestinationCitySequence(destinationCities);
    
    if (!validation.isValid) {
      console.error('❌ ENHANCED: Route creation aborted due to validation failures:', validation.errors);
      throw new Error(`Route validation failed: ${validation.errors.join(', ')}`);
    }

    if (validation.warnings.length > 0) {
      console.warn('⚠️ ENHANCED: Route warnings detected:', validation.warnings);
    }

    // ENHANCED: Log comprehensive sequence analysis
    Route66SequenceValidator.logSequenceAnalysis(destinationCities, 'cities');

    // Convert destination cities to waypoints format for polyline creation
    const waypoints = destinationCities.map(city => ({
      lat: city.latitude,
      lng: city.longitude,
      description: `${city.name}, ${city.state}`
    }));

    console.log('📍 ENHANCED: Creating route with validated waypoints:');
    waypoints.forEach((waypoint, index) => {
      console.log(`  ${index + 1}. ${waypoint.description} (${waypoint.lat.toFixed(2)}, ${waypoint.lng.toFixed(2)})`);
    });

    // Create smooth interpolated path between waypoints
    const smoothPath = EnhancedPathInterpolationService.createFlowingCurvedPath(waypoints, 15);
    
    // Convert cities to Route66Waypoint format for polyline manager
    const route66Waypoints = destinationCities.map((city, index) => ({
      id: city.id,
      name: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      state: city.state,
      sequence_order: index + 1, // Use position in validated sequence
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

    console.log('✅ ENHANCED: Route 66 created with VALIDATED sequence - NO PING-PONGING!');
    
    // Final verification log
    this.logFinalVerification(destinationCities);
  }

  /**
   * ENHANCED: Log final verification of route sequence
   */
  private logFinalVerification(cities: DestinationCity[]): void {
    console.log('🔍 ENHANCED: Final route verification...');
    
    const springfieldIL = cities.find(city => 
      city.name.toLowerCase().includes('springfield') && city.state === 'IL'
    );
    const stLouis = cities.find(city => 
      city.name.toLowerCase().includes('st. louis') || city.name.toLowerCase().includes('saint louis')
    );
    const springfieldMO = cities.find(city => 
      city.name.toLowerCase().includes('springfield') && city.state === 'MO'
    );

    if (springfieldIL && stLouis && springfieldMO) {
      const ilIndex = cities.indexOf(springfieldIL);
      const stlIndex = cities.indexOf(stLouis);
      const moIndex = cities.indexOf(springfieldMO);
      
      console.log('🎯 ENHANCED: Critical sequence verification:');
      console.log(`  Springfield, IL: Position ${ilIndex + 1} (${springfieldIL.longitude.toFixed(2)}°)`);
      console.log(`  St. Louis, MO: Position ${stlIndex + 1} (${stLouis.longitude.toFixed(2)}°)`);
      console.log(`  Springfield, MO: Position ${moIndex + 1} (${springfieldMO.longitude.toFixed(2)}°)`);
      
      if (ilIndex < stlIndex && stlIndex < moIndex) {
        console.log('✅ ENHANCED: PERFECT SEQUENCE - No ping-ponging will occur!');
      } else {
        console.error('🚨 ENHANCED: SEQUENCE ERROR DETECTED - Ping-ponging may occur!');
      }
    }
    
    // Check longitude progression
    let correctTransitions = 0;
    let totalTransitions = cities.length - 1;
    
    for (let i = 0; i < cities.length - 1; i++) {
      const current = cities[i];
      const next = cities[i + 1];
      
      if (current.longitude >= next.longitude) {
        correctTransitions++;
      }
    }
    
    const progressionPercentage = (correctTransitions / totalTransitions) * 100;
    console.log(`🔍 ENHANCED: Longitude progression: ${progressionPercentage.toFixed(1)}% correct (${correctTransitions}/${totalTransitions})`);
    
    if (progressionPercentage >= 80) {
      console.log('✅ ENHANCED: Excellent longitude progression - route flows naturally');
    } else {
      console.warn('⚠️ ENHANCED: Suboptimal longitude progression - may have some backtracking');
    }
  }

  cleanup(): void {
    this.polylineManager.cleanupPolylines();
  }
}
