
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
  ultra: {
    minClusterSize: number;
    radiusMeters: number;
    iconSizeMultiplier: number;
  };
  large: {
    minClusterSize: number;
    radiusMeters: number;
    iconSizeMultiplier: number;
  };
  medium: {
    minClusterSize: number;
    radiusMeters: number;
    iconSizeMultiplier: number;
  };
  small: {
    minClusterSize: number;
    radiusMeters: number;
    iconSizeMultiplier: number;
  };
}
