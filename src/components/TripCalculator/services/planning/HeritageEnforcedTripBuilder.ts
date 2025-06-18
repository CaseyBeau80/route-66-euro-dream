
import { TripStyleConfig } from './TripStyleLogic';

export interface StyleConfig {
  maxDriveTimeHours: number;
  preferredDriveTimeHours: number;
  allowExtendedDays: boolean;
}

export class HeritageEnforcedTripBuilder {
  static buildTrip(stops: any[], config: TripStyleConfig): any {
    // Convert TripStyleConfig to StyleConfig
    const styleConfig: StyleConfig = {
      maxDriveTimeHours: config.maxDailyDriveHours,
      preferredDriveTimeHours: config.preferredDriveTime,
      allowExtendedDays: config.flexibility > 0.5
    };

    console.log('🏛️ HeritageEnforcedTripBuilder: buildTrip stub');
    return { tripPlan: null, warnings: [] };
  }
}
