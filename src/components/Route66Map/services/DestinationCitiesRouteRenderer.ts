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
  private forceRecreateFlag: boolean = false;

  constructor(map: google.maps.Map) {
    this.map = map;
    this.santaFeBranchService = new SantaFeBranchService(map);
  }

  async createRoute66FromDestinations(cities: DestinationCity[]): Promise<void> {
    try {
      console.log('🛣️ FORCE RECREATING Route 66: Santa Rosa → Santa Fe branch, NO Albuquerque main route');
      console.log('🔧 DEBUG: Starting route creation with cache clearing and force re-render');
      
      // Step 1: NUCLEAR cleanup with cache clearing
      await this.performNuclearCleanupWithCacheClearing();
      
      // Step 2: Force recreation flag
      this.forceRecreateFlag = true;
      RouteGlobalState.setRouteCreated(false);
      
      if (cities.length < 2) {
        console.warn('⚠️ Need at least 2 cities to create a route');
        return;
      }

      // Step 3: Sort cities and validate historically accurate route
      const { mainRouteCities, santaFeCity } = RouteOrderService.categorizeAndSortCities(cities);
      
      console.log('🔧 DEBUG: Route categorization results:', {
        mainRouteCitiesCount: mainRouteCities.length,
        hasSantaFe: !!santaFeCity,
        santaFeCityName: santaFeCity?.name,
        albuquerqueInMain: mainRouteCities.some(city => city.name.toLowerCase().includes('albuquerque')),
        santaRosaInMain: mainRouteCities.some(city => city.name.toLowerCase().includes('santa rosa')),
        gallupInMain: mainRouteCities.some(city => city.name.toLowerCase().includes('gallup'))
      });
      
      console.log(`🗺️ FORCE RECREATED Route 66 main route (${mainRouteCities.length} cities):`, 
        mainRouteCities.map((city, index) => `${index + 1}. ${city.name}, ${city.state}`)
      );

      if (santaFeCity) {
        console.log(`🎯 Santa Fe branch confirmed: ${santaFeCity.name}, ${santaFeCity.state} → connects to SANTA ROSA`);
      }

      // Step 4: Critical validation checks
      const hasChicago = mainRouteCities.some(city => city.name.toLowerCase().includes('chicago'));
      const hasSantaMonica = mainRouteCities.some(city => city.name.toLowerCase().includes('santa monica'));
      const hasAlbuquerqueInMain = mainRouteCities.some(city => city.name.toLowerCase().includes('albuquerque'));
      const hasSantaRosa = mainRouteCities.some(city => city.name.toLowerCase().includes('santa rosa'));
      const hasGallup = mainRouteCities.some(city => city.name.toLowerCase().includes('gallup'));
      
      console.log('🔧 DEBUG: Route validation checks:', {
        hasChicago,
        hasSantaMonica,
        hasAlbuquerqueInMain,
        hasSantaRosa,
        hasGallup,
        routeLength: mainRouteCities.length
      });
      
      if (hasAlbuquerqueInMain) {
        console.error('❌ CRITICAL ERROR: Albuquerque found in main route - should be excluded');
        console.log('🔧 DEBUG: Main route cities that should NOT include Albuquerque:', 
          mainRouteCities.map(c => `${c.name}, ${c.state}`));
      } else {
        console.log('✅ CONFIRMED: Albuquerque correctly excluded from main route');
      }

      if (!hasSantaRosa || !hasGallup) {
        console.error('❌ CRITICAL: Missing Santa Rosa or Gallup for direct connection');
        console.log('🔧 DEBUG: Available cities for direct connection:', 
          mainRouteCities.filter(c => 
            c.name.toLowerCase().includes('santa rosa') || 
            c.name.toLowerCase().includes('gallup')
          ).map(c => `${c.name}, ${c.state}`)
        );
      }
      
      if (!hasChicago || !hasSantaMonica) {
        console.error('❌ Missing critical endpoints:', { hasChicago, hasSantaMonica });
        return;
      }

      if (mainRouteCities.length < 2) {
        console.warn('⚠️ Not enough cities found in the correct order to create main route');
        return;
      }

      // Step 5: Create main route path with FORCED recreation
      const mainRoutePath = mainRouteCities.map(city => ({
        lat: Number(city.latitude),
        lng: Number(city.longitude)
      }));

      console.log('🔧 DEBUG: Main route coordinates check:', {
        pathLength: mainRoutePath.length,
        firstCity: mainRoutePath[0],
        lastCity: mainRoutePath[mainRoutePath.length - 1],
        santaRosaCoords: mainRoutePath.find((_, index) => 
          mainRouteCities[index].name.toLowerCase().includes('santa rosa')
        ),
        gallupCoords: mainRoutePath.find((_, index) => 
          mainRouteCities[index].name.toLowerCase().includes('gallup')
        )
      });

      // Step 6: Create FLOWING CURVED main path with ENHANCED interpolation
      const flowingMainPath = EnhancedPathInterpolationService.createFlowingCurvedPath(mainRoutePath, 25);
      
      console.log(`🛣️ FORCE CREATING main Route 66 with ${flowingMainPath.length} smooth points connecting ${mainRouteCities.length} cities`);
      console.log('🔧 DEBUG: Flowing path sample points:', flowingMainPath.slice(0, 3));

      // Step 7: FORCE create main route polylines with cache-busting
      const polylineOptions = {
        ...EnhancedPolylineStylesConfig.getFlowingRouteOptions(),
        path: flowingMainPath,
        map: this.map,
        zIndex: 50 + Date.now() % 100 // Cache-busting zIndex
      };

      console.log('🔧 DEBUG: Creating main polyline with options:', {
        pathLength: polylineOptions.path.length,
        zIndex: polylineOptions.zIndex,
        strokeWeight: polylineOptions.strokeWeight,
        strokeColor: polylineOptions.strokeColor
      });

      this.mainPolyline = new google.maps.Polyline(polylineOptions);

      const centerLineOptions = {
        ...EnhancedPolylineStylesConfig.getEnhancedCenterLineOptions(),
        path: flowingMainPath,
        map: this.map,
        zIndex: 100 + Date.now() % 100 // Cache-busting zIndex
      };

      console.log('🔧 DEBUG: Creating center line with options:', {
        pathLength: centerLineOptions.path.length,
        zIndex: centerLineOptions.zIndex,
        strokePattern: centerLineOptions.strokePattern
      });

      this.centerLine = new google.maps.Polyline(centerLineOptions);

      // Step 8: FORCE create Santa Fe branch with Santa Rosa connection
      if (santaFeCity) {
        console.log('🌟 FORCE CREATING Santa Fe branch with SANTA ROSA connection');
        console.log('🔧 DEBUG: Santa Fe coordinates:', {
          lat: santaFeCity.latitude,
          lng: santaFeCity.longitude
        });
        
        await this.santaFeBranchService.createSantaFeBranch(santaFeCity, mainRouteCities);
        
        const branchPolylines = this.santaFeBranchService.getBranchPolylines();
        console.log('🔧 DEBUG: Santa Fe branch creation result:', {
          hasBranchPolyline: !!branchPolylines.branchPolyline,
          hasBranchCenterLine: !!branchPolylines.branchCenterLine,
          branchVisible: branchPolylines.branchPolyline?.getVisible(),
          centerVisible: branchPolylines.branchCenterLine?.getVisible()
        });
      }

      // Step 9: Verification with enhanced debugging
      if (!this.mainPolyline || !this.centerLine) {
        throw new Error('Failed to create main route polylines');
      }

      console.log('🔧 DEBUG: Route polylines verification - ENHANCED:', {
        mainPolylineExists: !!this.mainPolyline,
        centerLineExists: !!this.centerLine,
        mainPolylineVisible: this.mainPolyline.getVisible(),
        centerLineVisible: this.centerLine.getVisible(),
        mainPolylineMap: !!this.mainPolyline.getMap(),
        centerLineMap: !!this.centerLine.getMap(),
        mainPolylineZIndex: this.mainPolyline.getZIndex(),
        centerLineZIndex: this.centerLine.getZIndex(),
        pathLength: flowingMainPath.length,
        albuquerqueExcluded: !mainRouteCities.some(city => city.name.toLowerCase().includes('albuquerque')),
        santaRosaToGallupDirect: this.verifySantaRosaToGallupConnection(mainRouteCities),
        forceRecreateFlag: this.forceRecreateFlag
      });

      // Step 10: Register with global state and force visibility
      RouteGlobalState.addPolylineSegment(this.mainPolyline);
      RouteGlobalState.addPolylineSegment(this.centerLine);
      GlobalPolylineCleaner.registerPolyline(this.mainPolyline);
      GlobalPolylineCleaner.registerPolyline(this.centerLine);

      // Force visibility check
      setTimeout(() => {
        if (this.mainPolyline) {
          console.log('🔧 DEBUG: Post-creation visibility check:', {
            mainVisible: this.mainPolyline.getVisible(),
            mainMap: !!this.mainPolyline.getMap(),
            centerVisible: this.centerLine?.getVisible(),
            centerMap: !!this.centerLine?.getMap()
          });
          
          // Force visibility if needed
          if (!this.mainPolyline.getVisible()) {
            console.log('🔧 FIXING: Main polyline not visible, forcing visibility');
            this.mainPolyline.setVisible(true);
          }
          
          if (this.centerLine && !this.centerLine.getVisible()) {
            console.log('🔧 FIXING: Center line not visible, forcing visibility');
            this.centerLine.setVisible(true);
          }
        }
      }, 500);

      RouteGlobalState.setRouteCreated(true);

      console.log('✅ HISTORICALLY ACCURATE Route 66 FORCE CREATED: Santa Rosa → Santa Fe branch, consistent road formatting');
      console.log(`📊 Global state updated: ${RouteGlobalState.getPolylineCount()} polylines registered`);

      // Step 11: Fit map to route bounds including Santa Fe branch
      const allCities = santaFeCity ? [...mainRouteCities, santaFeCity] : mainRouteCities;
      RouteBoundsService.fitMapToBounds(this.map, allCities.map(city => ({
        lat: Number(city.latitude),
        lng: Number(city.longitude)
      })));

      console.log('🔧 DEBUG: Map bounds fitted to all cities including Santa Fe branch');

    } catch (error) {
      console.error('❌ Error creating FORCE RECREATED Route 66:', error);
      await this.cleanup();
      throw error;
    }
  }

  private verifySantaRosaToGallupConnection(mainRouteCities: DestinationCity[]): boolean {
    const santaRosaIndex = mainRouteCities.findIndex(city => 
      city.name.toLowerCase().includes('santa rosa')
    );
    const gallupIndex = mainRouteCities.findIndex(city => 
      city.name.toLowerCase().includes('gallup')
    );
    
    if (santaRosaIndex !== -1 && gallupIndex !== -1) {
      const directConnection = Math.abs(gallupIndex - santaRosaIndex) === 1;
      console.log('🔧 DEBUG: Santa Rosa → Gallup connection check:', {
        santaRosaIndex,
        gallupIndex,
        directConnection,
        citiesInBetween: directConnection ? 0 : Math.abs(gallupIndex - santaRosaIndex) - 1
      });
      return directConnection;
    }
    
    return false;
  }

  private async performNuclearCleanupWithCacheClearing(): Promise<void> {
    try {
      console.log('🧹 NUCLEAR cleanup with cache clearing starting');
      
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

      // Perform global cleanup with extended wait
      await RouteCleanupService.performAggressiveCleanup(this.map);
      
      // Additional cache clearing delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      console.log('✅ NUCLEAR cleanup with cache clearing completed');
      
    } catch (error) {
      console.error('❌ Error during nuclear cleanup with cache clearing:', error);
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
