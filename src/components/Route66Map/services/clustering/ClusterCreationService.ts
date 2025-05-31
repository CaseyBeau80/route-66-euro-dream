import type { Route66Waypoint } from '../../types/supabaseTypes';
import { DestinationCityProtectionService } from '../DestinationCityProtectionService';
import { DistanceCalculator } from './DistanceCalculator';
import type { ClusterGroup, ClusteringConfig, ZoomBasedClusteringConfig } from './types';

export class ClusterCreationService {
  private static readonly DEFAULT_CONFIG: ClusteringConfig = {
    minClusterSize: 3,
    clusterRadiusMeters: 50000, // 50km
    destinationExclusionRadius: 75000 // 75km around destinations
  };

  private static readonly ZOOM_CONFIGS: ZoomBasedClusteringConfig = {
    ultra: {
      minClusterSize: 2,
      radiusMeters: 200000, // 200km - very aggressive clustering
      iconSizeMultiplier: 1.8
    },
    large: {
      minClusterSize: 3,
      radiusMeters: 100000, // 100km - large clustering
      iconSizeMultiplier: 1.5
    },
    medium: {
      minClusterSize: 3,
      radiusMeters: 50000, // 50km - medium clustering
      iconSizeMultiplier: 1.2
    },
    small: {
      minClusterSize: 4,
      radiusMeters: 25000, // 25km - tight clustering
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
    
    console.log(`🎯 Creating enhanced zoom-responsive clusters for ${markers.length} markers at zoom ${currentZoom}`);
    
    // Determine clustering level based on zoom
    const clusterLevel = this.getClusterLevel(currentZoom);
    const zoomConfig = this.ZOOM_CONFIGS[clusterLevel];
    
    console.log(`📊 Using ${clusterLevel} clustering config:`, zoomConfig);
    
    // Always exclude destination cities from clustering
    const destinationCities = DestinationCityProtectionService.validateDestinationCities(markers);
    const nonDestinationMarkers = markers.filter(m => !destinationCities.some(d => d.id === m.id));
    
    console.log(`🛡️ Protected ${destinationCities.length} destination cities from clustering`);
    console.log(`🎯 Processing ${nonDestinationMarkers.length} non-destination markers for clustering`);

    // Filter markers that are visible in current bounds with expanded view
    const expandedBounds = this.expandBounds(mapBounds, currentZoom);
    const visibleMarkers = nonDestinationMarkers.filter(marker => {
      const position = new google.maps.LatLng(marker.latitude, marker.longitude);
      return expandedBounds.contains(position);
    });

    console.log(`👁️ ${visibleMarkers.length} markers visible in expanded bounds`);

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

    console.log(`✅ Enhanced zoom-responsive clustering complete: ${clusters.length} ${clusterLevel} clusters, ${unclustered.length} individual markers`);
    return { clusters, unclustered };
  }

  private static getClusterLevel(zoom: number): keyof ZoomBasedClusteringConfig {
    if (zoom <= 4) return 'ultra';
    if (zoom <= 5.5) return 'large';
    if (zoom <= 7) return 'medium';
    return 'small';
  }

  private static expandBounds(bounds: google.maps.LatLngBounds, zoom: number): google.maps.LatLngBounds {
    // Expand bounds based on zoom level to catch nearby clusters
    const expansionFactor = Math.max(0.1, (10 - zoom) * 0.2);
    
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
    // Show individual markers at higher zoom levels
    return currentZoom >= 8.5;
  }

  static getIconSizeMultiplier(clusterLevel: keyof ZoomBasedClusteringConfig): number {
    return this.ZOOM_CONFIGS[clusterLevel].iconSizeMultiplier;
  }
}
