
import type { Route66Waypoint } from '../../types/supabaseTypes';
import { DestinationCityProtectionService } from '../DestinationCityProtectionService';
import { DistanceCalculator } from './DistanceCalculator';
import type { ClusterGroup, ClusteringConfig, ZoomBasedClusteringConfig } from './types';

export class ClusterCreationService {
  private static readonly DEFAULT_CONFIG: ClusteringConfig = {
    minClusterSize: 2, // More aggressive default
    clusterRadiusMeters: 75000, // Larger default radius
    destinationExclusionRadius: 100000 // Larger exclusion zone around destinations
  };

  private static readonly ZOOM_CONFIGS: ZoomBasedClusteringConfig = {
    ultra: {
      minClusterSize: 2,
      radiusMeters: 300000, // 300km - very aggressive clustering
      iconSizeMultiplier: 2.0
    },
    large: {
      minClusterSize: 2,
      radiusMeters: 150000, // 150km - aggressive clustering
      iconSizeMultiplier: 1.7
    },
    medium: {
      minClusterSize: 3,
      radiusMeters: 75000, // 75km - medium clustering
      iconSizeMultiplier: 1.4
    },
    small: {
      minClusterSize: 4,
      radiusMeters: 35000, // 35km - tighter clustering
      iconSizeMultiplier: 1.0
    }
  };

  static createClusters(
    markers: Route66Waypoint[], 
    currentZoom: number,
    mapBounds: google.maps.LatLngBounds,
    config: Partial<ClusteringConfig> = {}
  ): { clusters: ClusterGroup[], unclustered: Route66Waypoint[] } {
    const clusterConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    console.log(`🎯 Creating aggressive clusters for ${markers.length} markers at zoom ${currentZoom.toFixed(1)}`);
    
    // Determine clustering level based on zoom
    const clusterLevel = this.getClusterLevel(currentZoom);
    const zoomConfig = this.ZOOM_CONFIGS[clusterLevel];
    
    console.log(`📊 Using ${clusterLevel} clustering:`, {
      minClusterSize: zoomConfig.minClusterSize,
      radius: `${(zoomConfig.radiusMeters / 1000).toFixed(0)}km`
    });
    
    // Always exclude destination cities from clustering
    const destinationCities = DestinationCityProtectionService.validateDestinationCities(markers);
    const nonDestinationMarkers = markers.filter(m => !destinationCities.some(d => d.id === m.id));
    
    console.log(`🛡️ Protected ${destinationCities.length} destination cities from clustering`);

    // Filter markers that are visible in current bounds with expanded view
    const expandedBounds = this.expandBounds(mapBounds, currentZoom);
    const visibleMarkers = nonDestinationMarkers.filter(marker => {
      const position = new google.maps.LatLng(marker.latitude, marker.longitude);
      return expandedBounds.contains(position);
    });

    console.log(`👁️ ${visibleMarkers.length} non-destination markers visible in expanded bounds`);

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

      // Find nearby markers for clustering using zoom-based radius
      const nearbyMarkers = visibleMarkers.filter(other => {
        if (processed.has(other.id) || other.id === marker.id) return false;
        
        const distance = DistanceCalculator.calculateDistance(
          marker.latitude, marker.longitude,
          other.latitude, other.longitude
        );
        return distance < zoomConfig.radiusMeters;
      });

      if (nearbyMarkers.length + 1 >= zoomConfig.minClusterSize) {
        // Create a cluster
        const clusterMarkers = [marker, ...nearbyMarkers];
        const center = DistanceCalculator.calculateClusterCenter(clusterMarkers);
        
        clusters.push({
          id: `cluster-${clusterLevel}-${marker.id}`,
          center,
          markers: clusterMarkers,
          radius: zoomConfig.radiusMeters,
          isDestinationCluster: false,
          clusterLevel
        });

        // Mark all clustered markers as processed
        clusterMarkers.forEach(m => processed.add(m.id));
        console.log(`📍 Created ${clusterLevel} cluster with ${clusterMarkers.length} markers near ${marker.name}`);
      } else {
        // Not enough nearby markers, keep as individual
        unclustered.push(marker);
        processed.add(marker.id);
      }
    }

    console.log(`✅ Aggressive clustering complete: ${clusters.length} ${clusterLevel} clusters, ${unclustered.length} individual markers`);
    return { clusters, unclustered };
  }

  private static getClusterLevel(zoom: number): keyof ZoomBasedClusteringConfig {
    if (zoom <= 5) return 'ultra';
    if (zoom <= 6.5) return 'large';
    if (zoom <= 8) return 'medium';
    return 'small';
  }

  private static expandBounds(bounds: google.maps.LatLngBounds, zoom: number): google.maps.LatLngBounds {
    // More generous expansion at lower zoom levels for better clustering
    const expansionFactor = Math.max(0.2, (10 - zoom) * 0.3);
    
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    
    const latSpan = ne.lat() - sw.lat();
    const lngSpan = ne.lng() - sw.lng();
    
    const expandedNE = new google.maps.LatLng(
      ne.lat() + (latSpan * expansionFactor),
      ne.lng() + (lngSpan * expansionFactor)
    );
    
    const expandedSW = new google.maps.LatLng(
      sw.lat() - (latSpan * expansionFactor),
      sw.lng() - (lngSpan * expansionFactor)
    );
    
    return new google.maps.LatLngBounds(expandedSW, expandedNE);
  }

  static shouldShowIndividualMarkers(currentZoom: number): boolean {
    // Show individual markers only at higher zoom levels
    return currentZoom >= 9.5;
  }

  static getIconSizeMultiplier(clusterLevel: keyof ZoomBasedClusteringConfig): number {
    return this.ZOOM_CONFIGS[clusterLevel].iconSizeMultiplier;
  }
}
