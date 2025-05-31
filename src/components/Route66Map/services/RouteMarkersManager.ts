
import type { Route66Waypoint } from '../types/supabaseTypes';
import { RouteGlobalState } from './RouteGlobalState';

export class RouteMarkersManager {
  private hoverTimeouts = new Map<string, NodeJS.Timeout>();
  private showDelayTimeouts = new Map<string, NodeJS.Timeout>();

  constructor(private map: google.maps.Map) {}

  createRouteMarkers(majorStopsOnly: Route66Waypoint[]): void {
    // COMPLETELY DISABLED to prevent yellow circle markers
    // All destination markers are now handled by DestinationCitiesContainer
    console.log('⚠️ RouteMarkersManager: COMPLETELY DISABLED - replaced by DestinationCitiesContainer to prevent yellow circle overlaps');
    console.log('🏛️ Use DestinationCitiesContainer for destination city markers instead');
    return;
  }

  private createInfoWindowContent(waypoint: Route66Waypoint): string {
    // DISABLED - not used anymore
    return '';
  }

  cleanupMarkers(): void {
    console.log('🧹 RouteMarkersManager: Cleaning up any remaining markers');
    
    // Clear all pending timeouts
    this.hoverTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.showDelayTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.hoverTimeouts.clear();
    this.showDelayTimeouts.clear();

    // Clean up any existing markers from the global state
    RouteGlobalState.getRouteMarkers().forEach(marker => {
      console.log('🧹 Removing old route marker');
      marker.setMap(null);
    });
    RouteGlobalState.clearRouteMarkers();
    
    console.log('✅ RouteMarkersManager cleanup completed - no more yellow circles');
  }
}
