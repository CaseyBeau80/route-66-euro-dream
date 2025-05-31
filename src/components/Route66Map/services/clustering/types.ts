
import type { Route66Waypoint } from '../../types/supabaseTypes';

export interface ClusterGroup {
  id: string;
  center: { lat: number; lng: number };
  markers: Route66Waypoint[];
  radius: number;
  isDestinationCluster: boolean;
}

export interface ClusteringConfig {
  minClusterSize: number;
  clusterRadiusMeters: number;
  destinationExclusionRadius: number;
}
