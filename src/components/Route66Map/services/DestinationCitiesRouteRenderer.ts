
import { PolylineStylesConfig } from './PolylineStylesConfig';
import { PathInterpolationService } from './PathInterpolationService';
import { RouteGlobalState } from './RouteGlobalState';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class DestinationCitiesRouteRenderer {
  private map: google.maps.Map;
  private mainPolyline: google.maps.Polyline | null = null;
  private centerLine: google.maps.Polyline | null = null;

  // Define the exact Route 66 order from Chicago to Santa Monica
  private readonly ROUTE_66_ORDER = [
    'Chicago',
    'Joliet', 
    'Pontiac',
    'Springfield',
    'St. Louis',
    'Cuba',
    'Springfield', // Note: There are two Springfields in the route
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
      console.log('🛣️ Creating Route 66 from destination cities in correct order');
      
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

      if (orderedCities.length < 2) {
        console.warn('⚠️ Not enough cities found in the correct order to create route');
        return;
      }

      // Create coordinate path - simple point-to-point connection
      const routePath = orderedCities.map(city => ({
        lat: Number(city.latitude),
        lng: Number(city.longitude)
      }));

      // Create smooth interpolated path between the ordered cities
      const interpolatedPath = PathInterpolationService.createSmoothPath(routePath, 30);
      
      console.log(`🛣️ Creating Route 66 with ${interpolatedPath.length} interpolated points connecting ${orderedCities.length} cities`);

      // Create main asphalt road
      this.mainPolyline = new google.maps.Polyline({
        ...PolylineStylesConfig.getIdealizedRouteOptions(),
        path: interpolatedPath,
        map: this.map
      });

      // Create center line (dashed yellow)
      this.centerLine = new google.maps.Polyline({
        ...PolylineStylesConfig.getIdealizedCenterLineOptions(),
        path: interpolatedPath,
        map: this.map
      });

      // Register with global state
      RouteGlobalState.addPolylineSegment(this.mainPolyline);
      RouteGlobalState.addPolylineSegment(this.centerLine);
      RouteGlobalState.setRouteCreated(true);

      console.log('✅ Route 66 created successfully in correct order from Chicago to Santa Monica');

      // Fit map to route bounds
      this.fitMapToBounds(routePath);

    } catch (error) {
      console.error('❌ Error creating Route 66 from destination cities:', error);
      throw error;
    }
  }

  private sortCitiesByRoute66Order(cities: DestinationCity[]): DestinationCity[] {
    const orderedCities: DestinationCity[] = [];
    
    // Go through each city in the Route 66 order and find matching cities
    for (const expectedCityName of this.ROUTE_66_ORDER) {
      // Find matching city (case insensitive, partial match)
      const matchingCity = cities.find(city => {
        const cityName = city.name.toLowerCase();
        const expectedName = expectedCityName.toLowerCase();
        
        // Check for exact match or if the city name contains the expected name
        return cityName.includes(expectedName) || expectedName.includes(cityName);
      });
      
      if (matchingCity) {
        orderedCities.push(matchingCity);
        console.log(`✅ Found ${matchingCity.name} (${matchingCity.state}) for ${expectedCityName}`);
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
