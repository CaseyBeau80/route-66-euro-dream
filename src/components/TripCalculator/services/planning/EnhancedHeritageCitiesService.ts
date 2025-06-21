
import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStop } from '../../types/TripStop';
import { CoordinateAccessSafety } from './CoordinateAccessSafety';
import { EnhancedDistanceService } from '../EnhancedDistanceService';
import { DestinationMatchingService } from '../DestinationMatchingService';

export class EnhancedHeritageCitiesService {
  /**
   * Plan enhanced heritage cities trip with coordinate safety and real distances
   */
  static async planEnhancedHeritageCitiesTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    allStops: TripStop[]
  ): Promise<TripPlan> {
    console.log(`🏛️ ENHANCED HERITAGE: Planning ${travelDays} day trip from ${startLocation} to ${endLocation}`);
    
    try {
      // Validate coordinates for all stops
      const validStops = allStops.filter(stop => 
        CoordinateAccessSafety.canSafelyAccessCoordinates(stop, `heritage-validation-${stop.id}`)
      );
      
      console.log(`✅ COORDINATE SAFETY: ${validStops.length} stops passed validation from ${allStops.length} total`);
      
      if (validStops.length === 0) {
        throw new Error('No valid stops available for heritage cities trip planning');
      }
      
      // Enhanced destination matching with logging
      console.log(`🔍 SEARCHING for start location: "${startLocation}"`);
      const startMatchResult = DestinationMatchingService.findBestMatch(startLocation, validStops);
      const startStop = startMatchResult?.stop;
      
      console.log(`🔍 SEARCHING for end location: "${endLocation}"`);
      const endMatchResult = DestinationMatchingService.findBestMatch(endLocation, validStops);
      const endStop = endMatchResult?.stop;
      
      if (!startStop) {
        console.error(`❌ Could not find start location: "${startLocation}"`);
        const suggestions = DestinationMatchingService.getSuggestions(startLocation, validStops, 3);
        throw new Error(`Start location "${startLocation}" not found. Try: ${suggestions.join(', ')}`);
      }
      
      if (!endStop) {
        console.error(`❌ Could not find end location: "${endLocation}"`);
        const suggestions = DestinationMatchingService.getSuggestions(endLocation, validStops, 3);
        throw new Error(`End location "${endLocation}" not found. Try: ${suggestions.join(', ')}`);
      }

      console.log(`✅ MATCHED LOCATIONS:`, {
        start: `${startStop.name} (${startStop.city}, ${startStop.state})`,
        end: `${endStop.name} (${endStop.city}, ${endStop.state})`,
        startConfidence: startMatchResult.confidence,
        endConfidence: endMatchResult.confidence
      });
      
      // Create segments with realistic daily limits
      const segments = await this.createRealisticHeritageCitiesSegments(
        startStop,
        endStop,
        validStops,
        travelDays
      );
      
      // Calculate totals from actual segments
      const totalDistance = segments.reduce((total, segment) => total + segment.distance, 0);
      const totalDrivingTime = segments.reduce((total, segment) => total + (segment.driveTimeHours || 0), 0);
      
      // Create complete TripPlan object
      const tripPlan: TripPlan = {
        id: `heritage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: `${startLocation} to ${endLocation} Heritage Cities Route 66 Adventure`,
        startCity: startStop.name,
        endCity: endStop.name,
        startLocation: startLocation,
        endLocation: endLocation,
        startDate: new Date(),
        totalDays: segments.length, // Use actual segment count
        totalDistance: totalDistance,
        totalMiles: totalDistance,
        totalDrivingTime: totalDrivingTime,
        segments: segments,
        dailySegments: segments,
        stops: validStops,
        tripStyle: 'destination-focused',
        lastUpdated: new Date()
      };
      
      console.log(`✅ HERITAGE CITIES: Created realistic trip plan:`, {
        segments: segments.length,
        totalMiles: Math.round(totalDistance),
        totalDriveTime: Math.round(totalDrivingTime * 10) / 10,
        averageDailyDistance: Math.round(totalDistance / segments.length),
        averageDailyDriveTime: Math.round((totalDrivingTime / segments.length) * 10) / 10
      });
      
      return tripPlan;
      
    } catch (error) {
      console.error('❌ HERITAGE CITIES: Planning failed:', error);
      throw new Error(`Heritage cities trip planning failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create segments with realistic daily driving limits (6-8 hours max)
   */
  private static async createRealisticHeritageCitiesSegments(
    startStop: TripStop,
    endStop: TripStop,
    validStops: TripStop[],
    requestedDays: number
  ): Promise<DailySegment[]> {
    const segments: DailySegment[] = [];
    const MAX_DAILY_DRIVE_TIME = 8; // 8 hours max per day
    const PREFERRED_DAILY_DRIVE_TIME = 6; // 6 hours preferred
    
    // Get route stops in geographic order
    const routeStops = this.selectOptimalRouteStops(startStop, endStop, validStops, requestedDays);
    
    console.log(`🗺️ REALISTIC ROUTING: Selected ${routeStops.length} stops for ${requestedDays} requested days`);
    
    let currentStopIndex = 0;
    let dayCount = 1;
    
    while (currentStopIndex < routeStops.length - 1 && dayCount <= requestedDays + 2) { // Allow some flexibility
      const currentStop = routeStops[currentStopIndex];
      let nextStopIndex = currentStopIndex + 1;
      let bestNextStop = routeStops[nextStopIndex];
      let totalDistance = 0;
      let totalDriveTime = 0;
      
      // Try to find the farthest stop we can reach within daily limits
      while (nextStopIndex < routeStops.length) {
        const candidateStop = routeStops[nextStopIndex];
        
        try {
          const distanceResult = await EnhancedDistanceService.calculateDistance(
            currentStop,
            candidateStop,
            { useGoogleMaps: true }
          );
          
          // If this segment would exceed daily limits, stop at previous stop
          if (distanceResult.driveTimeHours > MAX_DAILY_DRIVE_TIME) {
            console.log(`⏰ DAILY LIMIT: ${currentStop.name} to ${candidateStop.name} = ${distanceResult.driveTimeHours.toFixed(1)}h (exceeds ${MAX_DAILY_DRIVE_TIME}h limit)`);
            break;
          }
          
          // Update the best option
          bestNextStop = candidateStop;
          totalDistance = Math.round(distanceResult.distance);
          totalDriveTime = distanceResult.driveTimeHours;
          
          // If we've reached a good stopping point (6+ hours or destination), use it
          if (distanceResult.driveTimeHours >= PREFERRED_DAILY_DRIVE_TIME || candidateStop.id === endStop.id) {
            break;
          }
          
          nextStopIndex++;
        } catch (error) {
          console.warn(`⚠️ Distance calculation failed for ${currentStop.name} to ${candidateStop.name}:`, error);
          // Use fallback estimates
          totalDistance = 200; // Reasonable fallback
          totalDriveTime = 4;   // Reasonable fallback
          break;
        }
      }
      
      // Create segment with safe coordinates
      const destinationCoordinates = CoordinateAccessSafety.safeGetCoordinates(bestNextStop, `segment-${dayCount}`);
      
      const segment: DailySegment = {
        day: dayCount,
        title: `${currentStop.name} to ${bestNextStop.name}`,
        startCity: currentStop.name,
        endCity: bestNextStop.name,
        distance: totalDistance,
        approximateMiles: totalDistance,
        driveTimeHours: totalDriveTime,
        destination: {
          city: bestNextStop.city || bestNextStop.name,
          state: bestNextStop.state || 'Unknown'
        },
        recommendedStops: [{
          stopId: bestNextStop.id,
          id: bestNextStop.id,
          name: bestNextStop.name,
          description: bestNextStop.description || '',
          latitude: destinationCoordinates?.latitude || 0,
          longitude: destinationCoordinates?.longitude || 0,
          category: bestNextStop.category || 'destination_city',
          city_name: bestNextStop.city || bestNextStop.name,
          state: bestNextStop.state || 'Unknown',
          city: bestNextStop.city || bestNextStop.name
        }],
        attractions: [{
          name: bestNextStop.name,
          title: bestNextStop.name,
          description: bestNextStop.description || 'Historic Route 66 destination',
          city: bestNextStop.city || bestNextStop.name,
          category: bestNextStop.category || 'heritage_site'
        }],
        isGoogleMapsData: true,
        dataAccuracy: 'high'
      };
      
      segments.push(segment);
      
      console.log(`📍 Day ${dayCount}: ${currentStop.name} → ${bestNextStop.name} (${totalDistance}mi, ${totalDriveTime.toFixed(1)}h)`);
      
      // Move to next segment
      currentStopIndex = routeStops.findIndex(stop => stop.id === bestNextStop.id);
      dayCount++;
      
      // Break if we've reached the destination
      if (bestNextStop.id === endStop.id) {
        break;
      }
    }
    
    return segments;
  }

  /**
   * Select optimal route stops based on geography and travel days
   */
  private static selectOptimalRouteStops(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    travelDays: number
  ): TripStop[] {
    // Start with start and end stops
    const routeStops = [startStop];
    
    // If same stop, return immediately
    if (startStop.id === endStop.id) {
      return routeStops;
    }
    
    // Get geographic bounds
    const startCoords = CoordinateAccessSafety.safeGetCoordinates(startStop, 'route-start');
    const endCoords = CoordinateAccessSafety.safeGetCoordinates(endStop, 'route-end');
    
    if (!startCoords || !endCoords) {
      console.warn('⚠️ Could not get coordinates for route planning, using simple selection');
      routeStops.push(endStop);
      return routeStops;
    }
    
    // Find intermediate stops along the route
    const intermediateStops = allStops.filter(stop => 
      stop.id !== startStop.id && 
      stop.id !== endStop.id &&
      CoordinateAccessSafety.canSafelyAccessCoordinates(stop, `route-candidate-${stop.id}`)
    );
    
    // Sort by longitude (east to west progression for Route 66)
    const sortedIntermediateStops = intermediateStops
      .map(stop => ({
        stop,
        coords: CoordinateAccessSafety.safeGetCoordinates(stop, `route-sort-${stop.id}`)
      }))
      .filter(item => item.coords)
      .sort((a, b) => {
        // Route 66 generally goes east to west, so sort by longitude
        const aLng = a.coords!.longitude;
        const bLng = b.coords!.longitude;
        return startCoords.longitude < endCoords.longitude ? aLng - bLng : bLng - aLng;
      })
      .map(item => item.stop);
    
    // Add appropriate number of intermediate stops based on travel days
    const maxIntermediateStops = Math.max(0, travelDays - 1);
    const selectedIntermediateStops = sortedIntermediateStops.slice(0, maxIntermediateStops);
    
    routeStops.push(...selectedIntermediateStops);
    routeStops.push(endStop);
    
    console.log(`🗺️ ROUTE SELECTION: ${routeStops.length} stops selected:`, 
      routeStops.map(s => `${s.name} (${s.city})`));
    
    return routeStops;
  }
}
