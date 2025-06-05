import { EnhancedPolylineStylesConfig } from './EnhancedPolylineStylesConfig';
import { EnhancedPathInterpolationService } from './EnhancedPathInterpolationService';
import { RouteGlobalState } from './RouteGlobalState';
import { GlobalPolylineCleaner } from './GlobalPolylineCleaner';
import { RouteOrderService } from './RouteOrderService';
import { SantaFeBranchService } from './SantaFeBranchService';
import { RouteValidationService } from './RouteValidationService';
import { RouteBoundsService } from './RouteBoundsService';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class RouteCreationService {
  private map: google.maps.Map;
  private mainPolyline: google.maps.Polyline | null = null;
  private centerLine: google.maps.Polyline | null = null;
  private santaFeBranchService: SantaFeBranchService;

  constructor(map: google.maps.Map) {
    this.map = map;
    this.santaFeBranchService = new SantaFeBranchService(map);
  }

  async createMainRoute(cities: DestinationCity[]): Promise<void> {
    console.log('🛣️ Creating main Route 66 with Santa Fe branch: Santa Rosa → Santa Fe → Albuquerque');
    
    if (cities.length < 2) {
      console.warn('⚠️ Need at least 2 cities to create a route');
      return;
    }

    // Sort cities and get both Santa Fe and Albuquerque for the branch
    const { mainRouteCities, santaFeCity, albuquerqueCity } = RouteOrderService.categorizeAndSortCities(cities);
    
    console.log('🔧 DEBUG: Route categorization results:', {
      mainRouteCitiesCount: mainRouteCities.length,
      hasSantaFe: !!santaFeCity,
      hasAlbuquerque: !!albuquerqueCity,
      santaFeCityName: santaFeCity?.name,
      albuquerqueCityName: albuquerqueCity?.name
    });

    // Validate the route
    const isValid = RouteValidationService.validateRoute(mainRouteCities, santaFeCity);
    if (!isValid) {
      console.error('❌ Route validation failed');
      return;
    }

    // Create main route path
    const mainRoutePath = mainRouteCities.map(city => ({
      lat: Number(city.latitude),
      lng: Number(city.longitude)
    }));

    // Create flowing curved main path
    const flowingMainPath = EnhancedPathInterpolationService.createFlowingCurvedPath(mainRoutePath, 25);
    
    console.log(`🛣️ Creating main Route 66 with ${flowingMainPath.length} smooth points`);

    // Create main route polylines
    await this.createMainPolylines(flowingMainPath);

    // Create Santa Fe branch if needed
    if (santaFeCity) {
      console.log('🌟 Creating Santa Fe branch: Santa Rosa → Santa Fe → Albuquerque');
      await this.santaFeBranchService.createSantaFeBranch(santaFeCity, albuquerqueCity, mainRouteCities);
    }

    // Register with global state
    this.registerPolylinesWithGlobalState();

    // Fit map to bounds (include all relevant cities)
    const allCities = [
      ...mainRouteCities,
      ...(santaFeCity ? [santaFeCity] : []),
      ...(albuquerqueCity ? [albuquerqueCity] : [])
    ];
    
    RouteBoundsService.fitMapToBounds(this.map, allCities.map(city => ({
      lat: Number(city.latitude),
      lng: Number(city.longitude)
    })));

    RouteGlobalState.setRouteCreated(true);
    console.log('✅ Route 66 created successfully with Santa Fe branch');
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

  getSantaFeBranchService(): SantaFeBranchService {
    return this.santaFeBranchService;
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

    this.santaFeBranchService.cleanup();
  }
}
