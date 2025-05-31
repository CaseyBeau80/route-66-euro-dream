
import type { Route66Waypoint } from '../types/supabaseTypes';
import { RouteGlobalState } from './RouteGlobalState';

export class RouteMarkersManager {
  private hoverTimeouts = new Map<string, NodeJS.Timeout>();
  private showDelayTimeouts = new Map<string, NodeJS.Timeout>();

  constructor(private map: google.maps.Map) {}

  createRouteMarkers(majorStopsOnly: Route66Waypoint[]): void {
    // VALIDATION: Ensure we're only working with major stops
    const nonMajorStops = majorStopsOnly.filter(wp => wp.is_major_stop !== true);
    if (nonMajorStops.length > 0) {
      console.error('❌ CRITICAL ERROR: Non-major stops detected in Route 66 shield creation:', 
        nonMajorStops.map(s => s.name));
      return;
    }

    console.log(`🛡️ Creating Route 66 shield markers for ${majorStopsOnly.length} major stops only:`);
    
    majorStopsOnly.forEach((waypoint, index) => {
      console.log(`  ${index + 1}. Creating Route 66 shield for: ${waypoint.name} (${waypoint.state})`);
      
      const marker = new google.maps.Marker({
        position: { lat: waypoint.latitude, lng: waypoint.longitude },
        map: this.map,
        title: waypoint.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#FFD700',
          fillOpacity: 1,
          strokeColor: '#2C2C2C',
          strokeWeight: 2
        },
        zIndex: 2000
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: this.createInfoWindowContent(waypoint)
      });

      // Add hover delay for info window
      const markerId = `route-marker-${waypoint.id}`;
      
      marker.addListener('mouseover', () => {
        // Clear any pending hide timeout
        const existingHideTimeout = this.hoverTimeouts.get(markerId);
        if (existingHideTimeout) {
          clearTimeout(existingHideTimeout);
          this.hoverTimeouts.delete(markerId);
        }

        // Clear any existing show delay
        const existingShowTimeout = this.showDelayTimeouts.get(markerId);
        if (existingShowTimeout) {
          clearTimeout(existingShowTimeout);
        }

        console.log(`⏳ Starting hover delay for Route 66 marker: ${waypoint.name}`);
        
        // Add 400ms delay before showing the info window
        const showTimeout = setTimeout(() => {
          // Close any open info windows
          RouteGlobalState.getRouteMarkers().forEach(m => {
            const iw = (m as any).infoWindow;
            if (iw) iw.close();
          });
          
          console.log(`🛡️ Showing info window for Route 66 marker: ${waypoint.name}`);
          infoWindow.open(this.map, marker);
          this.showDelayTimeouts.delete(markerId);
        }, 400);
        
        this.showDelayTimeouts.set(markerId, showTimeout);
      });

      marker.addListener('mouseout', () => {
        // Clear any pending show delay
        const existingShowTimeout = this.showDelayTimeouts.get(markerId);
        if (existingShowTimeout) {
          clearTimeout(existingShowTimeout);
          this.showDelayTimeouts.delete(markerId);
          console.log(`🚫 Cancelled hover delay for Route 66 marker: ${waypoint.name}`);
        }

        // Clear any existing hide timeout
        const existingHideTimeout = this.hoverTimeouts.get(markerId);
        if (existingHideTimeout) {
          clearTimeout(existingHideTimeout);
        }

        // Add delay before hiding
        const hideTimeout = setTimeout(() => {
          console.log(`🛡️ Hiding info window for Route 66 marker: ${waypoint.name}`);
          infoWindow.close();
          this.hoverTimeouts.delete(markerId);
        }, 300);
        
        this.hoverTimeouts.set(markerId, hideTimeout);
      });

      marker.addListener('click', () => {
        // Clear any timeouts on click
        const showTimeout = this.showDelayTimeouts.get(markerId);
        const hideTimeout = this.hoverTimeouts.get(markerId);
        
        if (showTimeout) {
          clearTimeout(showTimeout);
          this.showDelayTimeouts.delete(markerId);
        }
        if (hideTimeout) {
          clearTimeout(hideTimeout);
          this.hoverTimeouts.delete(markerId);
        }

        // Close any open info windows
        RouteGlobalState.getRouteMarkers().forEach(m => {
          const iw = (m as any).infoWindow;
          if (iw) iw.close();
        });
        
        infoWindow.open(this.map, marker);
      });

      (marker as any).infoWindow = infoWindow;
      RouteGlobalState.addRouteMarker(marker);
    });

    console.log(`📍 Created ${RouteGlobalState.getRouteMarkers().length} Route 66 shield markers for major stops only`);
  }

  private createInfoWindowContent(waypoint: Route66Waypoint): string {
    return `
      <div style="padding: 8px; max-width: 200px;">
        <h3 style="margin: 0 0 4px 0; color: #2C2C2C; font-size: 14px; font-weight: bold;">
          ${waypoint.name}
        </h3>
        <p style="margin: 0; color: #666; font-size: 12px;">
          ${waypoint.state} • ${waypoint.highway_designation || 'Route 66'}
        </p>
        ${waypoint.description ? `
          <p style="margin: 4px 0 0 0; color: #666; font-size: 11px;">
            ${waypoint.description}
          </p>
        ` : ''}
      </div>
    `;
  }

  cleanupMarkers(): void {
    // Clear all pending timeouts
    this.hoverTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.showDelayTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.hoverTimeouts.clear();
    this.showDelayTimeouts.clear();

    RouteGlobalState.getRouteMarkers().forEach(marker => {
      marker.setMap(null);
    });
    RouteGlobalState.clearRouteMarkers();
  }
}
