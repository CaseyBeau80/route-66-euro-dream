
import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStop } from '../../types/TripStop';
import { TripBoundaryService } from './TripBoundaryService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class HeritageCitiesPlanningService {
  /**
   * Plan a Heritage Cities focused trip with enhanced stop matching
   */
  static async planHeritageCitiesTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    allStops: TripStop[]
  ): Promise<TripPlan> {
    console.log(`🏛️ HeritageCitiesPlanningService: Planning trip from "${startLocation}" to "${endLocation}" in ${travelDays} days`);
    console.log(`📊 HeritageCitiesPlanningService: Available stops: ${allStops.length}`);
    
    // Log all available stops for debugging
    console.log('🗂️ HeritageCitiesPlanningService: All stops:', allStops.map(s => `"${s.name}" (${s.state})`).join(', '));

    try {
      // Find boundary stops with enhanced matching
      const { startStop, endStop, routeStops } = TripBoundaryService.findBoundaryStops(
        startLocation,
        endLocation,
        allStops
      );

      console.log(`✅ HeritageCitiesPlanningService: Found boundary stops:`, {
        start: `${startStop.name} (${startStop.state})`,
        end: `${endStop.name} (${endStop.state})`,
        routeStops: routeStops.length
      });

      // Calculate total distance
      const totalDistance = DistanceCalculationService.calculateDistance(
        startStop.latitude,
        startStop.longitude,
        endStop.latitude,
        endStop.longitude
      );

      console.log(`📏 HeritageCitiesPlanningService: Total distance: ${totalDistance.toFixed(1)} miles`);

      // Filter heritage cities between start and end
      const heritageCities = this.selectHeritageCities(startStop, endStop, routeStops, travelDays);
      
      console.log(`🏛️ HeritageCitiesPlanningService: Selected ${heritageCities.length} heritage cities`);

      // Create segments with heritage focus
      const segments = this.createHeritageFocusedSegments(
        startStop,
        endStop,
        heritageCities,
        travelDays,
        totalDistance
      );

      const totalDrivingTime = segments.reduce((total, segment) => {
        return total + (segment.driveTimeHours || 0);
      }, 0);

      const tripPlan: TripPlan = {
        id: `heritage-trip-${Date.now()}`,
        startLocation,
        endLocation,
        startCity: startStop.city_name || startStop.name,
        endCity: endStop.city_name || endStop.name,
        totalDistance,
        totalMiles: totalDistance,
        totalDays: travelDays,
        totalDrivingTime,
        segments,
        stops: [startStop, ...heritageCities, endStop],
        dailySegments: segments,
        startDate: new Date(),
        title: `${startLocation} to ${endLocation} Heritage Route 66 Journey`,
        tripStyle: 'destination-focused',
        lastUpdated: new Date()
      };

      console.log(`✅ HeritageCitiesPlanningService: Trip planned successfully`, {
        segments: segments.length,
        totalDistance: totalDistance.toFixed(1),
        totalDrivingTime: totalDrivingTime.toFixed(1)
      });

      return tripPlan;

    } catch (error) {
      console.error('❌ HeritageCitiesPlanningService: Error planning heritage trip:', error);
      throw new Error(`Heritage Cities planning failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Select heritage cities based on heritage value and geographic distribution
   */
  private static selectHeritageCities(
    startStop: TripStop,
    endStop: TripStop,
    routeStops: TripStop[],
    travelDays: number
  ): TripStop[] {
    console.log(`🏛️ Selecting heritage cities from ${routeStops.length} route stops`);

    // Filter for high heritage value cities first
    const highHeritage = routeStops.filter(stop => stop.heritage_value === 'high');
    const mediumHeritage = routeStops.filter(stop => stop.heritage_value === 'medium');
    
    console.log(`📊 Heritage distribution: ${highHeritage.length} high, ${mediumHeritage.length} medium`);

    // Calculate how many stops we can include based on travel days
    const maxStops = Math.max(1, travelDays - 1); // At least 1, usually days - 1
    
    let selectedCities: TripStop[] = [];

    // Prioritize high heritage cities
    if (highHeritage.length > 0) {
      selectedCities = [...highHeritage];
    }

    // Add medium heritage cities if we have room
    if (selectedCities.length < maxStops && mediumHeritage.length > 0) {
      const remainingSlots = maxStops - selectedCities.length;
      selectedCities = [...selectedCities, ...mediumHeritage.slice(0, remainingSlots)];
    }

    // If we still don't have enough, add any remaining route stops
    if (selectedCities.length < maxStops) {
      const remainingStops = routeStops.filter(stop => !selectedCities.includes(stop));
      const remainingSlots = maxStops - selectedCities.length;
      selectedCities = [...selectedCities, ...remainingStops.slice(0, remainingSlots)];
    }

    // Sort by longitude to maintain east-west progression
    selectedCities.sort((a, b) => {
      const isEastToWest = startStop.longitude < endStop.longitude;
      return isEastToWest ? a.longitude - b.longitude : b.longitude - a.longitude;
    });

    console.log(`✅ Selected heritage cities: ${selectedCities.map(c => c.name).join(', ')}`);
    
    return selectedCities;
  }

  /**
   * Create segments with heritage focus
   */
  private static createHeritageFocusedSegments(
    startStop: TripStop,
    endStop: TripStop,
    heritageCities: TripStop[],
    travelDays: number,
    totalDistance: number
  ): DailySegment[] {
    console.log(`🛠️ Creating ${travelDays} heritage-focused segments`);

    const segments: DailySegment[] = [];
    const allStops = [startStop, ...heritageCities, endStop];
    
    if (travelDays === 1) {
      // Single day trip
      const segment: DailySegment = {
        day: 1,
        title: `Day 1: ${startStop.city_name || startStop.name} to ${endStop.city_name || endStop.name}`,
        startCity: startStop.city_name || startStop.name,
        endCity: endStop.city_name || endStop.name,
        distance: totalDistance,
        approximateMiles: Math.round(totalDistance),
        driveTimeHours: DistanceCalculationService.calculateDriveTime(totalDistance),
        destination: {
          city: endStop.city_name || endStop.name,
          state: endStop.state || 'Unknown'
        },
        recommendedStops: [],
        attractions: heritageCities.slice(0, 3).map(stop => ({
          name: stop.name,
          title: stop.name,
          description: stop.description,
          city: stop.city_name || stop.name
        }))
      };

      segments.push(segment);
    } else {
      // Multi-day trip - distribute heritage cities across days
      for (let day = 1; day <= travelDays; day++) {
        const isLastDay = day === travelDays;
        
        let startCity: string;
        let endCity: string;
        let dayDistance: number;
        let dayAttractions: any[] = [];

        if (day === 1) {
          startCity = startStop.city_name || startStop.name;
          if (heritageCities.length > 0) {
            endCity = heritageCities[0].city_name || heritageCities[0].name;
            dayDistance = DistanceCalculationService.calculateDistance(
              startStop.latitude, startStop.longitude,
              heritageCities[0].latitude, heritageCities[0].longitude
            );
            dayAttractions.push({
              name: heritageCities[0].name,
              title: heritageCities[0].name,
              description: heritageCities[0].description,
              city: heritageCities[0].city_name || heritageCities[0].name
            });
          } else {
            endCity = endStop.city_name || endStop.name;
            dayDistance = totalDistance;
          }
        } else if (isLastDay) {
          // Last day - go to final destination
          if (heritageCities.length >= day - 1) {
            startCity = heritageCities[day - 2].city_name || heritageCities[day - 2].name;
            dayDistance = DistanceCalculationService.calculateDistance(
              heritageCities[day - 2].latitude, heritageCities[day - 2].longitude,
              endStop.latitude, endStop.longitude
            );
          } else {
            startCity = segments[day - 2].endCity;
            dayDistance = totalDistance / travelDays; // Estimate
          }
          endCity = endStop.city_name || endStop.name;
        } else {
          // Middle days
          const heritageIndex = day - 1;
          if (heritageCities.length > heritageIndex) {
            startCity = segments[day - 2].endCity;
            endCity = heritageCities[heritageIndex].city_name || heritageCities[heritageIndex].name;
            
            // Calculate distance from previous stop
            if (heritageCities.length >= day - 1) {
              dayDistance = DistanceCalculationService.calculateDistance(
                heritageCities[day - 2].latitude, heritageCities[day - 2].longitude,
                heritageCities[heritageIndex].latitude, heritageCities[heritageIndex].longitude
              );
            } else {
              dayDistance = totalDistance / travelDays; // Estimate
            }
            
            dayAttractions.push({
              name: heritageCities[heritageIndex].name,
              title: heritageCities[heritageIndex].name,
              description: heritageCities[heritageIndex].description,
              city: heritageCities[heritageIndex].city_name || heritageCities[heritageIndex].name
            });
          } else {
            startCity = segments[day - 2].endCity;
            endCity = endStop.city_name || endStop.name;
            dayDistance = totalDistance / travelDays; // Estimate
          }
        }

        const driveTimeHours = DistanceCalculationService.calculateDriveTime(dayDistance);

        const segment: DailySegment = {
          day,
          title: `Day ${day}: ${startCity} to ${endCity}`,
          startCity,
          endCity,
          distance: Math.max(dayDistance, 1),
          approximateMiles: Math.round(Math.max(dayDistance, 1)),
          driveTimeHours: Math.max(driveTimeHours, 0.1),
          destination: {
            city: endCity,
            state: isLastDay ? (endStop.state || 'Unknown') : 
                   (heritageCities[Math.min(day - 1, heritageCities.length - 1)]?.state || 'Unknown')
          },
          recommendedStops: [],
          attractions: dayAttractions
        };

        segments.push(segment);
        
        console.log(`📅 Day ${day}: ${startCity} → ${endCity}, ${dayDistance.toFixed(1)} miles, ${driveTimeHours.toFixed(1)} hours`);
      }
    }

    return segments;
  }
}
