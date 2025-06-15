
// Stub implementation - recommendation system removed
export class StopGeographyFilter {
  static filterByGeography(stops: any[], params: any): any[] {
    console.log('🚫 StopGeographyFilter: Geography filtering disabled');
    return [];
  }

  static filterByDistance(stops: any[], maxDistance: number): any[] {
    console.log('🚫 StopGeographyFilter: Distance filtering disabled');
    return [];
  }

  static filterByRegion(stops: any[], region: string): any[] {
    console.log('🚫 StopGeographyFilter: Region filtering disabled');
    return [];
  }
}
