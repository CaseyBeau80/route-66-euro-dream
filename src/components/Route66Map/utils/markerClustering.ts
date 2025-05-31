
interface ClusterableMarker {
  id: string;
  latitude: number;
  longitude: number;
  type: 'gem' | 'attraction' | 'destination';
  data: any;
}

interface MarkerCluster {
  id: string;
  centerLat: number;
  centerLng: number;
  markers: ClusterableMarker[];
  isExpanded: boolean;
}

export class MarkerClusteringService {
  private static readonly CLUSTER_DISTANCE_KM = 5; // 5km clustering distance

  static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRad(value: number): number {
    return value * Math.PI / 180;
  }

  static clusterMarkers(markers: ClusterableMarker[]): MarkerCluster[] {
    if (!markers || markers.length === 0) {
      console.log('⚠️ MarkerClusteringService: No markers to cluster');
      return [];
    }

    console.log(`🔧 MarkerClusteringService: Clustering ${markers.length} markers`);
    
    const clusters: MarkerCluster[] = [];
    const processed = new Set<string>();

    // Sort markers by type priority (destinations first, then attractions, then gems)
    const sortedMarkers = [...markers].sort((a, b) => {
      const typePriority = { destination: 0, attraction: 1, gem: 2 };
      return typePriority[a.type] - typePriority[b.type];
    });

    for (const marker of sortedMarkers) {
      if (processed.has(marker.id)) continue;

      // Validate marker data
      if (!marker.latitude || !marker.longitude || isNaN(marker.latitude) || isNaN(marker.longitude)) {
        console.warn(`⚠️ Invalid marker data:`, marker);
        continue;
      }

      const cluster: MarkerCluster = {
        id: `cluster-${marker.id}`,
        centerLat: marker.latitude,
        centerLng: marker.longitude,
        markers: [marker],
        isExpanded: false
      };

      processed.add(marker.id);

      // Find nearby markers
      for (const otherMarker of sortedMarkers) {
        if (processed.has(otherMarker.id)) continue;
        
        // Validate other marker data
        if (!otherMarker.latitude || !otherMarker.longitude || isNaN(otherMarker.latitude) || isNaN(otherMarker.longitude)) {
          continue;
        }

        const distance = this.calculateDistance(
          marker.latitude, marker.longitude,
          otherMarker.latitude, otherMarker.longitude
        );

        if (distance <= this.CLUSTER_DISTANCE_KM) {
          cluster.markers.push(otherMarker);
          processed.add(otherMarker.id);
        }
      }

      // Calculate center point if multiple markers
      if (cluster.markers.length > 1) {
        const avgLat = cluster.markers.reduce((sum, m) => sum + m.latitude, 0) / cluster.markers.length;
        const avgLng = cluster.markers.reduce((sum, m) => sum + m.longitude, 0) / cluster.markers.length;
        cluster.centerLat = avgLat;
        cluster.centerLng = avgLng;
        
        console.log(`🔗 Created cluster with ${cluster.markers.length} markers at ${avgLat.toFixed(4)}, ${avgLng.toFixed(4)}`);
      }

      clusters.push(cluster);
    }

    console.log(`✅ MarkerClusteringService: Created ${clusters.length} clusters`);
    return clusters;
  }

  static expandCluster(cluster: MarkerCluster, radiusKm: number = 0.5): ClusterableMarker[] {
    if (cluster.markers.length <= 1) return cluster.markers;

    const expandedMarkers: ClusterableMarker[] = [];
    const angleStep = (2 * Math.PI) / cluster.markers.length;

    cluster.markers.forEach((marker, index) => {
      const angle = index * angleStep;
      const offsetLat = (radiusKm / 111) * Math.cos(angle); // Rough conversion
      const offsetLng = (radiusKm / (111 * Math.cos(cluster.centerLat * Math.PI / 180))) * Math.sin(angle);

      expandedMarkers.push({
        ...marker,
        latitude: cluster.centerLat + offsetLat,
        longitude: cluster.centerLng + offsetLng
      });
    });

    return expandedMarkers;
  }
}
