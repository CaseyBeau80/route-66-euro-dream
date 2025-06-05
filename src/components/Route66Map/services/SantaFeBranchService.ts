
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

  async createSantaFeBranch(
    santaFeCity: DestinationCity, 
    albuquerqueCity: DestinationCity | null,
    mainRouteCities: DestinationCity[]
  ): Promise<void> {
    console.log('🌟 CREATING Santa Fe branch: Santa Rosa → Santa Fe → Albuquerque');
    console.log('🔧 DEBUG: Santa Fe branch creation with flowing connection');

    // Find Santa Rosa as the connection point
    const santaRosa = mainRouteCities.find(city => 
      city.name.toLowerCase().includes('santa rosa')
    );

    console.log('🔧 DEBUG: Santa Rosa search for branch connection:', {
      found: !!santaRosa,
      santaRosaName: santaRosa?.name,
      santaRosaState: santaRosa?.state,
      santaRosaCoords: santaRosa ? `${santaRosa.latitude}, ${santaRosa.longitude}` : 'N/A'
    });

    if (!santaRosa) {
      console.error('❌ Could not find Santa Rosa for Santa Fe branch connection');
      return;
    }

    if (!albuquerqueCity) {
      console.warn('⚠️ Albuquerque not found - creating simple Santa Rosa → Santa Fe branch');
      await this.createSimpleSantaFeBranch(santaFeCity, santaRosa);
      return;
    }

    // Create flowing branch path: Santa Rosa → Santa Fe → Albuquerque
    await this.createFlowingSantaFeBranch(santaRosa, santaFeCity, albuquerqueCity);
  }

  private async createFlowingSantaFeBranch(
    santaRosa: DestinationCity,
    santaFeCity: DestinationCity,
    albuquerqueCity: DestinationCity
  ): Promise<void> {
    console.log('🔗 CREATING flowing Santa Fe branch: Santa Rosa → Santa Fe → Albuquerque');
    console.log('🔧 DEBUG: Branch connection details:', {
      santaRosaCoords: `${santaRosa.latitude}, ${santaRosa.longitude}`,
      santaFeCoords: `${santaFeCity.latitude}, ${santaFeCity.longitude}`,
      albuquerqueCoords: `${albuquerqueCity.latitude}, ${albuquerqueCity.longitude}`,
      santaRosaToSantaFe: this.calculateDistance(santaRosa, santaFeCity),
      santaFeToAlbuquerque: this.calculateDistance(santaFeCity, albuquerqueCity)
    });

    // Create flowing branch path: Santa Rosa → Santa Fe → Albuquerque
    const branchPath = [
      { lat: Number(santaRosa.latitude), lng: Number(santaRosa.longitude) },
      { lat: Number(santaFeCity.latitude), lng: Number(santaFeCity.longitude) },
      { lat: Number(albuquerqueCity.latitude), lng: Number(albuquerqueCity.longitude) }
    ];

    // Create flowing curved branch path with more interpolation points for smoothness
    const flowingBranchPath = EnhancedPathInterpolationService.createFlowingCurvedPath(branchPath, 20);

    console.log(`🌟 Creating flowing Santa Fe branch with ${flowingBranchPath.length} smooth points`);

    // Create branch polylines
    const branchPolylineOptions = {
      ...EnhancedPolylineStylesConfig.getFlowingRouteOptions(),
      path: flowingBranchPath,
      map: this.map,
      zIndex: 60 + Date.now() % 100 // Higher zIndex for branch visibility
    };

    this.santaFeBranchPolyline = new google.maps.Polyline(branchPolylineOptions);

    const branchCenterLineOptions = {
      ...EnhancedPolylineStylesConfig.getEnhancedCenterLineOptions(),
      path: flowingBranchPath,
      map: this.map,
      zIndex: 110 + Date.now() % 100 // Higher zIndex for center line
    };

    this.santaFeBranchCenterLine = new google.maps.Polyline(branchCenterLineOptions);

    // Register with global state
    if (this.santaFeBranchPolyline && this.santaFeBranchCenterLine) {
      RouteGlobalState.addPolylineSegment(this.santaFeBranchPolyline);
      RouteGlobalState.addPolylineSegment(this.santaFeBranchCenterLine);
      GlobalPolylineCleaner.registerPolyline(this.santaFeBranchPolyline);
      GlobalPolylineCleaner.registerPolyline(this.santaFeBranchCenterLine);
    }

    console.log('✅ Flowing Santa Fe branch created: Santa Rosa → Santa Fe → Albuquerque');
  }

  private async createSimpleSantaFeBranch(santaFeCity: DestinationCity, santaRosa: DestinationCity): Promise<void> {
    console.log('🔗 CREATING simple Santa Fe branch: Santa Rosa → Santa Fe');
    
    // Create simple branch path: Santa Rosa → Santa Fe → Santa Rosa
    const branchPath = [
      { lat: Number(santaRosa.latitude), lng: Number(santaRosa.longitude) },
      { lat: Number(santaFeCity.latitude), lng: Number(santaFeCity.longitude) },
      { lat: Number(santaRosa.latitude), lng: Number(santaRosa.longitude) }
    ];

    const flowingBranchPath = EnhancedPathInterpolationService.createFlowingCurvedPath(branchPath, 15);

    console.log(`🌟 Creating simple Santa Fe branch with ${flowingBranchPath.length} smooth points`);

    // Create branch polylines
    const branchPolylineOptions = {
      ...EnhancedPolylineStylesConfig.getFlowingRouteOptions(),
      path: flowingBranchPath,
      map: this.map,
      zIndex: 60 + Date.now() % 100
    };

    this.santaFeBranchPolyline = new google.maps.Polyline(branchPolylineOptions);

    const branchCenterLineOptions = {
      ...EnhancedPolylineStylesConfig.getEnhancedCenterLineOptions(),
      path: flowingBranchPath,
      map: this.map,
      zIndex: 110 + Date.now() % 100
    };

    this.santaFeBranchCenterLine = new google.maps.Polyline(branchCenterLineOptions);

    // Register with global state
    if (this.santaFeBranchPolyline && this.santaFeBranchCenterLine) {
      RouteGlobalState.addPolylineSegment(this.santaFeBranchPolyline);
      RouteGlobalState.addPolylineSegment(this.santaFeBranchCenterLine);
      GlobalPolylineCleaner.registerPolyline(this.santaFeBranchPolyline);
      GlobalPolylineCleaner.registerPolyline(this.santaFeBranchCenterLine);
    }

    console.log('✅ Simple Santa Fe branch created: Santa Rosa → Santa Fe');
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

  getBranchPolylines(): { 
    branchPolyline: google.maps.Polyline | null; 
    branchCenterLine: google.maps.Polyline | null;
  } {
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
