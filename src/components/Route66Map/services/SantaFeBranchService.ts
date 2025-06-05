
import { EnhancedPolylineStylesConfig } from './EnhancedPolylineStylesConfig';
import { EnhancedPathInterpolationService } from './EnhancedPathInterpolationService';
import { RouteGlobalState } from './RouteGlobalState';
import { GlobalPolylineCleaner } from './GlobalPolylineCleaner';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class SantaFeBranchService {
  private map: google.maps.Map;
  private santaFeBranchPolyline: google.maps.Polyline | null = null;
  private santaFeBranchCenterLine: google.maps.Polyline | null = null;
  private santaFeAlbuquerqueBranchPolyline: google.maps.Polyline | null = null;
  private santaFeAlbuquerqueBranchCenterLine: google.maps.Polyline | null = null;

  constructor(map: google.maps.Map) {
    this.map = map;
  }

  async createSantaFeBranch(santaFeCity: DestinationCity, mainRouteCities: DestinationCity[]): Promise<void> {
    console.log('🌟 CREATING Santa Fe branch road segments - CONNECTING TO SANTA ROSA AND ALBUQUERQUE');
    console.log('🔧 DEBUG: Santa Fe branch creation starting with enhanced validation');

    // Find Santa Rosa as the PRIMARY connection point
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

    if (santaRosa) {
      await this.createSantaFeToSantaRosaBranch(santaFeCity, santaRosa);
    }

    // Find Albuquerque for the new connection
    const albuquerque = mainRouteCities.find(city => 
      city.name.toLowerCase().includes('albuquerque')
    );

    console.log('🔧 DEBUG: Albuquerque search for Santa Fe connection:', {
      found: !!albuquerque,
      albuquerqueName: albuquerque?.name,
      albuquerqueState: albuquerque?.state,
      albuquerqueCoords: albuquerque ? `${albuquerque.latitude}, ${albuquerque.longitude}` : 'N/A'
    });

    if (albuquerque) {
      await this.createSantaFeToAlbuquerqueBranch(santaFeCity, albuquerque);
    }

    if (!santaRosa && !albuquerque) {
      console.warn('⚠️ Could not find Santa Rosa or Albuquerque for Santa Fe branch connections');
      console.log('🔧 DEBUG: Available main route cities for connection:', 
        mainRouteCities.map(c => `${c.name}, ${c.state}`)
      );
    }
  }

  private async createSantaFeToSantaRosaBranch(santaFeCity: DestinationCity, santaRosa: DestinationCity): Promise<void> {
    console.log(`🔗 CREATING Santa Fe to Santa Rosa connection (historical accuracy)`);
    console.log('🔧 DEBUG: Santa Rosa connection details:', {
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

    // Create flowing curved branch path
    const flowingBranchPath = EnhancedPathInterpolationService.createFlowingCurvedPath(branchPath, 15);

    console.log(`🌟 Creating Santa Fe to Santa Rosa branch with ${flowingBranchPath.length} smooth points`);

    // Create branch polylines
    const branchPolylineOptions = {
      ...EnhancedPolylineStylesConfig.getFlowingRouteOptions(),
      path: flowingBranchPath,
      map: this.map,
      zIndex: 50 + Date.now() % 100
    };

    this.santaFeBranchPolyline = new google.maps.Polyline(branchPolylineOptions);

    const branchCenterLineOptions = {
      ...EnhancedPolylineStylesConfig.getEnhancedCenterLineOptions(),
      path: flowingBranchPath,
      map: this.map,
      zIndex: 100 + Date.now() % 100
    };

    this.santaFeBranchCenterLine = new google.maps.Polyline(branchCenterLineOptions);

    // Register with global state
    if (this.santaFeBranchPolyline && this.santaFeBranchCenterLine) {
      RouteGlobalState.addPolylineSegment(this.santaFeBranchPolyline);
      RouteGlobalState.addPolylineSegment(this.santaFeBranchCenterLine);
      GlobalPolylineCleaner.registerPolyline(this.santaFeBranchPolyline);
      GlobalPolylineCleaner.registerPolyline(this.santaFeBranchCenterLine);
    }

    console.log('✅ Santa Fe to Santa Rosa branch road segment created');
  }

  private async createSantaFeToAlbuquerqueBranch(santaFeCity: DestinationCity, albuquerque: DestinationCity): Promise<void> {
    console.log(`🔗 CREATING Santa Fe to Albuquerque connection`);
    console.log('🔧 DEBUG: Albuquerque connection details:', {
      santaFeCoords: `${santaFeCity.latitude}, ${santaFeCity.longitude}`,
      albuquerqueCoords: `${albuquerque.latitude}, ${albuquerque.longitude}`,
      distance: this.calculateDistance(santaFeCity, albuquerque)
    });

    // Create branch path: Santa Fe -> Albuquerque -> Santa Fe
    const albuquerqueBranchPath = [
      { lat: Number(santaFeCity.latitude), lng: Number(santaFeCity.longitude) },
      { lat: Number(albuquerque.latitude), lng: Number(albuquerque.longitude) },
      { lat: Number(santaFeCity.latitude), lng: Number(santaFeCity.longitude) }
    ];

    // Create flowing curved branch path
    const flowingAlbuquerqueBranchPath = EnhancedPathInterpolationService.createFlowingCurvedPath(albuquerqueBranchPath, 15);

    console.log(`🌟 Creating Santa Fe to Albuquerque branch with ${flowingAlbuquerqueBranchPath.length} smooth points`);

    // Create Albuquerque branch polylines
    const albuquerqueBranchPolylineOptions = {
      ...EnhancedPolylineStylesConfig.getFlowingRouteOptions(),
      path: flowingAlbuquerqueBranchPath,
      map: this.map,
      zIndex: 50 + Date.now() % 100
    };

    this.santaFeAlbuquerqueBranchPolyline = new google.maps.Polyline(albuquerqueBranchPolylineOptions);

    const albuquerqueBranchCenterLineOptions = {
      ...EnhancedPolylineStylesConfig.getEnhancedCenterLineOptions(),
      path: flowingAlbuquerqueBranchPath,
      map: this.map,
      zIndex: 100 + Date.now() % 100
    };

    this.santaFeAlbuquerqueBranchCenterLine = new google.maps.Polyline(albuquerqueBranchCenterLineOptions);

    // Register with global state
    if (this.santaFeAlbuquerqueBranchPolyline && this.santaFeAlbuquerqueBranchCenterLine) {
      RouteGlobalState.addPolylineSegment(this.santaFeAlbuquerqueBranchPolyline);
      RouteGlobalState.addPolylineSegment(this.santaFeAlbuquerqueBranchCenterLine);
      GlobalPolylineCleaner.registerPolyline(this.santaFeAlbuquerqueBranchPolyline);
      GlobalPolylineCleaner.registerPolyline(this.santaFeAlbuquerqueBranchCenterLine);
    }

    console.log('✅ Santa Fe to Albuquerque branch road segment created');
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
    albuquerqueBranchPolyline: google.maps.Polyline | null;
    albuquerqueBranchCenterLine: google.maps.Polyline | null;
  } {
    return {
      branchPolyline: this.santaFeBranchPolyline,
      branchCenterLine: this.santaFeBranchCenterLine,
      albuquerqueBranchPolyline: this.santaFeAlbuquerqueBranchPolyline,
      albuquerqueBranchCenterLine: this.santaFeAlbuquerqueBranchCenterLine
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

    if (this.santaFeAlbuquerqueBranchPolyline) {
      this.santaFeAlbuquerqueBranchPolyline.setMap(null);
      GlobalPolylineCleaner.unregisterPolyline(this.santaFeAlbuquerqueBranchPolyline);
      this.santaFeAlbuquerqueBranchPolyline = null;
    }

    if (this.santaFeAlbuquerqueBranchCenterLine) {
      this.santaFeAlbuquerqueBranchCenterLine.setMap(null);
      GlobalPolylineCleaner.unregisterPolyline(this.santaFeAlbuquerqueBranchCenterLine);
      this.santaFeAlbuquerqueBranchCenterLine = null;
    }
  }
}
