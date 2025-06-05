
import { EnhancedPolylineStylesConfig } from './EnhancedPolylineStylesConfig';
import { EnhancedPathInterpolationService } from './EnhancedPathInterpolationService';
import { RouteGlobalState } from './RouteGlobalState';
import { GlobalPolylineCleaner } from './GlobalPolylineCleaner';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class DestinationCitiesRouteRenderer {
  private map: google.maps.Map;
  private mainPolyline: google.maps.Polyline | null = null;
  private centerLine: google.maps.Polyline | null = null;
  private santaFeBranchPolyline: google.maps.Polyline | null = null;
  private santaFeBranchCenterLine: google.maps.Polyline | null = null;

  // Updated Route 66 order with Santa Fe branch integration
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
    'Tucumcari',       // New Mexico - BRANCH POINT for Santa Fe
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
      console.log('🛣️ Creating FLOWING CURVED Route 66 with Santa Fe branch from destination cities');
      
      // Step 1: Aggressive cleanup of any existing routes
      await this.performAggressiveCleanup();
      
      if (cities.length < 2) {
        console.warn('⚠️ Need at least 2 cities to create a route');
        return;
      }

      // Step 2: Sort cities according to the Route 66 order and identify Santa Fe
      const { mainRouteCities, santaFeCity } = this.categorizeAndSortCities(cities);
      
      console.log(`🗺️ FLOWING Route 66 main route (${mainRouteCities.length} cities):`, 
        mainRouteCities.map((city, index) => `${index + 1}. ${city.name}, ${city.state}`)
      );

      if (santaFeCity) {
        console.log(`🎯 Santa Fe branch identified: ${santaFeCity.name}, ${santaFeCity.state}`);
      }

      // Step 3: Verify we have Chicago and Santa Monica for main route
      const hasChicago = mainRouteCities.some(city => city.name.toLowerCase().includes('chicago'));
      const hasSantaMonica = mainRouteCities.some(city => city.name.toLowerCase().includes('santa monica'));
      
      if (!hasChicago || !hasSantaMonica) {
        console.error('❌ Missing critical endpoints:', { hasChicago, hasSantaMonica });
        return;
      }

      if (mainRouteCities.length < 2) {
        console.warn('⚠️ Not enough cities found in the correct order to create main route');
        return;
      }

      // Step 4: Create main route path
      const mainRoutePath = mainRouteCities.map(city => ({
        lat: Number(city.latitude),
        lng: Number(city.longitude)
      }));

      // Step 5: Create FLOWING CURVED main path
      const flowingMainPath = EnhancedPathInterpolationService.createFlowingCurvedPath(mainRoutePath, 25);
      
      console.log(`🛣️ Creating main Route 66 with ${flowingMainPath.length} smooth points connecting ${mainRouteCities.length} cities`);

      // Step 6: Create main route polylines
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

      // Step 7: Create Santa Fe branch if Santa Fe exists
      if (santaFeCity) {
        await this.createSantaFeBranch(santaFeCity, mainRouteCities);
      }

      // Step 8: Verify polylines were created and are visible
      if (!this.mainPolyline || !this.centerLine) {
        throw new Error('Failed to create main route polylines');
      }

      console.log('🔍 Route polylines verification:', {
        mainPolylineVisible: this.mainPolyline.getVisible(),
        centerLineVisible: this.centerLine.getVisible(),
        santaFeBranchVisible: this.santaFeBranchPolyline?.getVisible() || 'N/A',
        mainPolylineMap: !!this.mainPolyline.getMap(),
        centerLineMap: !!this.centerLine.getMap(),
        pathLength: flowingMainPath.length
      });

      // Step 9: Register with global state and global cleaner
      RouteGlobalState.addPolylineSegment(this.mainPolyline);
      RouteGlobalState.addPolylineSegment(this.centerLine);
      GlobalPolylineCleaner.registerPolyline(this.mainPolyline);
      GlobalPolylineCleaner.registerPolyline(this.centerLine);

      if (this.santaFeBranchPolyline && this.santaFeBranchCenterLine) {
        RouteGlobalState.addPolylineSegment(this.santaFeBranchPolyline);
        RouteGlobalState.addPolylineSegment(this.santaFeBranchCenterLine);
        GlobalPolylineCleaner.registerPolyline(this.santaFeBranchPolyline);
        GlobalPolylineCleaner.registerPolyline(this.santaFeBranchCenterLine);
      }

      RouteGlobalState.setRouteCreated(true);

      console.log('✅ FLOWING CURVED Route 66 with Santa Fe branch created successfully');
      console.log(`📊 Global state updated: ${RouteGlobalState.getPolylineCount()} polylines registered`);

      // Step 10: Fit map to route bounds including branch
      const allCities = santaFeCity ? [...mainRouteCities, santaFeCity] : mainRouteCities;
      this.fitMapToBounds(allCities.map(city => ({
        lat: Number(city.latitude),
        lng: Number(city.longitude)
      })));

    } catch (error) {
      console.error('❌ Error creating Route 66 with Santa Fe branch:', error);
      await this.cleanup();
      throw error;
    }
  }

  private categorizeAndSortCities(cities: DestinationCity[]): {
    mainRouteCities: DestinationCity[];
    santaFeCity: DestinationCity | null;
  } {
    // Find Santa Fe
    const santaFeCity = cities.find(city => 
      city.name.toLowerCase().includes('santa fe') && city.state === 'NM'
    ) || null;

    // Get main route cities (excluding Santa Fe)
    const mainRouteCandidates = cities.filter(city => 
      !(city.name.toLowerCase().includes('santa fe') && city.state === 'NM')
    );

    // Sort main route cities according to Route 66 order
    const orderedMainCities: DestinationCity[] = [];
    const usedCities = new Set<string>();
    
    console.log('🔍 Available cities for main route matching:', mainRouteCandidates.map(c => `${c.name}, ${c.state}`));
    
    for (const expectedCityName of this.ROUTE_66_ORDER) {
      let matchingCity: DestinationCity | undefined;
      
      // Handle Springfield special cases
      if (expectedCityName === 'Springfield_IL') {
        matchingCity = mainRouteCandidates.find(city => {
          const cityKey = `${city.name}-${city.state}`;
          return !usedCities.has(cityKey) && 
                 city.name.toLowerCase().includes('springfield') && 
                 city.state === 'IL';
        });
      } else if (expectedCityName === 'Springfield_MO') {
        matchingCity = mainRouteCandidates.find(city => {
          const cityKey = `${city.name}-${city.state}`;
          return !usedCities.has(cityKey) && 
                 city.name.toLowerCase().includes('springfield') && 
                 city.state === 'MO';
        });
      } else {
        // Find matching city (case insensitive, partial match)
        matchingCity = mainRouteCandidates.find(city => {
          const cityKey = `${city.name}-${city.state}`;
          if (usedCities.has(cityKey)) return false;
          
          const cityName = city.name.toLowerCase();
          const expectedName = expectedCityName.toLowerCase();
          
          return cityName.includes(expectedName) || expectedName.includes(cityName);
        });
      }
      
      if (matchingCity) {
        orderedMainCities.push(matchingCity);
        usedCities.add(`${matchingCity.name}-${matchingCity.state}`);
        console.log(`✅ Found ${matchingCity.name} (${matchingCity.state}) for main route position: ${expectedCityName}`);
      }
    }
    
    return {
      mainRouteCities: orderedMainCities,
      santaFeCity
    };
  }

  private async createSantaFeBranch(santaFeCity: DestinationCity, mainRouteCities: DestinationCity[]): Promise<void> {
    console.log('🌟 Creating Santa Fe branch road segment');

    // Find the closest connection point on main route (likely near Albuquerque or Santa Rosa)
    const albuquerque = mainRouteCities.find(city => 
      city.name.toLowerCase().includes('albuquerque')
    );
    const santaRosa = mainRouteCities.find(city => 
      city.name.toLowerCase().includes('santa rosa')
    );

    // Use Albuquerque as primary connection point, Santa Rosa as fallback
    const connectionPoint = albuquerque || santaRosa;

    if (!connectionPoint) {
      console.warn('⚠️ Could not find suitable connection point for Santa Fe branch');
      return;
    }

    console.log(`🔗 Connecting Santa Fe to main route via ${connectionPoint.name}`);

    // Create branch path: Connection Point -> Santa Fe -> Connection Point
    const branchPath = [
      { lat: Number(connectionPoint.latitude), lng: Number(connectionPoint.longitude) },
      { lat: Number(santaFeCity.latitude), lng: Number(santaFeCity.longitude) },
      { lat: Number(connectionPoint.latitude), lng: Number(connectionPoint.longitude) }
    ];

    // Create flowing curved branch path
    const flowingBranchPath = EnhancedPathInterpolationService.createFlowingCurvedPath(branchPath, 15);

    console.log(`🌟 Creating Santa Fe branch with ${flowingBranchPath.length} smooth points`);

    // Create branch polylines with slightly different styling
    this.santaFeBranchPolyline = new google.maps.Polyline({
      ...EnhancedPolylineStylesConfig.getFlowingRouteOptions(),
      strokeWeight: 8, // Slightly thinner for branch
      strokeOpacity: 0.85, // Slightly more transparent
      path: flowingBranchPath,
      map: this.map,
      zIndex: 45 // Slightly lower than main route
    });

    this.santaFeBranchCenterLine = new google.maps.Polyline({
      ...EnhancedPolylineStylesConfig.getEnhancedCenterLineOptions(),
      path: flowingBranchPath,
      map: this.map,
      zIndex: 95, // Slightly lower than main center line
      icons: [{
        icon: {
          path: 'M 0,-3 0,3', // Slightly smaller dashes for branch
          strokeOpacity: 0.9,
          strokeColor: '#FFD700',
          strokeWeight: 4, // Thinner dashes for branch
          scale: 1
        },
        offset: '0',
        repeat: '45px' // Slightly closer spacing for branch
      }]
    });

    console.log('✅ Santa Fe branch road segment created successfully');
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

      if (this.santaFeBranchPolyline) {
        this.santaFeBranchPolyline.setMap(null);
        GlobalPolylineCleaner.unregisterPolyline(this.santaFeBranchPolyline);
        this.santaFeBranchPolyline = null;
      }

      if (this.santaFeBranchCenterLine) {
        this.santaFeBranchCenterLine.setMap(null);
        GlobalPolylineCleaner.unregisterPolyline(this.santaFeBranchCenterLine);
        this.santaFeBranchCenterLine = null;
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

    console.log('🗺️ Map bounds fitted to complete route including Santa Fe branch');
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

    if (this.santaFeBranchPolyline) {
      this.santaFeBranchPolyline.setMap(null);
      GlobalPolylineCleaner.unregisterPolyline(this.santaFeBranchPolyline);
      this.santaFeBranchPolyline = null;
    }

    if (this.santaFeBranchCenterLine) {
      this.santaFeBranchCenterLine.setMap(null);
      GlobalPolylineCleaner.unregisterPolyline(this.santaFeBranchCenterLine);
      this.santaFeBranchCenterLine = null;
    }
  }
}
