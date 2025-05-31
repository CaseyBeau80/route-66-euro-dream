
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
    const clusters: MarkerCluster[] = [];
    const processed = new Set<string>();

    for (const marker of markers) {
      if (processed.has(marker.id)) continue;

      const cluster: MarkerCluster = {
        id: `cluster-${marker.id}`,
        centerLat: marker.latitude,
        centerLng: marker.longitude,
        markers: [marker],
        isExpanded: false
      };

      processed.add(marker.id);

      // Find nearby markers
      for (const otherMarker of markers) {
        if (processed.has(otherMarker.id)) continue;

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
      }

      clusters.push(cluster);
    }

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
