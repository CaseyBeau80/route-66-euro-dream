
import { TripStop } from '../data/SupabaseDataService';
import { CuratedStopSelection, StopCurationConfig, TargetNumbers } from './StopCurationConfig';
import { CategorizedStops } from './StopCategorizer';
import { StopScorer } from './StopScorer';

export class StopSelectionService {
  /**
   * Select the best stops from each category using scoring
   */
  static selectBestStopsFromCategories(
    categorizedStops: CategorizedStops,
    targetNumbers: TargetNumbers,
    startStop: TripStop,
    endStop: TripStop,
    config: StopCurationConfig
  ): CuratedStopSelection {
    // Score and select attractions
    const selectedAttractions = StopScorer.selectTopScoredStops(
      categorizedStops.attractions,
      targetNumbers.attractions,
      startStop,
      config
    );

    // Score and select waypoints (include destination cities here)
    const allWaypoints = [...categorizedStops.waypoints, ...categorizedStops.destinationCities];
    const selectedWaypoints = StopScorer.selectTopScoredStops(
      allWaypoints,
      targetNumbers.waypoints,
      startStop,
      config
    );

    // Score and select hidden gems
    const selectedHiddenGems = StopScorer.selectTopScoredStops(
      categorizedStops.hiddenGems,
      targetNumbers.hiddenGems,
      startStop,
      config
    );

    return {
      attractions: selectedAttractions,
      waypoints: selectedWaypoints,
      hiddenGems: selectedHiddenGems,
      totalSelected: selectedAttractions.length + selectedWaypoints.length + selectedHiddenGems.length
    };
  }
}
