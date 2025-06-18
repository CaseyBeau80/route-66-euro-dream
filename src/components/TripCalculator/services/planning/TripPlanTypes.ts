
// UNIFIED TYPE DEFINITIONS
// This file now re-exports all types from TripPlanBuilder.ts to ensure consistency
// across the entire codebase and prevent type conflicts.

export {
  type DriveTimeCategory,
  type RecommendedStop,
  type SegmentTiming,
  type WeatherData,
  type DriveTimeBalance,
  type RouteProgression,
  type TripPlan,
  type DailySegment,
  TripPlanDataValidator,
  getDestinationCityName
} from './TripPlanBuilder';

// Legacy exports for backward compatibility
export type { DriveTimeTarget } from './TripPlanBuilder';

