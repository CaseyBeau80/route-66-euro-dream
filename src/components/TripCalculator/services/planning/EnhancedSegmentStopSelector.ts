
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StopCurationConfig, CuratedStopSelection, DEFAULT_CURATION_CONFIG } from './StopCurationConfig';
import { RouteCandidateFilter } from './RouteCandidateFilter';
import { StopCategorizer } from './StopCategorizer';
import { TargetNumberCalculator } from './TargetNumberCalculator';
import { StopSelectionService } from './StopSelectionService';

export class EnhancedSegmentStopSelector {
  /**
   * Select curated stops for a segment with intelligent categorization
   */
  static selectCuratedStopsForSegment(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    expectedDriveTime: number,
    config: Partial<StopCurationConfig> = {}
  ): CuratedStopSelection {
    const finalConfig = { ...DEFAULT_CURATION_CONFIG, ...config };
    
    console.log(`🎯 Curating stops for segment: ${startStop.name} → ${endStop.name} (${finalConfig.maxStops} max stops)`);
    
    // Calculate segment distance and filter relevant stops
    const segmentDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Get candidates along the route
    const routeCandidates = RouteCandidateFilter.getRouteCandidates(
      startStop, 
      endStop, 
      availableStops, 
      segmentDistance
    );
    
    // Categorize stops by type
    const categorizedStops = StopCategorizer.categorizeStops(routeCandidates);
    
    // Calculate target numbers for each category
    const targetNumbers = TargetNumberCalculator.calculateTargetNumbers(finalConfig, expectedDriveTime);
    
    // Select best stops from each category
    const selectedStops = StopSelectionService.selectBestStopsFromCategories(
      categorizedStops,
      targetNumbers,
      startStop,
      endStop,
      finalConfig
    );

    console.log(`✅ Selected ${selectedStops.totalSelected} curated stops: ${selectedStops.attractions.length} attractions, ${selectedStops.waypoints.length} waypoints, ${selectedStops.hiddenGems.length} hidden gems`);
    
    return selectedStops;
  }

  /**
   * Combine all selected stops into a single array for backward compatibility
   */
  static combineSelectedStops(selection: CuratedStopSelection): TripStop[] {
    return [
      ...selection.attractions,
      ...selection.waypoints,
      ...selection.hiddenGems
    ];
  }
}

// Re-export types for backward compatibility
export type { StopCurationConfig, CuratedStopSelection };
