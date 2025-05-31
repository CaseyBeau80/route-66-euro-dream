import type { Route66Waypoint } from '../types/supabaseTypes';
import { DestinationCityProtectionService } from './DestinationCityProtectionService';

interface ClusterGroup {
  id: string;
  center: { lat: number; lng: number };
  markers: Route66Waypoint[];
  radius: number;
  isDestinationCluster: boolean;
}

export class EnhancedClusteringManager {
  private static readonly MIN_CLUSTER_SIZE = 3;
  private static readonly CLUSTER_RADIUS_METERS = 50000; // 50km
  private static readonly DESTINATION_EXCLUSION_RADIUS = 75000; // 75km around destinations

  static createClusters(
    markers: Route66Waypoint[], 
    currentZoom: number,
    mapBounds: google.maps.LatLngBounds
  ): { clusters: ClusterGroup[], unclustered: Route66Waypoint[] } {
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
        const distance = this.calculateDistance(
          marker.latitude, marker.longitude,
          dest.latitude, dest.longitude
        );
        return distance < this.DESTINATION_EXCLUSION_RADIUS;
      });

      if (tooCloseToDestination) {
        unclustered.push(marker);
        processed.add(marker.id);
        continue;
      }

      // Find nearby markers for clustering
      const nearbyMarkers = visibleMarkers.filter(other => {
        if (processed.has(other.id) || other.id === marker.id) return false;
        
        const distance = this.calculateDistance(
          marker.latitude, marker.longitude,
          other.latitude, other.longitude
        );
        return distance < this.CLUSTER_RADIUS_METERS;
      });

      if (nearbyMarkers.length + 1 >= this.MIN_CLUSTER_SIZE) {
        // Create a cluster
        const clusterMarkers = [marker, ...nearbyMarkers];
        const center = this.calculateClusterCenter(clusterMarkers);
        
        clusters.push({
          id: `cluster-${marker.id}`,
          center,
          markers: clusterMarkers,
          radius: this.CLUSTER_RADIUS_METERS,
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

  private static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private static calculateClusterCenter(markers: Route66Waypoint[]): { lat: number; lng: number } {
    const totalLat = markers.reduce((sum, marker) => sum + marker.latitude, 0);
    const totalLng = markers.reduce((sum, marker) => sum + marker.longitude, 0);
    return {
      lat: totalLat / markers.length,
      lng: totalLng / markers.length
    };
  }

  static shouldShowIndividualMarkers(currentZoom: number): boolean {
    // Show individual markers at higher zoom levels
    return currentZoom >= 8;
  }

  static getClusterIcon(markerCount: number): google.maps.Icon {
    const size = Math.min(60, Math.max(30, markerCount * 2 + 20));
    const color = markerCount > 10 ? '#DC2626' : markerCount > 5 ? '#F59E0B' : '#10B981';
    
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="${color}" stroke="#fff" stroke-width="3"/>
          <text x="${size/2}" y="${size/2 + 5}" text-anchor="middle" fill="white" font-family="Arial" font-size="${Math.max(10, size/4)}" font-weight="bold">${markerCount}</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(size/2, size/2)
    };
  }
}
