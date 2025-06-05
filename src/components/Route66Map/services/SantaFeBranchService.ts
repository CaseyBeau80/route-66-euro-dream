
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
    console.log('🌟 Creating Santa Fe branch road segment - CONNECTING TO SANTA ROSA');

    // Find Santa Rosa as the PRIMARY connection point (not Albuquerque)
    const santaRosa = mainRouteCities.find(city => 
      city.name.toLowerCase().includes('santa rosa')
    );

    if (!santaRosa) {
      console.warn('⚠️ Could not find Santa Rosa for Santa Fe branch connection');
      return;
    }

    console.log(`🔗 Connecting Santa Fe DIRECTLY to Santa Rosa (historical accuracy)`);

    // Create branch path: Santa Rosa -> Santa Fe -> Santa Rosa
    const branchPath = [
      { lat: Number(santaRosa.latitude), lng: Number(santaRosa.longitude) },
      { lat: Number(santaFeCity.latitude), lng: Number(santaFeCity.longitude) },
      { lat: Number(santaRosa.latitude), lng: Number(santaRosa.longitude) }
    ];

    // Create flowing curved branch path with same interpolation as main route
    const flowingBranchPath = EnhancedPathInterpolationService.createFlowingCurvedPath(branchPath, 15);

    console.log(`🌟 Creating Santa Fe branch with ${flowingBranchPath.length} smooth points connecting to Santa Rosa`);

    // Create branch polylines with IDENTICAL styling to main route
    this.santaFeBranchPolyline = new google.maps.Polyline({
      ...EnhancedPolylineStylesConfig.getFlowingRouteOptions(),
      path: flowingBranchPath,
      map: this.map,
      zIndex: 50 // SAME zIndex as main route for consistency
    });

    this.santaFeBranchCenterLine = new google.maps.Polyline({
      ...EnhancedPolylineStylesConfig.getEnhancedCenterLineOptions(),
      path: flowingBranchPath,
      map: this.map,
      zIndex: 100 // SAME zIndex as main center line
    });

    // Register with global state and global cleaner
    if (this.santaFeBranchPolyline && this.santaFeBranchCenterLine) {
      RouteGlobalState.addPolylineSegment(this.santaFeBranchPolyline);
      RouteGlobalState.addPolylineSegment(this.santaFeBranchCenterLine);
      GlobalPolylineCleaner.registerPolyline(this.santaFeBranchPolyline);
      GlobalPolylineCleaner.registerPolyline(this.santaFeBranchCenterLine);
    }

    console.log('✅ Santa Fe branch road segment created with IDENTICAL styling to main route, connected to Santa Rosa');
  }

  getBranchPolylines(): { branchPolyline: google.maps.Polyline | null; branchCenterLine: google.maps.Polyline | null } {
    return {
      branchPolyline: this.santaFeBranchPolyline,
      branchCenterLine: this.santaFeBranchCenterLine
    };
  }

  cleanup(): void {
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
