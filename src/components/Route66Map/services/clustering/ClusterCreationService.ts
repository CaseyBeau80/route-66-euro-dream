import type { Route66Waypoint } from '../../types/supabaseTypes';
import { DestinationCityProtectionService } from '../DestinationCityProtectionService';
import { DistanceCalculator } from './DistanceCalculator';
import type { ClusterGroup, ClusteringConfig } from './types';

export class ClusterCreationService {
  private static readonly DEFAULT_CONFIG: ClusteringConfig = {
    minClusterSize: 3,
    clusterRadiusMeters: 50000, // 50km
    destinationExclusionRadius: 75000 // 75km around destinations
  };

  static createClusters(
    markers: Route66Waypoint[], 
    currentZoom: number,
    mapBounds: google.maps.LatLngBounds,
    config: Partial<ClusteringConfig> = {}
  ): { clusters: ClusterGroup[], unclustered: Route66Waypoint[] } {
    const clusterConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    console.log(`🎯 Creating enhanced clusters for ${markers.length} markers at zoom ${currentZoom}`);
    
    // Always exclude destination cities from clustering
    const destinationCities = DestinationCityProtectionService.validateDestinationCities(markers);
    const nonDestinationMarkers = markers.filter(m => !destinationCities.some(d => d.id === m.id));
    
    console.log(`🛡️ Protected ${destinationCities.length} destination cities from clustering`);
    console.log(`🎯 Processing ${nonDestinationMarkers.length} non-destination markers for clustering`);

    // Filter markers that are visible in current bounds
    const visibleMarkers = nonDestinationMarkers.filter(marker => {
      const position = new google.maps.LatLng(marker.latitude, marker.longitude);
      return mapBounds.contains(position);
    });

    // Create clusters based on zoom level and proximity
    const clusters: ClusterGroup[] = [];
    const unclustered: Route66Waypoint[] = [...destinationCities]; // Always include destinations as unclustered
    const processed = new Set<string>();

    for (const marker of visibleMarkers) {
      if (processed.has(marker.id)) continue;

      // Check if this marker is too close to a destination city
      const tooCloseToDestination = destinationCities.some(dest => {
        const distance = DistanceCalculator.calculateDistance(
          marker.latitude, marker.longitude,
          dest.latitude, dest.longitude
        );
        return distance < clusterConfig.destinationExclusionRadius;
      });

      if (tooCloseToDestination) {
        unclustered.push(marker);
        processed.add(marker.id);
        continue;
      }

      // Find nearby markers for clustering
      const nearbyMarkers = visibleMarkers.filter(other => {
        if (processed.has(other.id) || other.id === marker.id) return false;
        
        const distance = DistanceCalculator.calculateDistance(
          marker.latitude, marker.longitude,
          other.latitude, other.longitude
        );
        return distance < clusterConfig.clusterRadiusMeters;
      });

      if (nearbyMarkers.length + 1 >= clusterConfig.minClusterSize) {
        // Create a cluster
        const clusterMarkers = [marker, ...nearbyMarkers];
        const center = DistanceCalculator.calculateClusterCenter(clusterMarkers);
        
        clusters.push({
          id: `cluster-${marker.id}`,
          center,
          markers: clusterMarkers,
          radius: clusterConfig.clusterRadiusMeters,
          isDestinationCluster: false
        });

        // Mark all clustered markers as processed
        clusterMarkers.forEach(m => processed.add(m.id));
        console.log(`📍 Created cluster with ${clusterMarkers.length} markers near ${marker.name}`);
      } else {
        // Not enough nearby markers, keep as individual
        unclustered.push(marker);
        processed.add(marker.id);
      }
    }

    console.log(`✅ Enhanced clustering complete: ${clusters.length} clusters, ${unclustered.length} individual markers`);
    return { clusters, unclustered };
  }

  static shouldShowIndividualMarkers(currentZoom: number): boolean {
    // Show individual markers at higher zoom levels
    return currentZoom >= 8;
  }
}
