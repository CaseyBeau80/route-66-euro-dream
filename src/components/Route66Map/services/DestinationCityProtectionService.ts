
import type { Route66Waypoint } from '../types/supabaseTypes';

export class DestinationCityProtectionService {
  private static protectedDestinations: Set<string> = new Set();
  private static readonly DESTINATION_Z_INDEX = 10000;
  private static readonly PROTECTED_ZOOM_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  static registerDestinationCity(destinationId: string): void {
    this.protectedDestinations.add(destinationId);
    console.log(`🛡️ Protected destination city registered: ${destinationId}`);
  }

  static unregisterDestinationCity(destinationId: string): void {
    this.protectedDestinations.delete(destinationId);
    console.log(`🛡️ Protected destination city unregistered: ${destinationId}`);
  }

  static isProtectedDestination(destinationId: string): boolean {
    return this.protectedDestinations.has(destinationId);
  }

  static getDestinationZIndex(): number {
    return this.DESTINATION_Z_INDEX;
  }

  static shouldAlwaysRender(currentZoom: number): boolean {
    // Destination cities should always render at all zoom levels
    return this.PROTECTED_ZOOM_LEVELS.includes(Math.floor(currentZoom));
  }

  static getProtectedDestinations(): string[] {
    return Array.from(this.protectedDestinations);
  }

  static clearProtectedDestinations(): void {
    console.log(`🧹 Clearing ${this.protectedDestinations.size} protected destinations`);
    this.protectedDestinations.clear();
  }

  static validateDestinationCities(waypoints: Route66Waypoint[]): Route66Waypoint[] {
    const destinationCities = waypoints.filter(wp => wp.is_major_stop === true);
    console.log(`🛡️ Validating ${destinationCities.length} destination cities for protection:`, 
      destinationCities.map(d => d.name));
    
    // Auto-register all destination cities
    destinationCities.forEach(dest => {
      this.registerDestinationCity(dest.id);
    });

    return destinationCities;
  }
}
