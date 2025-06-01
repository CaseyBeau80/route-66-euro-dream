
import { PolylineStylesConfig } from './PolylineStylesConfig';
import { PathInterpolationService } from './PathInterpolationService';
import { RouteGlobalState } from './RouteGlobalState';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class DestinationCitiesRouteRenderer {
  private map: google.maps.Map;
  private mainPolyline: google.maps.Polyline | null = null;
  private centerLine: google.maps.Polyline | null = null;

  constructor(map: google.maps.Map) {
    this.map = map;
  }

  async createRoute66FromDestinations(cities: DestinationCity[]): Promise<void> {
    try {
      console.log('🛣️ Creating Route 66 from destination cities');
      
      // Clean up any existing routes
      this.cleanup();
      
      if (cities.length < 2) {
        console.warn('⚠️ Need at least 2 cities to create a route');
        return;
      }

      // Sort cities geographically (west to east, roughly following Route 66 path)
      const sortedCities = this.sortCitiesGeographically(cities);
      
      console.log(`🗺️ Route order:`, sortedCities.map((city, index) => 
        `${index + 1}. ${city.name}, ${city.state}`
      ));

      // Create coordinate path
      const routePath = sortedCities.map(city => ({
        lat: Number(city.latitude),
        lng: Number(city.longitude)
      }));

      // Interpolate smooth path with many points for curvy roads
      const interpolatedPath = PathInterpolationService.createSmoothPath(routePath, 100);
      
      console.log(`🛣️ Creating Route 66 with ${interpolatedPath.length} interpolated points`);

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

      console.log('✅ Destination cities Route 66 created successfully');

      // Fit map to route bounds
      this.fitMapToBounds(routePath);

    } catch (error) {
      console.error('❌ Error creating Route 66 from destination cities:', error);
      throw error;
    }
  }

  private sortCitiesGeographically(cities: DestinationCity[]): DestinationCity[] {
    // Sort roughly west to east following Route 66's general path
    // Starting from Chicago (IL) and ending at Santa Monica (CA)
    const stateOrder = ['IL', 'MO', 'KS', 'OK', 'TX', 'NM', 'AZ', 'CA'];
    
    return cities.sort((a, b) => {
      const stateIndexA = stateOrder.indexOf(a.state);
      const stateIndexB = stateOrder.indexOf(b.state);
      
      // If same state, sort by longitude (west to east)
      if (stateIndexA === stateIndexB) {
        return Number(a.longitude) - Number(b.longitude);
      }
      
      // Sort by state order
      return stateIndexA - stateIndexB;
    });
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
