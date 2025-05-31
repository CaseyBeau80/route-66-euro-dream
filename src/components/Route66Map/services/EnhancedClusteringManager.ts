
import type { Route66Waypoint } from '../types/supabaseTypes';
import { ClusterCreationService } from './clustering/ClusterCreationService';
import { ClusterIconGenerator } from './clustering/ClusterIconGenerator';
import type { ClusterGroup } from './clustering/types';

export class EnhancedClusteringManager {
  static createClusters(
    markers: Route66Waypoint[], 
    currentZoom: number,
    mapBounds: google.maps.LatLngBounds
  ): { clusters: ClusterGroup[], unclustered: Route66Waypoint[] } {
    return ClusterCreationService.createClusters(markers, currentZoom, mapBounds);
  }

  static shouldShowIndividualMarkers(currentZoom: number): boolean {
    return ClusterCreationService.shouldShowIndividualMarkers(currentZoom);
  }

  static getClusterIcon(markerCount: number, clusterLevel: 'ultra' | 'large' | 'medium' | 'small' = 'medium'): google.maps.Icon {
    return ClusterIconGenerator.getClusterIcon(markerCount, clusterLevel);
  }

  static getClusterZoomLevel(currentZoom: number): 'ultra' | 'large' | 'medium' | 'small' {
    if (currentZoom <= 4) return 'ultra';
    if (currentZoom <= 5.5) return 'large';
    if (currentZoom <= 7) return 'medium';
    return 'small';
  }

  static getVisibilitySettings(currentZoom: number) {
    return {
      showClusters: currentZoom < 8.5,
      showIndividual: currentZoom >= 7,
      clusterLevel: this.getClusterZoomLevel(currentZoom),
      minClusterSize: this.getMinClusterSize(currentZoom),
      clusterRadius: this.getClusterRadius(currentZoom)
    };
  }

  private static getMinClusterSize(zoom: number): number {
    if (zoom <= 4) return 2; // Ultra-aggressive clustering at very low zoom
    if (zoom <= 5.5) return 3; // Large clustering
    if (zoom <= 7) return 3; // Medium clustering
    return 4; // Small clustering
  }

  private static getClusterRadius(zoom: number): number {
    if (zoom <= 4) return 200000; // 200km
    if (zoom <= 5.5) return 100000; // 100km
    if (zoom <= 7) return 50000; // 50km
    return 25000; // 25km
  }
}
