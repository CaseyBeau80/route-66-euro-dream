
import { RouteCreationService } from './RouteCreationService';
import { NuclearCleanupService } from './NuclearCleanupService';
import { RouteGlobalState } from './RouteGlobalState';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class DestinationCitiesRouteRenderer {
  private map: google.maps.Map;
  private routeCreationService: RouteCreationService;

  constructor(map: google.maps.Map) {
    this.map = map;
    this.routeCreationService = new RouteCreationService(map);
  }

  async createRoute66FromDestinations(cities: DestinationCity[]): Promise<void> {
    try {
      console.log('🛣️ CREATING single flowing Route 66 from destination cities (PRIMARY DATA SOURCE)');
      console.log('🔧 DEBUG: Using destination_cities table as single source of truth');
      
      // Step 1: NUCLEAR cleanup to remove any existing routes
      await this.performNuclearCleanupWithCacheClearing();
      
      // Step 2: Sort cities in Route 66 order for flowing route
      const sortedCities = this.sortCitiesInRoute66Order(cities);
      console.log('🔧 DEBUG: Sorted destination cities:', sortedCities.map(c => `${c.name}, ${c.state}`));
      
      // Step 3: Create the single flowing route
      await this.routeCreationService.createMainRoute(sortedCities);

      // Step 4: Mark as primary route created
      RouteGlobalState.setRouteCreated(true);

      console.log('✅ SINGLE FLOWING Route 66 CREATED from destination cities (no waypoints conflicts)');

    } catch (error) {
      console.error('❌ Error creating flowing Route 66 from destination cities:', error);
      await this.cleanup();
      throw error;
    }
  }

  private sortCitiesInRoute66Order(cities: DestinationCity[]): DestinationCity[] {
    // Route 66 city order including Santa Fe branch flow
    const route66Order = [
      'Chicago', 'Joliet', 'Pontiac', 'Springfield', 'St. Louis', 'Cuba', 'Joplin',
      'Tulsa', 'Oklahoma City', 'Elk City', 'Shamrock', 'Amarillo', 'Tucumcari',
      'Santa Rosa', 'Santa Fe', 'Albuquerque', 'Gallup', 'Holbrook', 'Winslow',
      'Flagstaff', 'Williams', 'Seligman', 'Kingman', 'Needles', 'Barstow',
      'San Bernardino', 'Los Angeles', 'Santa Monica'
    ];

    const sortedCities: DestinationCity[] = [];
    const usedCities = new Set<string>();

    // Match cities to the ordered list
    for (const expectedName of route66Order) {
      const matchingCity = cities.find(city => {
        const cityKey = `${city.name}-${city.state}`;
        if (usedCities.has(cityKey)) return false;
        
        const cityName = city.name.toLowerCase();
        const expectedLower = expectedName.toLowerCase();
        
        return cityName.includes(expectedLower) || expectedLower.includes(cityName);
      });

      if (matchingCity) {
        sortedCities.push(matchingCity);
        usedCities.add(`${matchingCity.name}-${matchingCity.state}`);
        console.log(`✅ Ordered: ${matchingCity.name} (${matchingCity.state})`);
      }
    }

    // Validate Santa Fe branch flow
    const santaRosaIndex = sortedCities.findIndex(city => 
      city.name.toLowerCase().includes('santa rosa')
    );
    const santaFeIndex = sortedCities.findIndex(city => 
      city.name.toLowerCase().includes('santa fe')
    );
    const albuquerqueIndex = sortedCities.findIndex(city => 
      city.name.toLowerCase().includes('albuquerque')
    );
    
    if (santaRosaIndex !== -1 && santaFeIndex !== -1 && albuquerqueIndex !== -1) {
      const isProperFlow = santaFeIndex === santaRosaIndex + 1 && albuquerqueIndex === santaFeIndex + 1;
      console.log(`🔧 Santa Fe branch flow: ${isProperFlow ? 'CORRECT' : 'INCORRECT'} (${santaRosaIndex} → ${santaFeIndex} → ${albuquerqueIndex})`);
    }

    return sortedCities;
  }

  private async performNuclearCleanupWithCacheClearing(): Promise<void> {
    // Clean up existing route creation service
    this.routeCreationService.cleanup();
    
    // Perform nuclear cleanup
    await NuclearCleanupService.performNuclearCleanupWithCacheClearing(this.map);
  }

  async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up destination cities route renderer');
    this.routeCreationService.cleanup();
  }
}
