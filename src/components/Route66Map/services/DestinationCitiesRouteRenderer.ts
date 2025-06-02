
import { EnhancedPolylineStylesConfig } from './EnhancedPolylineStylesConfig';
import { EnhancedPathInterpolationService } from './EnhancedPathInterpolationService';
import { RouteGlobalState } from './RouteGlobalState';
import { GlobalPolylineCleaner } from './GlobalPolylineCleaner';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class DestinationCitiesRouteRenderer {
  private map: google.maps.Map;
  private mainPolyline: google.maps.Polyline | null = null;
  private centerLine: google.maps.Polyline | null = null;

  // FIXED: Updated Route 66 order with proper Springfield distinction
  private readonly ROUTE_66_ORDER = [
    'Chicago',         // Starting point - Illinois
    'Joliet',          // Illinois
    'Pontiac',         // CRITICAL: Pontiac, IL must be included
    'Springfield_IL',  // Springfield, Illinois (first Springfield)
    'St. Louis',       // Missouri border
    'Cuba',            // Missouri
    'Springfield_MO',  // Springfield, Missouri (second Springfield)
    'Joplin',          // Missouri/Kansas border
    'Tulsa',           // Oklahoma
    'Oklahoma City',
    'Elk City',        // Oklahoma/Texas border
    'Shamrock',        // Texas
    'Amarillo',
    'Tucumcari',       // New Mexico
    'Santa Rosa',
    'Albuquerque',
    'Gallup',          // New Mexico/Arizona border
    'Holbrook',        // Arizona
    'Winslow',
    'Flagstaff',
    'Williams',
    'Seligman',
    'Kingman',         // Arizona/California border
    'Needles',         // California
    'Barstow',
    'San Bernardino',
    'Santa Monica'     // End point
  ];

  constructor(map: google.maps.Map) {
    this.map = map;
  }

  async createRoute66FromDestinations(cities: DestinationCity[]): Promise<void> {
    try {
      console.log('🛣️ Creating FLOWING CURVED Route 66 from destination cities with enhanced dashed stripes');
      
      // Step 1: Aggressive cleanup of any existing routes
      await this.performAggressiveCleanup();
      
      if (cities.length < 2) {
        console.warn('⚠️ Need at least 2 cities to create a route');
        return;
      }

      // Step 2: Sort cities according to the corrected Route 66 order
      const orderedCities = this.sortCitiesByRoute66Order(cities);
      
      console.log(`🗺️ FLOWING Route 66 order (${orderedCities.length} cities found):`, 
        orderedCities.map((city, index) => `${index + 1}. ${city.name}, ${city.state}`)
      );

      // Step 3: Enhanced verification for both Springfields
      const springfieldIL = orderedCities.find(city => 
        city.name.toLowerCase().includes('springfield') && city.state === 'IL'
      );
      const springfieldMO = orderedCities.find(city => 
        city.name.toLowerCase().includes('springfield') && city.state === 'MO'
      );
      
      console.log(`🔍 Springfield verification:`, {
        'Springfield, IL': springfieldIL ? '✅ FOUND' : '❌ MISSING',
        'Springfield, MO': springfieldMO ? '✅ FOUND' : '❌ MISSING'
      });

      // Step 4: Verify we have Chicago and Santa Monica
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

      // Step 5: Create flowing curved coordinate path
      const routePath = orderedCities.map(city => ({
        lat: Number(city.latitude),
        lng: Number(city.longitude)
      }));

      // Step 6: Create FLOWING CURVED path using enhanced interpolation
      const flowingPath = EnhancedPathInterpolationService.createFlowingCurvedPath(routePath, 25);
      
      console.log(`🛣️ Creating FLOWING CURVED Route 66 with ${flowingPath.length} smooth points connecting ${orderedCities.length} cities`);

      // Step 7: Create main asphalt road with flowing curve styling
      this.mainPolyline = new google.maps.Polyline({
        ...EnhancedPolylineStylesConfig.getFlowingRouteOptions(),
        path: flowingPath,
        map: this.map
      });

      // Step 8: Create enhanced dashed yellow center line
      this.centerLine = new google.maps.Polyline({
        ...EnhancedPolylineStylesConfig.getEnhancedCenterLineOptions(),
        path: flowingPath,
        map: this.map
      });

      // Step 9: Verify polylines were created and are visible
      if (!this.mainPolyline || !this.centerLine) {
        throw new Error('Failed to create flowing polylines');
      }

      console.log('🔍 Flowing polyline verification:', {
        mainPolylineVisible: this.mainPolyline.getVisible(),
        centerLineVisible: this.centerLine.getVisible(),
        mainPolylineMap: !!this.mainPolyline.getMap(),
        centerLineMap: !!this.centerLine.getMap(),
        pathLength: flowingPath.length,
        hasEnhancedDashedStripe: !!(this.centerLine.get('icons'))
      });

      // Step 10: Register with global state and global cleaner
      RouteGlobalState.addPolylineSegment(this.mainPolyline);
      RouteGlobalState.addPolylineSegment(this.centerLine);
      GlobalPolylineCleaner.registerPolyline(this.mainPolyline);
      GlobalPolylineCleaner.registerPolyline(this.centerLine);
      RouteGlobalState.setRouteCreated(true);

      console.log('✅ FLOWING CURVED Route 66 created successfully with ENHANCED dashed yellow stripes from Chicago to Santa Monica');
      console.log(`📊 Global state updated: ${RouteGlobalState.getPolylineCount()} polylines registered`);

      // Step 11: Fit map to route bounds
      this.fitMapToBounds(routePath);

    } catch (error) {
      console.error('❌ Error creating FLOWING CURVED Route 66 from destination cities:', error);
      await this.cleanup();
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
      let matchingCity: DestinationCity | undefined;
      
      // Handle Springfield special cases
      if (expectedCityName === 'Springfield_IL') {
        matchingCity = cities.find(city => {
          const cityKey = `${city.name}-${city.state}`;
          return !usedCities.has(cityKey) && 
                 city.name.toLowerCase().includes('springfield') && 
                 city.state === 'IL';
        });
      } else if (expectedCityName === 'Springfield_MO') {
        matchingCity = cities.find(city => {
          const cityKey = `${city.name}-${city.state}`;
          return !usedCities.has(cityKey) && 
                 city.name.toLowerCase().includes('springfield') && 
                 city.state === 'MO';
        });
      } else {
        // Find matching city (case insensitive, partial match)
        matchingCity = cities.find(city => {
          const cityKey = `${city.name}-${city.state}`;
          if (usedCities.has(cityKey)) return false;
          
          const cityName = city.name.toLowerCase();
          const expectedName = expectedCityName.toLowerCase();
          
          return cityName.includes(expectedName) || expectedName.includes(cityName);
        });
      }
      
      if (matchingCity) {
        orderedCities.push(matchingCity);
        usedCities.add(`${matchingCity.name}-${matchingCity.state}`);
        console.log(`✅ Found ${matchingCity.name} (${matchingCity.state}) for ${expectedCityName}`);
        
        // Special logging for Springfields
        if (expectedCityName === 'Springfield_IL') {
          console.log(`🎯 SPRINGFIELD IL FOUND AND ADDED: ${matchingCity.name}, ${matchingCity.state}`);
        } else if (expectedCityName === 'Springfield_MO') {
          console.log(`🎯 SPRINGFIELD MO FOUND AND ADDED: ${matchingCity.name}, ${matchingCity.state}`);
        }
      } else {
        console.log(`❌ Could not find city for: ${expectedCityName}`);
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

    console.log('🗺️ Map bounds fitted to FLOWING CURVED route');
  }

  async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up flowing destination cities route');
    
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
