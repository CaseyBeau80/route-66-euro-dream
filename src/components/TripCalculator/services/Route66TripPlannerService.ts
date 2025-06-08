
import { SupabaseDataService, TripStop } from './data/SupabaseDataService';
import { TripPlanBuilder, TripPlan, DailySegment, SegmentTiming } from './planning/TripPlanBuilder';
import { TripPlanValidator } from './planning/TripPlanValidator';
import { UnifiedTripPlanningService } from './planning/UnifiedTripPlanningService';
import { CityDisplayService } from './utils/CityDisplayService';
import { DistanceCalculationService } from './utils/DistanceCalculationService';

// Re-export types for backward compatibility
export type { TripStop, DailySegment, TripPlan, SegmentTiming };

export class Route66TripPlannerService {
  static async planTrip(
    startCityName: string, 
    endCityName: string, 
    tripDays: number,
    tripStyle: 'balanced' | 'destination-focused' = 'balanced'
  ): Promise<TripPlan> {
    console.log(`🗺️ Planning ${tripDays}-day ${tripStyle} trip from ${startCityName} to ${endCityName}`);

    const allStops = await SupabaseDataService.fetchAllStops();
    console.log(`📊 Total stops available for planning: ${allStops.length}`);
    
    // Enhanced city matching function with improved fuzzy matching
    const findCityStop = (cityName: string): TripStop | undefined => {
      // Parse city and state from input (e.g., "Springfield, IL" or "Chicago, IL")
      const parts = cityName.split(',').map(part => part.trim());
      const cityOnly = parts[0].toLowerCase();
      const stateOnly = parts.length > 1 ? parts[1].toLowerCase() : null;
      
      console.log(`🔍 Searching for city: "${cityOnly}", state: "${stateOnly}" from input: "${cityName}"`);
      
      // Tier 1: Exact city + state matching (most precise)
      if (stateOnly) {
        const exactMatch = allStops.find(stop => {
          const stopCity = stop.city_name.toLowerCase();
          const stopState = stop.state.toLowerCase();
          const stopName = stop.name.toLowerCase();
          
          // Check for exact matches with city and state
          const exactCityStateMatch = stopCity === cityOnly && stopState === stateOnly;
          const nameExactStateMatch = stopName === cityOnly && stopState === stateOnly;
          
          return exactCityStateMatch || nameExactStateMatch;
        });
        
        if (exactMatch) {
          console.log(`✅ Found exact city+state match: ${exactMatch.name} in ${CityDisplayService.getCityDisplayName(exactMatch)}`);
          return exactMatch;
        }

        // Try partial matches with correct state
        const partialMatch = allStops.find(stop => {
          const stopCity = stop.city_name.toLowerCase();
          const stopState = stop.state.toLowerCase();
          const stopName = stop.name.toLowerCase();
          
          if (stopState !== stateOnly) return false;
          
          const cityContains = stopCity.includes(cityOnly) || cityOnly.includes(stopCity);
          const nameContains = stopName.includes(cityOnly) || cityOnly.includes(stopName);
          
          return cityContains || nameContains;
        });
        
        if (partialMatch) {
          console.log(`✅ Found partial city+state match: ${partialMatch.name} in ${CityDisplayService.getCityDisplayName(partialMatch)}`);
          return partialMatch;
        }
      }
      
      // Tier 2: City-only matching (fallback) - prioritize destination cities
      const cityOnlyMatches = allStops.filter(stop => {
        const stopCity = stop.city_name.toLowerCase();
        const stopName = stop.name.toLowerCase();
        
        // Exact matches first
        if (stopCity === cityOnly || stopName === cityOnly) {
          return true;
        }
        
        // Then partial matches
        return stopCity.includes(cityOnly) || stopName.includes(cityOnly) || 
               cityOnly.includes(stopCity) || cityOnly.includes(stopName);
      });

      if (cityOnlyMatches.length > 0) {
        // Prioritize destination cities, then major stops
        const destinationCity = cityOnlyMatches.find(stop => stop.category === 'destination_city');
        if (destinationCity) {
          console.log(`✅ Found destination city match: ${destinationCity.name} in ${CityDisplayService.getCityDisplayName(destinationCity)}`);
          if (stateOnly && destinationCity.state.toLowerCase() !== stateOnly) {
            console.log(`⚠️ Warning: State mismatch! Expected ${stateOnly}, found ${destinationCity.state}`);
          }
          return destinationCity;
        }

        const majorStop = cityOnlyMatches.find(stop => stop.is_major_stop);
        if (majorStop) {
          console.log(`✅ Found major stop match: ${majorStop.name} in ${CityDisplayService.getCityDisplayName(majorStop)}`);
          if (stateOnly && majorStop.state.toLowerCase() !== stateOnly) {
            console.log(`⚠️ Warning: State mismatch! Expected ${stateOnly}, found ${majorStop.state}`);
          }
          return majorStop;
        }

        // Return first match
        const firstMatch = cityOnlyMatches[0];
        console.log(`⚠️ Found city-only match: ${firstMatch.name} in ${CityDisplayService.getCityDisplayName(firstMatch)}`);
        if (stateOnly && firstMatch.state.toLowerCase() !== stateOnly) {
          console.log(`⚠️ Warning: State mismatch! Expected ${stateOnly}, found ${firstMatch.state}`);
        }
        return firstMatch;
      }
      
      console.log(`❌ No match found for "${cityName}"`);
      return undefined;
    };
    
    // Find start and end stops with enhanced matching
    const startStop = findCityStop(startCityName);
    const endStop = findCityStop(endCityName);

    console.log('🔍 Start stop found:', startStop ? { 
      name: startStop.name, 
      city_display: CityDisplayService.getCityDisplayName(startStop),
      category: startStop.category 
    } : 'NOT FOUND');
    
    console.log('🔍 End stop found:', endStop ? { 
      name: endStop.name, 
      city_display: CityDisplayService.getCityDisplayName(endStop),
      category: endStop.category 
    } : 'NOT FOUND');

    // Validate stops using the new validator
    const { startStop: validatedStartStop, endStop: validatedEndStop } = TripPlanValidator.validateStops(
      startStop,
      endStop,
      startCityName,
      endCityName,
      allStops
    );

    // Use UnifiedTripPlanningService with the specified trip style
    const planningResult = UnifiedTripPlanningService.createTripPlan(
      validatedStartStop,
      validatedEndStop,
      allStops,
      tripDays,
      startCityName,
      endCityName,
      tripStyle
    );

    console.log('🎯 Final trip plan created:', {
      title: planningResult.tripPlan.title,
      tripStyle: planningResult.tripStyle,
      warnings: planningResult.warnings?.length || 0,
      segmentsCount: planningResult.tripPlan.segments.length
    });
    
    return planningResult.tripPlan;
  }

  // NEW METHOD: Generate daily segments for the trip
  private static generateDailySegments(
    startStop: TripStop, 
    endStop: TripStop,
    totalDays: number,
    totalDistance: number,
    allStops: TripStop[]
  ): DailySegment[] {
    console.log(`🔄 Generating ${totalDays} daily segments from ${startStop.name} to ${endStop.name}`);
    
    const segments: DailySegment[] = [];
    const avgDistancePerDay = totalDistance / totalDays;
    
    // Find intermediate destination cities that would make good overnight stops
    let potentialStops = allStops.filter(stop => 
      stop.id !== startStop.id && 
      stop.id !== endStop.id && 
      (stop.is_major_stop || stop.category === 'destination_city')
    );
    
    // Sort by distance from start (to ensure we follow geographic progression)
    potentialStops = potentialStops.sort((a, b) => {
      const distA = this.calculateDistance(startStop, a);
      const distB = this.calculateDistance(startStop, b);
      return distA - distB;
    });
    
    // Select overnight stops based on total days
    const overnightStops: TripStop[] = [];
    
    // For multi-day trips (more than 2 days), select intermediate stops
    if (totalDays > 1) {
      // We need (totalDays - 1) intermediate stops
      const neededIntermediateStops = totalDays - 1;
      
      // Calculate ideal positions for stops (evenly spaced)
      for (let i = 1; i <= neededIntermediateStops; i++) {
        const idealDistance = (totalDistance * i) / totalDays;
        
        // Find closest stop to ideal position
        let bestStop: TripStop | null = null;
        let bestStopDiff = Number.MAX_VALUE;
        
        for (const stop of potentialStops) {
          if (overnightStops.some(s => s.id === stop.id)) continue; // Skip already selected stops
          
          const stopDistance = this.calculateDistance(startStop, stop);
          const diff = Math.abs(stopDistance - idealDistance);
          
          if (diff < bestStopDiff) {
            bestStop = stop;
            bestStopDiff = diff;
          }
        }
        
        if (bestStop) {
          overnightStops.push(bestStop);
        }
      }
    }
    
    // Sort overnight stops by distance from start
    overnightStops.sort((a, b) => {
      const distA = this.calculateDistance(startStop, a);
      const distB = this.calculateDistance(startStop, b);
      return distA - distB;
    });
    
    console.log(`🏙️ Selected ${overnightStops.length} overnight stops:`, overnightStops.map(s => s.name));
    
    // Create segments based on start, overnight stops, and end
    let currentStop = startStop;
    
    for (let day = 1; day <= totalDays; day++) {
      // Determine end stop for this day's segment
      const isLastDay = day === totalDays;
      const dayEndStop = isLastDay ? endStop : overnightStops[day - 1];
      
      // Calculate segment distance
      const segmentDistance = this.calculateDistance(currentStop, dayEndStop);
      
      // Calculate drive time (assume average speed of 50 mph on Route 66)
      const driveTimeHours = segmentDistance / 50;
      
      // Find attractions along this segment
      const segmentAttractions = this.findAttractionsForSegment(
        currentStop, dayEndStop, allStops, 3
      );
      
      // Determine drive time category
      const driveTimeCategory = this.getDriveTimeCategory(driveTimeHours);
      
      // Create the segment
      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${CityDisplayService.getCityDisplayName(currentStop)} to ${CityDisplayService.getCityDisplayName(dayEndStop)}`,
        startCity: CityDisplayService.getCityDisplayName(currentStop),
        endCity: CityDisplayService.getCityDisplayName(dayEndStop),
        distance: segmentDistance,
        approximateMiles: Math.round(segmentDistance),
        driveTimeHours: parseFloat(driveTimeHours.toFixed(1)),
        destination: {
          city: dayEndStop.city_name,
          state: dayEndStop.state
        },
        recommendedStops: segmentAttractions.map(stop => ({
          id: stop.id,
          name: stop.name,
          description: stop.description,
          latitude: stop.latitude,
          longitude: stop.longitude,
          category: stop.category,
          city_name: stop.city_name,
          state: stop.state,
          city: stop.city || stop.city_name
        })),
        attractions: segmentAttractions.map(stop => ({
          name: stop.name,
          title: stop.name,
          description: stop.description,
          city: stop.city || stop.city_name
        })),
        driveTimeCategory: driveTimeCategory,
        routeSection: day <= Math.ceil(totalDays / 3) ? 'Early Route' : 
                     day <= Math.ceil(2 * totalDays / 3) ? 'Mid Route' : 'Final Stretch'
      };
      
      segments.push(segment);
      
      // Update current stop for next iteration
      currentStop = dayEndStop;
    }
    
    console.log(`✅ Generated ${segments.length} daily segments`);
    return segments;
  }

  // NEW METHOD: Find attractions along a segment
  private static findAttractionsForSegment(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    maxAttractions: number
  ): TripStop[] {
    // Calculate the direct distance between start and end
    const directDistance = this.calculateDistance(startStop, endStop);
    
    // Find attractions that are along the route (not too far off the direct path)
    const attractions = allStops.filter(stop => {
      // Skip the start and end stops
      if (stop.id === startStop.id || stop.id === endStop.id) return false;
      
      // Skip overnight stops (destination cities) for clarity in the UI
      if (stop.category === 'destination_city') return false;
      
      // Calculate distances
      const distFromStart = this.calculateDistance(startStop, stop);
      const distToEnd = this.calculateDistance(stop, endStop);
      
      // Triangle inequality - if the sum of distances through this stop is not much longer
      // than the direct route, the stop is roughly along the path
      const routeDeviation = (distFromStart + distToEnd) - directDistance;
      const isOnRoute = routeDeviation < (directDistance * 0.2); // Within 20% deviation
      
      // Also check that the attraction is between the start and end (not past them)
      const isBetween = distFromStart < directDistance && distToEnd < directDistance;
      
      return isOnRoute && isBetween;
    });
    
    // Sort by priority (category) - always show important attractions first
    const sortedAttractions = attractions.sort((a, b) => {
      // Prioritize official Route 66 attractions
      if (a.category === 'attraction' && b.category !== 'attraction') return -1;
      if (b.category === 'attraction' && a.category !== 'attraction') return 1;
      
      // Then prioritize historic sites
      if (a.category === 'historic_site' && b.category !== 'historic_site') return -1;
      if (b.category === 'historic_site' && a.category !== 'historic_site') return 1;
      
      return 0;
    });
    
    // Return limited number of attractions
    return sortedAttractions.slice(0, maxAttractions);
  }
  
  // NEW METHOD: Get drive time category based on hours
  private static getDriveTimeCategory(driveTimeHours: number): { category: 'short' | 'optimal' | 'long' | 'extreme', message: string, color: string } {
    if (driveTimeHours <= 4) {
      return {
        category: 'short',
        message: `${driveTimeHours.toFixed(1)} hours - Relaxed pace with plenty of time for attractions`,
        color: 'text-green-800'
      };
    } else if (driveTimeHours <= 6) {
      return {
        category: 'optimal',
        message: `${driveTimeHours.toFixed(1)} hours - Perfect balance of driving and exploration`,
        color: 'text-blue-800'
      };
    } else if (driveTimeHours <= 8) {
      return {
        category: 'long',
        message: `${driveTimeHours.toFixed(1)} hours - Substantial driving day, but manageable`,
        color: 'text-orange-800'
      };
    } else {
      return {
        category: 'extreme',
        message: `${driveTimeHours.toFixed(1)} hours - Very long driving day, consider breaking into multiple days`,
        color: 'text-red-800'
      };
    }
  }

  // Helper function to calculate distance between stops
  private static calculateDistance(startStop: TripStop, endStop: TripStop): number {
    // Simple distance calculation using latitude/longitude
    const R = 3958.8; // Earth radius in miles
    const lat1 = startStop.latitude;
    const lon1 = startStop.longitude;
    const lat2 = endStop.latitude;
    const lon2 = endStop.longitude;
    
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}
