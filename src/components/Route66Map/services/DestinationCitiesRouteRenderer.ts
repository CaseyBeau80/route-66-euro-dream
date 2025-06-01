
import { PolylineStylesConfig } from './PolylineStylesConfig';
import { PathInterpolationService } from './PathInterpolationService';
import { RouteGlobalState } from './RouteGlobalState';
import { GlobalPolylineCleaner } from './GlobalPolylineCleaner';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class DestinationCitiesRouteRenderer {
  private map: google.maps.Map;
  private mainPolyline: google.maps.Polyline | null = null;
  private centerLine: google.maps.Polyline | null = null;

  // ENHANCED: Updated Route 66 order with all major cities including Pontiac
  private readonly ROUTE_66_ORDER = [
    'Chicago',     // Starting point
    'Joliet', 
    'Pontiac',     // CRITICAL: Pontiac, IL must be included
    'Springfield', // Springfield, IL
    'St. Louis',   // Missouri border
    'Cuba',        // Missouri
    'Springfield', // Springfield, MO (Note: There are two Springfields)
    'Joplin',      // Missouri/Kansas border
    'Tulsa',       // Oklahoma
    'Oklahoma City',
    'Elk City',    // Oklahoma/Texas border
    'Shamrock',    // Texas
    'Amarillo',
    'Tucumcari',   // New Mexico
    'Santa Rosa',
    'Albuquerque',
    'Gallup',      // New Mexico/Arizona border
    'Holbrook',    // Arizona
    'Winslow',
    'Flagstaff',
    'Williams',
    'Seligman',
    'Kingman',     // Arizona/California border
    'Needles',     // California
    'Barstow',
    'San Bernardino',
    'Santa Monica' // End point
  ];

  constructor(map: google.maps.Map) {
    this.map = map;
  }

  async createRoute66FromDestinations(cities: DestinationCity[]): Promise<void> {
    try {
      console.log('🛣️ Creating NUCLEAR-CLEAN STRAIGHT Route 66 from destination cities (ZERO ZIGZAG)');
      
      // STEP 1: AGGRESSIVE cleanup of any existing routes
      await this.performAggressiveCleanup();
      
      if (cities.length < 2) {
        console.warn('⚠️ Need at least 2 cities to create a route');
        return;
      }

      // STEP 2: Sort cities according to the exact Route 66 order
      const orderedCities = this.sortCitiesByRoute66Order(cities);
      
      console.log(`🗺️ STRAIGHT Route 66 order (${orderedCities.length} cities found):`, 
        orderedCities.map((city, index) => `${index + 1}. ${city.name}, ${city.state}`)
      );

      // STEP 3: CRITICAL verification for Pontiac
      const hasPontiac = orderedCities.some(city => city.name.toLowerCase().includes('pontiac'));
      console.log(`🔍 Pontiac verification: ${hasPontiac ? '✅ FOUND' : '❌ MISSING'}`);
      
      // STEP 4: Verify we have Chicago and Santa Monica
      const hasChicago = orderedCities.some(city => city.name.toLowerCase().includes('chicago'));
      const hasSantaMonica = orderedCities.some(city => city.name.toLowerCase().includes('santa monica'));
      
      if (!hasChicago || !hasSantaMonica) {
        console.error('❌ Missing critical endpoints:', { hasChicago, hasSantaMonica });
        return;
      }

      if (orderedCities.length < 2) {
        console.warn('⚠️ Not enough cities found in the correct order to create route');
        return;
      }

      // STEP 5: Create STRAIGHT coordinate path - point-to-point connection
      const routePath = orderedCities.map(city => ({
        lat: Number(city.latitude),
        lng: Number(city.longitude)
      }));

      // STEP 6: Create ULTRA-STRAIGHT linear path (NO CURVES AT ALL!)
      const straightPath = PathInterpolationService.createSmoothPath(routePath, 5); // Minimal points for maximum straightness
      
      console.log(`🛣️ Creating ULTRA-STRAIGHT Route 66 with ${straightPath.length} linear points connecting ${orderedCities.length} cities`);

      // STEP 7: Create main asphalt road with enhanced visibility
      this.mainPolyline = new google.maps.Polyline({
        ...PolylineStylesConfig.getIdealizedRouteOptions(),
        path: straightPath,
        map: this.map
      });

      // STEP 8: Create dashed yellow center line
      this.centerLine = new google.maps.Polyline({
        ...PolylineStylesConfig.getIdealizedCenterLineOptions(),
        path: straightPath,
        map: this.map
      });

      // STEP 9: Verify polylines were created and are visible
      if (!this.mainPolyline || !this.centerLine) {
        throw new Error('Failed to create polylines');
      }

      console.log('🔍 Polyline verification:', {
        mainPolylineVisible: this.mainPolyline.getVisible(),
        centerLineVisible: this.centerLine.getVisible(),
        mainPolylineMap: !!this.mainPolyline.getMap(),
        centerLineMap: !!this.centerLine.getMap(),
        pathLength: straightPath.length,
        hasDashedStripe: !!(this.centerLine.get('icons'))
      });

      // STEP 10: Register with global state and global cleaner
      RouteGlobalState.addPolylineSegment(this.mainPolyline);
      RouteGlobalState.addPolylineSegment(this.centerLine);
      GlobalPolylineCleaner.registerPolyline(this.mainPolyline);
      GlobalPolylineCleaner.registerPolyline(this.centerLine);
      RouteGlobalState.setRouteCreated(true);

      console.log('✅ ULTRA-STRAIGHT Route 66 created successfully with DASHED yellow stripe from Chicago to Santa Monica');
      console.log(`📊 Global state updated: ${RouteGlobalState.getPolylineCount()} polylines registered`);

      // STEP 11: Fit map to route bounds
      this.fitMapToBounds(routePath);

    } catch (error) {
      console.error('❌ Error creating STRAIGHT Route 66 from destination cities:', error);
      await this.cleanup(); // Clean up on error
      throw error;
    }
  }

  private async performAggressiveCleanup(): Promise<void> {
    console.log('🧹 AGGRESSIVE cleanup of existing polylines starting');
    
    try {
      // Clean up any existing polylines from this instance
      if (this.mainPolyline) {
        this.mainPolyline.setMap(null);
        GlobalPolylineCleaner.unregisterPolyline(this.mainPolyline);
        this.mainPolyline = null;
      }
      
      if (this.centerLine) {
        this.centerLine.setMap(null);
        GlobalPolylineCleaner.unregisterPolyline(this.centerLine);
        this.centerLine = null;
      }

      // Nuclear cleanup of all polylines
      await GlobalPolylineCleaner.cleanupAllPolylines(this.map);
      
      // Clear global state
      RouteGlobalState.clearAll();
      
      // Additional delay to ensure cleanup completes
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('✅ AGGRESSIVE cleanup completed');
      
    } catch (error) {
      console.error('❌ Error during aggressive cleanup:', error);
    }
  }

  private sortCitiesByRoute66Order(cities: DestinationCity[]): DestinationCity[] {
    const orderedCities: DestinationCity[] = [];
    const usedCities = new Set<string>();
    
    console.log('🔍 Available cities for matching:', cities.map(c => `${c.name}, ${c.state}`));
    
    // Go through each city in the Route 66 order and find matching cities
    for (const expectedCityName of this.ROUTE_66_ORDER) {
      // Find matching city (case insensitive, partial match)
      const matchingCity = cities.find(city => {
        const cityKey = `${city.name}-${city.state}`;
        if (usedCities.has(cityKey)) return false; // Skip already used cities
        
        const cityName = city.name.toLowerCase();
        const expectedName = expectedCityName.toLowerCase();
        
        // Check for exact match or if the city name contains the expected name
        return cityName.includes(expectedName) || expectedName.includes(cityName);
      });
      
      if (matchingCity) {
        orderedCities.push(matchingCity);
        usedCities.add(`${matchingCity.name}-${matchingCity.state}`);
        console.log(`✅ Found ${matchingCity.name} (${matchingCity.state}) for ${expectedCityName}`);
        
        // Special logging for Pontiac
        if (expectedCityName.toLowerCase() === 'pontiac') {
          console.log(`🎯 PONTIAC FOUND AND ADDED: ${matchingCity.name}, ${matchingCity.state}`);
        }
      } else {
        console.log(`❌ Could not find city for: ${expectedCityName}`);
        
        // Special warning for Pontiac
        if (expectedCityName.toLowerCase() === 'pontiac') {
          console.warn(`🚨 PONTIAC NOT FOUND in destination cities database!`);
        }
      }
    }
    
    console.log(`🎯 Successfully ordered ${orderedCities.length} out of ${this.ROUTE_66_ORDER.length} expected cities`);
    
    return orderedCities;
  }

  private fitMapToBounds(routePath: google.maps.LatLngLiteral[]): void {
    if (routePath.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    routePath.forEach(point => {
      bounds.extend(new google.maps.LatLng(point.lat, point.lng));
    });

    // Add padding and fit bounds
    this.map.fitBounds(bounds, {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    });

    console.log('🗺️ Map bounds fitted to ULTRA-STRAIGHT route');
  }

  async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up destination cities route');
    
    if (this.mainPolyline) {
      this.mainPolyline.setMap(null);
      GlobalPolylineCleaner.unregisterPolyline(this.mainPolyline);
      this.mainPolyline = null;
    }
    
    if (this.centerLine) {
      this.centerLine.setMap(null);
      GlobalPolylineCleaner.unregisterPolyline(this.centerLine);
      this.centerLine = null;
    }
  }
}
