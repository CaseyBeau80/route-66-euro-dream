
import { EnhancedPolylineStylesConfig } from './EnhancedPolylineStylesConfig';
import { EnhancedPathInterpolationService } from './EnhancedPathInterpolationService';
import { RouteGlobalState } from './RouteGlobalState';
import { GlobalPolylineCleaner } from './GlobalPolylineCleaner';
import { RouteBoundsService } from './RouteBoundsService';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class RouteCreationService {
  private map: google.maps.Map;
  private mainPolyline: google.maps.Polyline | null = null;
  private centerLine: google.maps.Polyline | null = null;

  constructor(map: google.maps.Map) {
    this.map = map;
  }

  async createMainRoute(cities: DestinationCity[]): Promise<void> {
    console.log('🛣️ Creating flowing Route 66 from destination cities (single data source)');
    
    if (cities.length < 2) {
      console.warn('⚠️ Need at least 2 cities to create a route');
      return;
    }

    console.log('🔧 DEBUG: Creating route from destination cities:', {
      citiesCount: cities.length,
      firstCity: cities[0]?.name,
      lastCity: cities[cities.length - 1]?.name
    });

    // Create main route path from destination cities
    const mainRoutePath = cities.map(city => ({
      lat: Number(city.latitude),
      lng: Number(city.longitude)
    }));

    // Validate coordinates
    const invalidCoords = mainRoutePath.filter(point => 
      isNaN(point.lat) || isNaN(point.lng) || point.lat === 0 || point.lng === 0
    );
    
    if (invalidCoords.length > 0) {
      console.error('❌ Invalid coordinates found:', invalidCoords);
      return;
    }

    // Create flowing curved path for the entire route
    const flowingMainPath = EnhancedPathInterpolationService.createFlowingCurvedPath(mainRoutePath, 25);
    
    console.log(`🛣️ Creating flowing Route 66 with ${flowingMainPath.length} smooth points`);

    // Create main route polylines
    await this.createMainPolylines(flowingMainPath);

    // Register with global state
    this.registerPolylinesWithGlobalState();

    // Fit map to bounds
    RouteBoundsService.fitMapToBounds(this.map, mainRoutePath);

    RouteGlobalState.setRouteCreated(true);
    console.log('✅ Flowing Route 66 created successfully from destination cities');
  }

  private async createMainPolylines(flowingMainPath: google.maps.LatLngLiteral[]): Promise<void> {
    const polylineOptions = {
      ...EnhancedPolylineStylesConfig.getFlowingRouteOptions(),
      path: flowingMainPath,
      map: this.map,
      zIndex: 50 + Date.now() % 100
    };

    this.mainPolyline = new google.maps.Polyline(polylineOptions);

    const centerLineOptions = {
      ...EnhancedPolylineStylesConfig.getEnhancedCenterLineOptions(),
      path: flowingMainPath,
      map: this.map,
      zIndex: 100 + Date.now() % 100
    };

    this.centerLine = new google.maps.Polyline(centerLineOptions);

    // Force visibility check
    setTimeout(() => {
      this.forceVisibility();
    }, 500);
  }

  private registerPolylinesWithGlobalState(): void {
    if (this.mainPolyline && this.centerLine) {
      RouteGlobalState.addPolylineSegment(this.mainPolyline);
      RouteGlobalState.addPolylineSegment(this.centerLine);
      GlobalPolylineCleaner.registerPolyline(this.mainPolyline);
      GlobalPolylineCleaner.registerPolyline(this.centerLine);
    }
  }

  private forceVisibility(): void {
    if (this.mainPolyline && !this.mainPolyline.getVisible()) {
      console.log('🔧 FIXING: Main polyline not visible, forcing visibility');
      this.mainPolyline.setVisible(true);
    }
    
    if (this.centerLine && !this.centerLine.getVisible()) {
      console.log('🔧 FIXING: Center line not visible, forcing visibility');
      this.centerLine.setVisible(true);
    }
  }

  cleanup(): void {
    console.log('🧹 Cleaning up route creation service');
    
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
