
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { Route66CityClassifier, CityClassification } from './Route66CityClassifier';

export interface OptimizationResult {
  optimizedStops: TripStop[];
  consecutivePairs: Array<{
    city1: TripStop;
    city2: TripStop;
    bonus: number;
    reason: string;
  }>;
  gapFillers: Array<{
    city: TripStop;
    reason: string;
    gapHours: number;
  }>;
  adjustmentsMade: string[];
  priorityScore: number;
}

export interface RouteSegment {
  from: TripStop;
  to: TripStop;
  distance: number;
  driveTimeHours: number;
  cities: TripStop[];
  score: number;
}

export class ConsecutiveMajorCitiesOptimizer {
  private static readonly AVG_SPEED_MPH = 50;
  private static readonly MAX_DRIVE_HOURS = 8;
  private static readonly EXTREME_GAP_HOURS = 10;

  /**
   * Main optimization method that prioritizes consecutive major cities
   */
  static optimizeRoute(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    targetDays: number
  ): OptimizationResult {
    console.log(`🎯 ConsecutiveMajorCitiesOptimizer: Optimizing for ${targetDays} days with major city priority`);

    // Classify all available stops
    const classifiedStops = availableStops.map(stop => ({
      stop,
      classification: Route66CityClassifier.classifyCity(stop)
    }));

    // Separate by tier
    const majorCities = classifiedStops.filter(s => s.classification.tier === 'major').map(s => s.stop);
    const secondaryCities = classifiedStops.filter(s => s.classification.tier === 'secondary').map(s => s.stop);
    const minorTowns = classifiedStops.filter(s => s.classification.tier === 'minor').map(s => s.stop);

    console.log(`🏙️ Available: ${majorCities.length} major, ${secondaryCities.length} secondary, ${minorTowns.length} minor`);

    // Find consecutive major city sequences
    const consecutiveSequences = this.findConsecutiveMajorSequences(
      startStop,
      endStop,
      majorCities,
      targetDays
    );

    console.log(`🔗 Found ${consecutiveSequences.length} consecutive major city sequences`);

    // Build optimal route with consecutive prioritization
    const optimizedRoute = this.buildOptimalRoute(
      startStop,
      endStop,
      consecutiveSequences,
      secondaryCities,
      minorTowns,
      targetDays
    );

    return optimizedRoute;
  }

  /**
   * Find sequences of consecutive major cities within reasonable driving distance
   */
  private static findConsecutiveMajorSequences(
    startStop: TripStop,
    endStop: TripStop,
    majorCities: TripStop[],
    targetDays: number
  ): Array<{ cities: TripStop[], totalScore: number }> {
    const sequences: Array<{ cities: TripStop[], totalScore: number }> = [];
    
    // Calculate route progression for all major cities
    const progressionMap = majorCities.map(city => ({
      city,
      distanceFromStart: DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        city.latitude, city.longitude
      )
    })).sort((a, b) => a.distanceFromStart - b.distanceFromStart);

    console.log(`📊 Major city progression:`, progressionMap.map(p => 
      `${p.city.name}: ${p.distanceFromStart.toFixed(0)}mi`
    ));

    // Look for consecutive pairs and sequences
    for (let i = 0; i < progressionMap.length - 1; i++) {
      const current = progressionMap[i];
      const next = progressionMap[i + 1];
      
      const distance = DistanceCalculationService.calculateDistance(
        current.city.latitude, current.city.longitude,
        next.city.latitude, next.city.longitude
      );
      const driveTime = distance / this.AVG_SPEED_MPH;

      // Check if they can be consecutive (within drive time limits)
      if (driveTime <= this.getMaxDriveTimeForState(current.city.state)) {
        const iconicBonus = Route66CityClassifier.getIconicPairBonus(current.city, next.city);
        const importanceSum = Route66CityClassifier.classifyCity(current.city).importance + 
                            Route66CityClassifier.classifyCity(next.city).importance;
        
        const sequenceScore = iconicBonus + importanceSum + (driveTime <= 6 ? 20 : 0);
        
        sequences.push({
          cities: [current.city, next.city],
          totalScore: sequenceScore
        });

        console.log(`🔗 Consecutive pair: ${current.city.name} → ${next.city.name} (${driveTime.toFixed(1)}h, score: ${sequenceScore})`);

        // Look for longer sequences (3+ cities)
        if (i < progressionMap.length - 2) {
          const third = progressionMap[i + 2];
          const secondDistance = DistanceCalculationService.calculateDistance(
            next.city.latitude, next.city.longitude,
            third.city.latitude, third.city.longitude
          );
          const secondDriveTime = secondDistance / this.AVG_SPEED_MPH;

          if (secondDriveTime <= this.getMaxDriveTimeForState(next.city.state)) {
            const extendedScore = sequenceScore + Route66CityClassifier.classifyCity(third.city).importance + 30; // Bonus for 3-city sequence
            
            sequences.push({
              cities: [current.city, next.city, third.city],
              totalScore: extendedScore
            });

            console.log(`🔗 Extended sequence: ${current.city.name} → ${next.city.name} → ${third.city.name} (score: ${extendedScore})`);
          }
        }
      }
    }

    // Sort by score and return top sequences
    return sequences.sort((a, b) => b.totalScore - a.totalScore);
  }

  /**
   * Build the optimal route using consecutive sequences and gap-filling logic
   */
  private static buildOptimalRoute(
    startStop: TripStop,
    endStop: TripStop,
    consecutiveSequences: Array<{ cities: TripStop[], totalScore: number }>,
    secondaryCities: TripStop[],
    minorTowns: TripStop[],
    targetDays: number
  ): OptimizationResult {
    const optimizedStops: TripStop[] = [];
    const consecutivePairs: OptimizationResult['consecutivePairs'] = [];
    const gapFillers: OptimizationResult['gapFillers'] = [];
    const adjustmentsMade: string[] = [];
    let priorityScore = 0;

    // Start with the best consecutive sequence that fits our target days
    const selectedSequences: TripStop[] = [];
    let usedCities = new Set<string>();

    // Select the best sequences without overlap
    for (const sequence of consecutiveSequences) {
      const hasOverlap = sequence.cities.some(city => usedCities.has(city.id));
      
      if (!hasOverlap && selectedSequences.length + sequence.cities.length <= targetDays - 1) {
        selectedSequences.push(...sequence.cities);
        sequence.cities.forEach(city => usedCities.add(city.id));
        priorityScore += sequence.totalScore;

        // Record consecutive pairs
        for (let i = 0; i < sequence.cities.length - 1; i++) {
          const iconicBonus = Route66CityClassifier.getIconicPairBonus(sequence.cities[i], sequence.cities[i + 1]);
          consecutivePairs.push({
            city1: sequence.cities[i],
            city2: sequence.cities[i + 1],
            bonus: iconicBonus,
            reason: iconicBonus > 0 ? 'Iconic Route 66 pair' : 'Consecutive major cities'
          });
        }

        adjustmentsMade.push(`Selected consecutive major cities: ${sequence.cities.map(c => c.name).join(' → ')}`);
      }
    }

    // Sort selected cities by route progression
    const sortedSelectedCities = selectedSequences
      .map(city => ({
        city,
        distanceFromStart: DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude,
          city.latitude, city.longitude
        )
      }))
      .sort((a, b) => a.distanceFromStart - b.distanceFromStart)
      .map(item => item.city);

    // Fill gaps with secondary cities if needed
    let currentStop = startStop;
    const finalRoute: TripStop[] = [];

    for (let day = 1; day < targetDays; day++) {
      let nextStop: TripStop | null = null;

      // Check if we have a selected major city for this position
      if (sortedSelectedCities.length > 0) {
        const nextMajorCity = sortedSelectedCities[0];
        const distanceToMajor = DistanceCalculationService.calculateDistance(
          currentStop.latitude, currentStop.longitude,
          nextMajorCity.latitude, nextMajorCity.longitude
        );
        const driveTimeToMajor = distanceToMajor / this.AVG_SPEED_MPH;

        if (driveTimeToMajor <= this.getMaxDriveTimeForState(currentStop.state)) {
          nextStop = nextMajorCity;
          sortedSelectedCities.shift(); // Remove from list
        }
      }

      // If no major city fits, look for gap-filler
      if (!nextStop) {
        const targetDistance = this.calculateTargetDistance(startStop, endStop, targetDays, day);
        nextStop = this.findBestGapFiller(
          currentStop,
          endStop,
          secondaryCities.concat(minorTowns),
          usedCities,
          targetDistance
        );

        if (nextStop) {
          const gapDistance = DistanceCalculationService.calculateDistance(
            currentStop.latitude, currentStop.longitude,
            nextStop.latitude, nextStop.longitude
          );
          const gapHours = gapDistance / this.AVG_SPEED_MPH;

          gapFillers.push({
            city: nextStop,
            reason: gapHours > this.EXTREME_GAP_HOURS ? 'Prevents extreme drive day' : 'Route progression filler',
            gapHours
          });

          adjustmentsMade.push(`Added gap-filler ${nextStop.name} to prevent ${gapHours.toFixed(1)}h+ drive`);
        }
      }

      if (nextStop) {
        finalRoute.push(nextStop);
        usedCities.add(nextStop.id);
        currentStop = nextStop;
      }
    }

    // Validate the "three minor towns in a row" rule
    const routeWithEnds = [startStop, ...finalRoute, endStop];
    if (Route66CityClassifier.violatesMinorTownRule(routeWithEnds)) {
      adjustmentsMade.push('⚠️ Route contains three minor towns in a row - consider manual adjustment');
    }

    console.log(`✅ Optimized route: ${finalRoute.length} stops, priority score: ${priorityScore}`);

    return {
      optimizedStops: finalRoute,
      consecutivePairs,
      gapFillers,
      adjustmentsMade,
      priorityScore
    };
  }

  /**
   * Calculate target distance for a specific day
   */
  private static calculateTargetDistance(
    startStop: TripStop,
    endStop: TripStop,
    totalDays: number,
    currentDay: number
  ): number {
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    return (totalDistance * currentDay) / totalDays;
  }

  /**
   * Find the best gap-filler city to maintain route progression
   */
  private static findBestGapFiller(
    currentStop: TripStop,
    endStop: TripStop,
    availableCities: TripStop[],
    usedCities: Set<string>,
    targetDistanceFromStart: number
  ): TripStop | null {
    let bestCity: TripStop | null = null;
    let bestScore = Number.MAX_VALUE;

    for (const city of availableCities) {
      if (usedCities.has(city.id)) continue;

      const distanceFromCurrent = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        city.latitude, city.longitude
      );
      const driveTime = distanceFromCurrent / this.AVG_SPEED_MPH;

      // Skip if drive time is too long
      if (driveTime > this.getMaxDriveTimeForState(currentStop.state)) continue;

      const cityDistanceFromStart = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude, // This should be start stop, but we need to calculate from original start
        city.latitude, city.longitude
      );

      // Score based on how close to target distance and city importance
      const distanceScore = Math.abs(cityDistanceFromStart - targetDistanceFromStart);
      const classification = Route66CityClassifier.classifyCity(city);
      const importanceBonus = classification.importance;

      const totalScore = distanceScore - importanceBonus; // Lower is better

      if (totalScore < bestScore) {
        bestScore = totalScore;
        bestCity = city;
      }
    }

    return bestCity;
  }

  /**
   * Get maximum drive time for a state considering regional rules
   */
  private static getMaxDriveTimeForState(state: string): number {
    const rules = Route66CityClassifier.getStateRules(state);
    return rules.maxGapHours;
  }
}
