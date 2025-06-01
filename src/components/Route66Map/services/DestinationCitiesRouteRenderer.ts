
import { PolylineStylesConfig } from './PolylineStylesConfig';
import { PathInterpolationService } from './PathInterpolationService';
import { RouteGlobalState } from './RouteGlobalState';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class DestinationCitiesRouteRenderer {
  private map: google.maps.Map;
  private mainPolyline: google.maps.Polyline | null = null;
  private centerLine: google.maps.Polyline | null = null;

  // FIXED: Updated Route 66 order to include Pontiac and fix missing cities
  private readonly ROUTE_66_ORDER = [
    'Chicago',
    'Joliet', 
    'Pontiac',     // ADDED: Missing Pontiac, IL
    'Springfield', // Springfield, IL
    'St. Louis',
    'Cuba',
    'Springfield', // Springfield, MO (Note: There are two Springfields in the route)
    'Joplin',
    'Tulsa',
    'Oklahoma City',
    'Elk City',
    'Shamrock',
    'Amarillo',
    'Tucumcari',
    'Santa Rosa',
    'Albuquerque',
    'Gallup',
    'Holbrook',
    'Winslow',
    'Flagstaff',
    'Williams',
    'Seligman',
    'Kingman',
    'Needles',
    'Barstow',
    'San Bernardino',
    'Santa Monica'
  ];

  constructor(map: google.maps.Map) {
    this.map = map;
  }

  async createRoute66FromDestinations(cities: DestinationCity[]): Promise<void> {
    try {
      console.log('🛣️ Creating STRAIGHT Route 66 from destination cities (NO MORE ZIGZAG!)');
      
      // Clean up any existing routes
      this.cleanup();
      
      if (cities.length < 2) {
        console.warn('⚠️ Need at least 2 cities to create a route');
        return;
      }

      // Sort cities according to the exact Route 66 order
      const orderedCities = this.sortCitiesByRoute66Order(cities);
      
      console.log(`🗺️ Route 66 order (${orderedCities.length} cities found):`, 
        orderedCities.map((city, index) => `${index + 1}. ${city.name}, ${city.state}`)
      );

      // ENHANCED: Check specifically for Pontiac
      const hasPontiac = orderedCities.some(city => city.name.toLowerCase().includes('pontiac'));
      console.log(`🔍 Pontiac verification: ${hasPontiac ? '✅ FOUND' : '❌ MISSING'}`);

      if (orderedCities.length < 2) {
        console.warn('⚠️ Not enough cities found in the correct order to create route');
        return;
      }

      // Create coordinate path - simple point-to-point connection
      const routePath = orderedCities.map(city => ({
        lat: Number(city.latitude),
        lng: Number(city.longitude)
      }));

      // FIXED: Create STRAIGHT linear path between the ordered cities (NO CURVES!)
      const straightPath = PathInterpolationService.createSmoothPath(routePath, 10); // Fewer points for straighter lines
      
      console.log(`🛣️ Creating STRAIGHT Route 66 with ${straightPath.length} linear points connecting ${orderedCities.length} cities`);

      // Create main asphalt road with enhanced visibility
      this.mainPolyline = new google.maps.Polyline({
        ...PolylineStylesConfig.getIdealizedRouteOptions(),
        path: straightPath,
        map: this.map
      });

      // FIXED: Create dashed yellow center line
      this.centerLine = new google.maps.Polyline({
        ...PolylineStylesConfig.getIdealizedCenterLineOptions(),
        path: straightPath,
        map: this.map
      });

      // Verify polylines were created and are visible
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

      // Register with global state
      RouteGlobalState.addPolylineSegment(this.mainPolyline);
      RouteGlobalState.addPolylineSegment(this.centerLine);
      RouteGlobalState.setRouteCreated(true);

      console.log('✅ STRAIGHT Route 66 created successfully with DASHED yellow stripe from Chicago to Santa Monica');
      console.log(`📊 Global state updated: ${RouteGlobalState.getPolylineCount()} polylines registered`);

      // Fit map to route bounds
      this.fitMapToBounds(routePath);

    } catch (error) {
      console.error('❌ Error creating Route 66 from destination cities:', error);
      this.cleanup(); // Clean up on error
      throw error;
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

    console.log('🗺️ Map bounds fitted to STRAIGHT route');
  }

  cleanup(): void {
    console.log('🧹 Cleaning up destination cities route');
    
    if (this.mainPolyline) {
      this.mainPolyline.setMap(null);
      this.mainPolyline = null;
    }
    
    if (this.centerLine) {
      this.centerLine.setMap(null);
      this.centerLine = null;
    }
  }
}
