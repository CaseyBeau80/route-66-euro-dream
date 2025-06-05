
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

    // Register with global state and global cleaner
    if (this.santaFeBranchPolyline && this.santaFeBranchCenterLine) {
      RouteGlobalState.addPolylineSegment(this.santaFeBranchPolyline);
      RouteGlobalState.addPolylineSegment(this.santaFeBranchCenterLine);
      GlobalPolylineCleaner.registerPolyline(this.santaFeBranchPolyline);
      GlobalPolylineCleaner.registerPolyline(this.santaFeBranchCenterLine);
    }

    console.log('✅ Santa Fe branch road segment created successfully');
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
