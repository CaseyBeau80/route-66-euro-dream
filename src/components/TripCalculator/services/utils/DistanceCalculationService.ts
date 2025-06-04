
export class DistanceCalculationService {
  /**
   * Calculate distance between two points using Haversine formula
   * @param lat1 Latitude of first point
   * @param lon1 Longitude of first point
   * @param lat2 Latitude of second point
   * @param lon2 Longitude of second point
   * @returns Distance in miles
   */
  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Find the closest stop to given coordinates
   */
  static findClosestStop(latitude: number, longitude: number, stops: any[]): any | null {
    if (stops.length === 0) return null;

    let closestStop = stops[0];
    let minDistance = this.calculateDistance(latitude, longitude, stops[0].latitude, stops[0].longitude);

    for (const stop of stops) {
      const distance = this.calculateDistance(latitude, longitude, stop.latitude, stop.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        closestStop = stop;
      }
    }

    return closestStop;
  }
}
