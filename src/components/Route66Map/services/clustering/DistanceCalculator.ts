
export class DistanceCalculator {
  private static readonly EARTH_RADIUS_METERS = 6371000;

  static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return this.EARTH_RADIUS_METERS * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  static calculateClusterCenter(markers: any[]): { lat: number; lng: number } {
    const totalLat = markers.reduce((sum, marker) => sum + marker.latitude, 0);
    const totalLng = markers.reduce((sum, marker) => sum + marker.longitude, 0);
    return {
      lat: totalLat / markers.length,
      lng: totalLng / markers.length
    };
  }
}
