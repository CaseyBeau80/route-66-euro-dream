
import { TripStop } from '../../types/TripStop';
import { DailySegment, RecommendedStop } from './TripPlanTypes';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { AttractionFinder } from './AttractionFinder';
import { DriveTimeCategorizer } from './DriveTimeCategorizer';

export class SegmentFactory {
  /**
   * Create a single daily segment with all required properties
   */
  static createStrictSegment(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    day: number,
    totalDistance: number
  ): DailySegment {
    console.log(`🔨 STRICT: Creating Day ${day} segment: ${startStop.name} → ${endStop.name}`, {
      startStopCategory: startStop.category,
      endStopCategory: endStop.category,
      availableStops: allStops.length
    });
    
    // Calculate segment distance
    const segmentDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude, endStop.latitude, endStop.longitude
    );
    
    // Calculate drive time (Route 66 average speed: 50 mph)
    const driveTimeHours = segmentDistance / 50;
    
    // Find attractions along this segment (NOT destination cities for overnight)
    const segmentAttractions = AttractionFinder.findStrictAttractionsForSegment(
      startStop, endStop, allStops, 3
    );
    
    // Determine drive time category
    const driveTimeCategory = DriveTimeCategorizer.getDriveTimeCategory(driveTimeHours);
    
    // Create city display names
    const startCityDisplay = CityDisplayService.getCityDisplayName(startStop);
    const endCityDisplay = CityDisplayService.getCityDisplayName(endStop);
    
    console.log(`✅ STRICT: Day ${day} segment created: ${Math.round(segmentDistance)}mi, ${driveTimeHours.toFixed(1)}h, ${segmentAttractions.length} attractions`);
    
    return {
      day,
      title: `Day ${day}: ${startCityDisplay} to ${endCityDisplay}`,
      startCity: startCityDisplay,
      endCity: endCityDisplay,
      distance: segmentDistance,
      approximateMiles: Math.round(segmentDistance),
      drivingTime: driveTimeHours,
      driveTimeHours: parseFloat(driveTimeHours.toFixed(1)),
      stops: [startStop, endStop, ...segmentAttractions],
      destination: {
        city: endStop.city_name || endStop.name,
        state: endStop.state
      },
      recommendedStops: segmentAttractions.map((stop: TripStop) => ({
        stopId: stop.id,
        id: stop.id,
        name: stop.name,
        description: stop.description,
        latitude: stop.latitude,
        longitude: stop.longitude,
        category: stop.category,
        city_name: stop.city_name,
        state: stop.state,
        city: stop.city || stop.city_name || 'Unknown'
      })),
      attractions: segmentAttractions.map((stop: TripStop) => ({
        name: stop.name,
        title: stop.name,
        description: stop.description,
        city: stop.city || stop.city_name || 'Unknown',
        category: stop.category || 'attraction'
      })),
      driveTimeCategory: driveTimeCategory,
      routeSection: day <= Math.ceil(3) ? 'Early Route' : 
                   day <= Math.ceil(6) ? 'Mid Route' : 'Final Stretch'
    };
  }
}
