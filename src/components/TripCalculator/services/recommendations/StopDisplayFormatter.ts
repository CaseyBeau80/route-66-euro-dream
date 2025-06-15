
// Stub implementation - recommendation system removed
export class StopDisplayFormatter {
  static formatStopForDisplay(stop: any) {
    return {
      name: stop.name || 'Unknown Stop',
      location: 'Location unavailable',
      category: 'General',
      icon: '📍'
    };
  }
}
