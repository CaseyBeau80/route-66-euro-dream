import type { Route66Waypoint } from '../types/supabaseTypes';

export class RouteGlobalState {
  private static routeCreated: boolean = false;
  private static smoothPolyline: google.maps.Polyline | null = null;
  private static centerLine: google.maps.Polyline | null = null;
  private static routeMarkers: google.maps.Marker[] = [];

  static isRouteCreated(): boolean {
    return this.routeCreated;
  }

  static setRouteCreated(created: boolean): void {
    this.routeCreated = created;
  }

  static getSmoothPolyline(): google.maps.Polyline | null {
    return this.smoothPolyline;
  }

  static setSmoothPolyline(polyline: google.maps.Polyline | null): void {
    this.smoothPolyline = polyline;
  }

  static getCenterLine(): google.maps.Polyline | null {
    return this.centerLine;
  }

  static setCenterLine(centerLine: google.maps.Polyline | null): void {
    this.centerLine = centerLine;
  }

  static addRouteMarker(marker: google.maps.Marker): void {
    this.routeMarkers.push(marker);
  }

  static getRouteMarkers(): google.maps.Marker[] {
    return this.routeMarkers;
  }

  static clearRouteMarkers(): void {
    this.routeMarkers = [];
  }

  // New polyline segments storage for icon-based road segments
  private static polylineSegments: google.maps.Polyline[] = [];

  static addPolylineSegment(polyline: google.maps.Polyline): void {
    this.polylineSegments.push(polyline);
  }

  static getPolylineSegments(): google.maps.Polyline[] {
    return this.polylineSegments;
  }

  static clearPolylineSegments(): void {
    this.polylineSegments = [];
  }
}
