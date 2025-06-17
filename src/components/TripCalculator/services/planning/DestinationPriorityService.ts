
import { TripStop } from '../data/SupabaseDataService';
import { DriveTimeTarget } from './DriveTimeConstraints';
import { DestinationScoring } from './DestinationScoring';
import { DestinationCityValidator } from './DestinationCityValidator';
import { PopulationScoringService } from './PopulationScoringService';

export class DestinationPriorityService {
  /**
   * Select destination with population-enhanced validated destination city priority
   */
  static selectDestinationWithPriority(
    currentStop: TripStop,
    availableStops: TripStop[],
    driveTimeTarget: DriveTimeTarget,
    tripStyle: 'balanced' | 'destination-focused' = 'balanced'
  ): TripStop | null {
    console.log(`🏛️ Population-enhanced destination priority selection (${tripStyle} style)`);

    // Apply population filtering based on trip style
    const populationFilteredStops = PopulationScoringService.filterByPopulationThreshold(
      availableStops,
      tripStyle,
      false // Not strict for this selection
    );

    console.log(`📊 Population pre-filter: ${availableStops.length} → ${populationFilteredStops.length} stops`);

    // First, try to find validated destination cities within population-filtered stops
    const rawDestinationCities = populationFilteredStops.filter(stop => 
      stop.category === 'destination_city'
    );
    
    const validatedDestinationCities = DestinationCityValidator.filterValidDestinationCities(rawDestinationCities);

    console.log(`🏙️ Found ${validatedDestinationCities.length} validated destination cities with adequate population (from ${rawDestinationCities.length} total)`);

    if (validatedDestinationCities.length > 0) {
      const cityDestination = this.selectBestPopulationAwareDestination(
        currentStop,
        validatedDestinationCities,
        driveTimeTarget,
        tripStyle
      );
      
      if (cityDestination) {
        const popScore = PopulationScoringService.calculatePopulationScore(cityDestination);
        console.log(`✅ Selected validated destination city with population: ${cityDestination.name} (pop: ${popScore.rawPopulation.toLocaleString()}, tier: ${popScore.tier})`);
        return cityDestination;
      }
    }

    // If no validated destination cities fit, try major waypoints within population filter
    const majorWaypoints = populationFilteredStops.filter(stop => 
      stop.category === 'route66_waypoint' && stop.is_major_stop
    );

    console.log(`🛤️ Found ${majorWaypoints.length} major waypoints with adequate population to evaluate`);

    if (majorWaypoints.length > 0) {
      const waypointDestination = this.selectBestPopulationAwareDestination(
        currentStop,
        majorWaypoints,
        driveTimeTarget,
        tripStyle
      );
      
      if (waypointDestination) {
        const popScore = PopulationScoringService.calculatePopulationScore(waypointDestination);
        console.log(`✅ Selected population-aware major waypoint: ${waypointDestination.name} (pop: ${(popScore.rawPopulation || 0).toLocaleString()}, tier: ${popScore.tier})`);
        return waypointDestination;
      }
    }

    // Fallback: try all population-filtered stops
    console.log(`🔄 Falling back to all population-filtered stops for drive time selection`);
    return this.selectBestPopulationAwareDestination(
      currentStop,
      populationFilteredStops,
      driveTimeTarget,
      tripStyle
    );
  }

  /**
   * Select best destination with population-aware scoring
   */
  private static selectBestPopulationAwareDestination(
    currentStop: TripStop,
    candidateStops: TripStop[],
    driveTimeTarget: DriveTimeTarget,
    tripStyle: 'balanced' | 'destination-focused'
  ): TripStop | null {
    if (candidateStops.length === 0) return null;

    // Get population weight for trip style
    const populationWeight = tripStyle === 'destination-focused' ? 0.4 : 0.3;

    // Enhance each candidate with population scoring
    const enhancedCandidates = candidateStops.map(stop => {
      const popScore = PopulationScoringService.calculatePopulationScore(stop);
      const driveTimeScore = this.calculateDriveTimeScore(currentStop, stop, driveTimeTarget);
      
      // Combine drive time and population scores
      const combinedScore = PopulationScoringService.calculateWeightedScore(
        stop,
        driveTimeScore,
        populationWeight
      );

      return {
        stop,
        driveTimeScore,
        popScore,
        combinedScore
      };
    });

    // Sort by combined score (highest first)
    enhancedCandidates.sort((a, b) => b.combinedScore - a.combinedScore);

    // Log top candidates for debugging
    console.log(`🎯 Top population-enhanced candidates:`);
    enhancedCandidates.slice(0, 3).forEach((candidate, index) => {
      console.log(`   ${index + 1}. ${candidate.stop.name}: drive=${candidate.driveTimeScore.toFixed(1)}, pop-tier=${candidate.popScore.tier}, combined=${candidate.combinedScore.toFixed(1)} (pop: ${candidate.popScore.rawPopulation.toLocaleString()})`);
    });

    return enhancedCandidates[0]?.stop || null;
  }

  /**
   * Calculate drive time score for a candidate destination
   */
  private static calculateDriveTimeScore(
    currentStop: TripStop,
    candidateStop: TripStop,
    driveTimeTarget: DriveTimeTarget,
    avgSpeedMph: number = 50
  ): number {
    const distance = this.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      candidateStop.latitude, candidateStop.longitude
    );
    
    const driveTimeHours = distance / avgSpeedMph;
    
    // Skip if outside absolute constraints
    if (driveTimeHours < driveTimeTarget.minHours || driveTimeHours > driveTimeTarget.maxHours) {
      return 0; // Invalid drive time
    }

    // Calculate score based on proximity to target (100 = perfect match)
    const timeDiff = Math.abs(driveTimeHours - driveTimeTarget.targetHours);
    const maxDiff = Math.max(
      driveTimeTarget.targetHours - driveTimeTarget.minHours,
      driveTimeTarget.maxHours - driveTimeTarget.targetHours
    );
    
    const proximityScore = Math.max(0, 100 - (timeDiff / maxDiff) * 100);

    // Bonus for being in optimal range
    if (driveTimeHours >= 3 && driveTimeHours <= 6) { // Optimal driving range
      return proximityScore + 10;
    }

    return proximityScore;
  }

  /**
   * Calculate distance between two points (haversine formula)
   */
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3958.8; // Earth's radius in miles
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Get population-enhanced priority summary for debugging
   */
  static getPopulationPrioritySummary(
    selectedDestinations: TripStop[],
    tripStyle: 'balanced' | 'destination-focused'
  ): string {
    if (selectedDestinations.length === 0) {
      return 'No destinations selected';
    }

    const popStats = PopulationScoringService.getPopulationStatistics(selectedDestinations);
    const avgPop = Math.round(popStats.average);
    
    return `Selected ${selectedDestinations.length} destinations with ${tripStyle} style (avg population: ${avgPop.toLocaleString()}, range: ${popStats.range.min.toLocaleString()}-${popStats.range.max.toLocaleString()})`;
  }
}
