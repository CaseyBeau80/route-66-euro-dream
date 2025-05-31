
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

  static getClusterIcon(markerCount: number): google.maps.Icon {
    return ClusterIconGenerator.getClusterIcon(markerCount);
  }
}
