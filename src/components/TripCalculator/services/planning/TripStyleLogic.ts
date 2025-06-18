
export interface TripStyleConfig {
  style: 'balanced' | 'destination-focused';
  maxDailyDriveHours: number;
  minDailyDriveHours: number;
  preferredDriveTime: number;
  flexibility: number;
}

export interface StyleMetrics {
  efficiency: number;
  comfort: number;
  exploration: number;
  overall: number;
}

export class TripStyleLogic {
  static getStyleConfig(tripStyle: 'balanced' | 'destination-focused'): TripStyleConfig {
    if (tripStyle === 'destination-focused') {
      return {
        style: 'destination-focused',
        maxDailyDriveHours: 10,
        minDailyDriveHours: 3,
        preferredDriveTime: 8,
        flexibility: 0.8
      };
    }
    
    // Default to balanced
    return {
      style: 'balanced',
      maxDailyDriveHours: 7,
      minDailyDriveHours: 3,
      preferredDriveTime: 5,
      flexibility: 0.6
    };
  }

  static configureTripStyle(tripStyle: 'balanced' | 'destination-focused'): TripStyleConfig {
    return this.getStyleConfig(tripStyle);
  }

  static calculateStyleMetrics(
    tripStyle: 'balanced' | 'destination-focused',
    segments: any[]
  ): StyleMetrics {
    // Calculate style-specific metrics
    const efficiency = this.calculateEfficiency(segments);
    const comfort = this.calculateComfort(segments, tripStyle);
    const exploration = this.calculateExploration(segments);
    const overall = (efficiency + comfort + exploration) / 3;

    return {
      efficiency,
      comfort,
      exploration,
      overall
    };
  }

  private static calculateEfficiency(segments: any[]): number {
    if (segments.length === 0) return 0;
    
    // Simple efficiency calculation based on drive time consistency
    const driveTimes = segments.map(s => s.driveTimeHours || 0);
    const avgTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    const variance = driveTimes.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / driveTimes.length;
    
    return Math.max(0, 1 - (variance / 10)); // Normalize variance to 0-1 scale
  }

  private static calculateComfort(segments: any[], tripStyle: string): number {
    if (segments.length === 0) return 0;
    
    const maxDriveTime = Math.max(...segments.map(s => s.driveTimeHours || 0));
    const comfortThreshold = tripStyle === 'balanced' ? 7 : 10;
    
    return maxDriveTime <= comfortThreshold ? 1 : Math.max(0, 1 - (maxDriveTime - comfortThreshold) / 5);
  }

  private static calculateExploration(segments: any[]): number {
    if (segments.length === 0) return 0;
    
    const segmentsWithAttractions = segments.filter(s => s.attractions && s.attractions.length > 0);
    return segmentsWithAttractions.length / segments.length;
  }
}
