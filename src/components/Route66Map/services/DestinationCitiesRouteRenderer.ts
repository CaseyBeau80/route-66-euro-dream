import { EnhancedPolylineStylesConfig } from './EnhancedPolylineStylesConfig';
import { EnhancedPathInterpolationService } from './EnhancedPathInterpolationService';
import { RouteGlobalState } from './RouteGlobalState';
import { GlobalPolylineCleaner } from './GlobalPolylineCleaner';
import { RouteOrderService } from './RouteOrderService';
import { SantaFeBranchService } from './SantaFeBranchService';
import { RouteCleanupService } from './RouteCleanupService';
import { RouteBoundsService } from './RouteBoundsService';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class DestinationCitiesRouteRenderer {
  private map: google.maps.Map;
  private mainPolyline: google.maps.Polyline | null = null;
  private centerLine: google.maps.Polyline | null = null;
  private santaFeBranchService: SantaFeBranchService;

  constructor(map: google.maps.Map) {
    this.map = map;
    this.santaFeBranchService = new SantaFeBranchService(map);
  }

  async createRoute66FromDestinations(cities: DestinationCity[]): Promise<void> {
    try {
      console.log('🛣️ Creating HISTORICALLY ACCURATE Route 66: Santa Rosa → Santa Fe branch, NO Albuquerque main route');
      
      // Step 1: Aggressive cleanup of any existing routes
      await this.performAggressiveCleanup();
      
      if (cities.length < 2) {
        console.warn('⚠️ Need at least 2 cities to create a route');
        return;
      }

      // Step 2: Sort cities according to the UPDATED Route 66 order (no Albuquerque in main route)
      const { mainRouteCities, santaFeCity } = RouteOrderService.categorizeAndSortCities(cities);
      
      console.log(`🗺️ HISTORICALLY ACCURATE Route 66 main route (${mainRouteCities.length} cities):`, 
        mainRouteCities.map((city, index) => `${index + 1}. ${city.name}, ${city.state}`)
      );

      if (santaFeCity) {
        console.log(`🎯 Santa Fe branch identified: ${santaFeCity.name}, ${santaFeCity.state} → connects to SANTA ROSA`);
      }

      // Step 3: Verify we have Chicago and Santa Monica for main route
      const hasChicago = mainRouteCities.some(city => city.name.toLowerCase().includes('chicago'));
      const hasSantaMonica = mainRouteCities.some(city => city.name.toLowerCase().includes('santa monica'));
      
      // Verify Albuquerque is NOT in main route
      const hasAlbuquerqueInMain = mainRouteCities.some(city => city.name.toLowerCase().includes('albuquerque'));
      if (hasAlbuquerqueInMain) {
        console.error('❌ CRITICAL: Albuquerque found in main route - should be excluded');
      } else {
        console.log('✅ CONFIRMED: Albuquerque correctly excluded from main route');
      }
      
      if (!hasChicago || !hasSantaMonica) {
        console.error('❌ Missing critical endpoints:', { hasChicago, hasSantaMonica });
        return;
      }

      if (mainRouteCities.length < 2) {
        console.warn('⚠️ Not enough cities found in the correct order to create main route');
        return;
      }

      // Step 4: Create main route path (Santa Rosa → Gallup, skipping Albuquerque)
      const mainRoutePath = mainRouteCities.map(city => ({
        lat: Number(city.latitude),
        lng: Number(city.longitude)
      }));

      // Step 5: Create FLOWING CURVED main path with CONSISTENT formatting
      const flowingMainPath = EnhancedPathInterpolationService.createFlowingCurvedPath(mainRoutePath, 25);
      
      console.log(`🛣️ Creating UPDATED main Route 66 with ${flowingMainPath.length} smooth points connecting ${mainRouteCities.length} cities`);

      // Step 6: Create main route polylines with ENHANCED consistent styling
      this.mainPolyline = new google.maps.Polyline({
        ...EnhancedPolylineStylesConfig.getFlowingRouteOptions(),
        path: flowingMainPath,
        map: this.map
      });

      this.centerLine = new google.maps.Polyline({
        ...EnhancedPolylineStylesConfig.getEnhancedCenterLineOptions(),
        path: flowingMainPath,
        map: this.map
      });

      // Step 7: Create Santa Fe branch connected to SANTA ROSA (not Albuquerque)
      if (santaFeCity) {
        console.log('🌟 Creating Santa Fe branch with SANTA ROSA connection (historical accuracy)');
        await this.santaFeBranchService.createSantaFeBranch(santaFeCity, mainRouteCities);
      }

      // Step 8: Verify polylines were created and are visible
      if (!this.mainPolyline || !this.centerLine) {
        throw new Error('Failed to create main route polylines');
      }

      console.log('🔍 Route polylines verification - UPDATED ROUTE:', {
        mainPolylineVisible: this.mainPolyline.getVisible(),
        centerLineVisible: this.centerLine.getVisible(),
        santaFeBranchVisible: this.santaFeBranchService.getBranchPolylines().branchPolyline?.getVisible() || 'N/A',
        mainPolylineMap: !!this.mainPolyline.getMap(),
        centerLineMap: !!this.centerLine.getMap(),
        pathLength: flowingMainPath.length,
        albuquerqueExcluded: !mainRouteCities.some(city => city.name.toLowerCase().includes('albuquerque'))
      });

      // Step 9: Register with global state and global cleaner
      RouteGlobalState.addPolylineSegment(this.mainPolyline);
      RouteGlobalState.addPolylineSegment(this.centerLine);
      GlobalPolylineCleaner.registerPolyline(this.mainPolyline);
      GlobalPolylineCleaner.registerPolyline(this.centerLine);

      RouteGlobalState.setRouteCreated(true);

      console.log('✅ HISTORICALLY ACCURATE Route 66 created: Santa Rosa → Santa Fe branch, consistent road formatting');
      console.log(`📊 Global state updated: ${RouteGlobalState.getPolylineCount()} polylines registered`);

      // Step 10: Fit map to route bounds including Santa Fe branch (not Albuquerque)
      const allCities = santaFeCity ? [...mainRouteCities, santaFeCity] : mainRouteCities;
      RouteBoundsService.fitMapToBounds(this.map, allCities.map(city => ({
        lat: Number(city.latitude),
        lng: Number(city.longitude)
      })));

    } catch (error) {
      console.error('❌ Error creating historically accurate Route 66:', error);
      await this.cleanup();
      throw error;
    }
  }

  private async performAggressiveCleanup(): Promise<void> {
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

      // Clean up Santa Fe branch
      this.santaFeBranchService.cleanup();

      // Perform global cleanup
      await RouteCleanupService.performAggressiveCleanup(this.map);
      
    } catch (error) {
      console.error('❌ Error during aggressive cleanup:', error);
    }
  }

  async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up complete Route 66 with Santa Fe branch');
    
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

    // Clean up Santa Fe branch
    this.santaFeBranchService.cleanup();
  }
}
