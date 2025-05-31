
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
    if (currentZoom <= 5) return 'ultra';    // More aggressive ultra clustering
    if (currentZoom <= 6.5) return 'large';  // Extended large clustering
    if (currentZoom <= 8) return 'medium';   // Extended medium clustering
    return 'small';
  }

  static getVisibilitySettings(currentZoom: number) {
    return {
      showClusters: currentZoom < 9.5,        // Show clusters longer
      showIndividual: currentZoom >= 8.5,     // Show individual markers later
      clusterLevel: this.getClusterZoomLevel(currentZoom),
      minClusterSize: this.getMinClusterSize(currentZoom),
      clusterRadius: this.getClusterRadius(currentZoom)
    };
  }

  private static getMinClusterSize(zoom: number): number {
    if (zoom <= 5) return 2; // Very aggressive clustering at low zoom
    if (zoom <= 6.5) return 2; // Still aggressive
    if (zoom <= 8) return 3; // Medium clustering
    return 4; // Small clustering at higher zoom
  }

  private static getClusterRadius(zoom: number): number {
    if (zoom <= 5) return 300000; // 300km - much more aggressive
    if (zoom <= 6.5) return 150000; // 150km - still very aggressive
    if (zoom <= 8) return 75000; // 75km - medium clustering
    return 35000; // 35km - tighter clustering
  }
}
