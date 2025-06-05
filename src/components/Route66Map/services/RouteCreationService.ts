
import { EnhancedPolylineStylesConfig } from './EnhancedPolylineStylesConfig';
import { EnhancedPathInterpolationService } from './EnhancedPathInterpolationService';
import { RouteGlobalState } from './RouteGlobalState';
import { GlobalPolylineCleaner } from './GlobalPolylineCleaner';
import { RouteOrderService } from './RouteOrderService';
import { RouteValidationService } from './RouteValidationService';
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
    console.log('🛣️ Creating flowing Route 66 with Santa Fe branch integrated into main route');
    
    if (cities.length < 2) {
      console.warn('⚠️ Need at least 2 cities to create a route');
      return;
    }

    // Sort cities - now Santa Fe and Albuquerque are part of main route
    const { mainRouteCities, santaFeCity, albuquerqueCity } = RouteOrderService.categorizeAndSortCities(cities);
    
    console.log('🔧 DEBUG: Route categorization results for flowing branch:', {
      mainRouteCitiesCount: mainRouteCities.length,
      hasSantaFeInMain: mainRouteCities.some(c => c.name.toLowerCase().includes('santa fe')),
      hasAlbuquerqueInMain: mainRouteCities.some(c => c.name.toLowerCase().includes('albuquerque')),
      santaFeCityName: santaFeCity?.name,
      albuquerqueCityName: albuquerqueCity?.name
    });

    // Validate the flowing route
    const isValid = RouteValidationService.validateRoute(mainRouteCities, santaFeCity);
    if (!isValid) {
      console.error('❌ Route validation failed');
      return;
    }

    // Create single flowing main route path (includes Santa Fe branch)
    const mainRoutePath = mainRouteCities.map(city => ({
      lat: Number(city.latitude),
      lng: Number(city.longitude)
    }));

    // Create flowing curved path for the entire route including Santa Fe branch
    const flowingMainPath = EnhancedPathInterpolationService.createFlowingCurvedPath(mainRoutePath, 25);
    
    console.log(`🛣️ Creating flowing Route 66 with integrated Santa Fe branch: ${flowingMainPath.length} smooth points`);

    // Create main route polylines (includes the flowing Santa Fe branch)
    await this.createMainPolylines(flowingMainPath);

    // Register with global state
    this.registerPolylinesWithGlobalState();

    // Fit map to bounds (all cities are now in main route)
    RouteBoundsService.fitMapToBounds(this.map, mainRoutePath);

    RouteGlobalState.setRouteCreated(true);
    console.log('✅ Flowing Route 66 created successfully with integrated Santa Fe branch');
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
