
import { EnhancedPolylineStylesConfig } from './EnhancedPolylineStylesConfig';
import { EnhancedPathInterpolationService } from './EnhancedPathInterpolationService';
import { RouteGlobalState } from './RouteGlobalState';
import { GlobalPolylineCleaner } from './GlobalPolylineCleaner';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class SantaFeBranchService {
  private map: google.maps.Map;
  private santaFeBranchPolyline: google.maps.Polyline | null = null;
  private santaFeBranchCenterLine: google.maps.Polyline | null = null;

  constructor(map: google.maps.Map) {
    this.map = map;
  }

  async createSantaFeBranch(santaFeCity: DestinationCity, mainRouteCities: DestinationCity[]): Promise<void> {
    console.log('🌟 FORCE CREATING Santa Fe branch road segment - CONNECTING TO SANTA ROSA');
    console.log('🔧 DEBUG: Santa Fe branch creation starting with enhanced validation');

    // Find Santa Rosa as the PRIMARY connection point (not Albuquerque)
    const santaRosa = mainRouteCities.find(city => 
      city.name.toLowerCase().includes('santa rosa')
    );

    console.log('🔧 DEBUG: Santa Rosa search in main route cities:', {
      found: !!santaRosa,
      searchIn: mainRouteCities.map(c => c.name),
      santaRosaName: santaRosa?.name,
      santaRosaState: santaRosa?.state,
      santaRosaCoords: santaRosa ? `${santaRosa.latitude}, ${santaRosa.longitude}` : 'N/A'
    });

    if (!santaRosa) {
      console.warn('⚠️ Could not find Santa Rosa for Santa Fe branch connection');
      console.log('🔧 DEBUG: Available main route cities for connection:', 
        mainRouteCities.map(c => `${c.name}, ${c.state}`)
      );
      return;
    }

    console.log(`🔗 FORCE CONNECTING Santa Fe DIRECTLY to Santa Rosa (historical accuracy)`);
    console.log('🔧 DEBUG: Connection details:', {
      santaFeCoords: `${santaFeCity.latitude}, ${santaFeCity.longitude}`,
      santaRosaCoords: `${santaRosa.latitude}, ${santaRosa.longitude}`,
      distance: this.calculateDistance(santaFeCity, santaRosa)
    });

    // Create branch path: Santa Rosa -> Santa Fe -> Santa Rosa
    const branchPath = [
      { lat: Number(santaRosa.latitude), lng: Number(santaRosa.longitude) },
      { lat: Number(santaFeCity.latitude), lng: Number(santaFeCity.longitude) },
      { lat: Number(santaRosa.latitude), lng: Number(santaRosa.longitude) }
    ];

    console.log('🔧 DEBUG: Branch path coordinates:', branchPath);

    // Create flowing curved branch path with same interpolation as main route
    const flowingBranchPath = EnhancedPathInterpolationService.createFlowingCurvedPath(branchPath, 15);

    console.log(`🌟 Creating Santa Fe branch with ${flowingBranchPath.length} smooth points connecting to Santa Rosa`);
    console.log('🔧 DEBUG: Flowing branch path sample:', flowingBranchPath.slice(0, 3));

    // Create branch polylines with IDENTICAL styling to main route + cache-busting
    const branchPolylineOptions = {
      ...EnhancedPolylineStylesConfig.getFlowingRouteOptions(),
      path: flowingBranchPath,
      map: this.map,
      zIndex: 50 + Date.now() % 100 // Cache-busting zIndex, same level as main route
    };

    console.log('🔧 DEBUG: Branch polyline options:', {
      pathLength: branchPolylineOptions.path.length,
      zIndex: branchPolylineOptions.zIndex,
      strokeColor: branchPolylineOptions.strokeColor,
      strokeWeight: branchPolylineOptions.strokeWeight
    });

    this.santaFeBranchPolyline = new google.maps.Polyline(branchPolylineOptions);

    const branchCenterLineOptions = {
      ...EnhancedPolylineStylesConfig.getEnhancedCenterLineOptions(),
      path: flowingBranchPath,
      map: this.map,
      zIndex: 100 + Date.now() % 100 // Cache-busting zIndex, same level as main center line
    };

    console.log('🔧 DEBUG: Branch center line options:', {
      pathLength: branchCenterLineOptions.path.length,
      zIndex: branchCenterLineOptions.zIndex,
      strokePattern: branchCenterLineOptions.strokePattern
    });

    this.santaFeBranchCenterLine = new google.maps.Polyline(branchCenterLineOptions);

    // Verify creation and visibility
    console.log('🔧 DEBUG: Branch polylines creation verification:', {
      branchPolylineCreated: !!this.santaFeBranchPolyline,
      centerLineCreated: !!this.santaFeBranchCenterLine,
      branchVisible: this.santaFeBranchPolyline?.getVisible(),
      centerVisible: this.santaFeBranchCenterLine?.getVisible(),
      branchMap: !!this.santaFeBranchPolyline?.getMap(),
      centerMap: !!this.santaFeBranchCenterLine?.getMap()
    });

    // Register with global state and global cleaner
    if (this.santaFeBranchPolyline && this.santaFeBranchCenterLine) {
      RouteGlobalState.addPolylineSegment(this.santaFeBranchPolyline);
      RouteGlobalState.addPolylineSegment(this.santaFeBranchCenterLine);
      GlobalPolylineCleaner.registerPolyline(this.santaFeBranchPolyline);
      GlobalPolylineCleaner.registerPolyline(this.santaFeBranchCenterLine);
      
      console.log('🔧 DEBUG: Branch polylines registered with global systems');
    }

    // Force visibility check after a delay
    setTimeout(() => {
      if (this.santaFeBranchPolyline && this.santaFeBranchCenterLine) {
        console.log('🔧 DEBUG: Post-creation branch visibility check:', {
          branchVisible: this.santaFeBranchPolyline.getVisible(),
          centerVisible: this.santaFeBranchCenterLine.getVisible()
        });
        
        if (!this.santaFeBranchPolyline.getVisible()) {
          console.log('🔧 FIXING: Branch polyline not visible, forcing visibility');
          this.santaFeBranchPolyline.setVisible(true);
        }
        
        if (!this.santaFeBranchCenterLine.getVisible()) {
          console.log('🔧 FIXING: Branch center line not visible, forcing visibility');
          this.santaFeBranchCenterLine.setVisible(true);
        }
      }
    }, 500);

    console.log('✅ Santa Fe branch road segment FORCE CREATED with IDENTICAL styling to main route, connected to Santa Rosa');
  }

  private calculateDistance(city1: DestinationCity, city2: DestinationCity): string {
    const lat1 = Number(city1.latitude);
    const lng1 = Number(city1.longitude);
    const lat2 = Number(city2.latitude);
    const lng2 = Number(city2.longitude);
    
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return `${distance.toFixed(1)} km`;
  }

  getBranchPolylines(): { branchPolyline: google.maps.Polyline | null; branchCenterLine: google.maps.Polyline | null } {
    return {
      branchPolyline: this.santaFeBranchPolyline,
      branchCenterLine: this.santaFeBranchCenterLine
    };
  }

  cleanup(): void {
    console.log('🧹 Cleaning up Santa Fe branch polylines');
    
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
