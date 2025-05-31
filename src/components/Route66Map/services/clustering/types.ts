
import type { Route66Waypoint } from '../../types/supabaseTypes';

export interface ClusterGroup {
  id: string;
  center: { lat: number; lng: number };
  markers: Route66Waypoint[];
  radius: number;
  isDestinationCluster: boolean;
  clusterLevel: 'ultra' | 'large' | 'medium' | 'small';
}

export interface ClusteringConfig {
  minClusterSize: number;
  clusterRadiusMeters: number;
  destinationExclusionRadius: number;
}

export interface ZoomBasedClusteringConfig {
  ultraCluster: {
    minClusterSize: number;
    radiusMeters: number;
    iconSizeMultiplier: number;
  };
  largeCluster: {
    minClusterSize: number;
    radiusMeters: number;
    iconSizeMultiplier: number;
  };
  mediumCluster: {
    minClusterSize: number;
    radiusMeters: number;
    iconSizeMultiplier: number;
  };
  smallCluster: {
    minClusterSize: number;
    radiusMeters: number;
    iconSizeMultiplier: number;
  };
}
