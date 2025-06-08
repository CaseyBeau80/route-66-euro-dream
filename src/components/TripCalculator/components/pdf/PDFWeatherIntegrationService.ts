
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { getWeatherDataForTripDate } from '../../services/weather/WeatherServiceCore';

export class PDFWeatherIntegrationService {
  static async enrichSegmentsWithWeather(
    segments: DailySegment[], 
    tripStartDate?: Date
  ): Promise<DailySegment[]> {
    console.log('🌤️ PDFWeatherIntegrationService: Enriching segments with weather data using UI logic...');
    
    if (!segments || segments.length === 0) {
      console.log('⚠️ No segments to enrich');
      return [];
    }

    if (!tripStartDate) {
      console.log('⚠️ No trip start date provided, returning segments without weather');
      return segments;
    }

    const enrichedSegments: DailySegment[] = [];

    for (const segment of segments) {
      try {
        const segmentDate = new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
        
        console.log(`🌤️ Processing weather for Day ${segment.day} (${segment.endCity}) on ${segmentDate.toISOString()}`);
        
        // Attempt to get weather data
        const weatherData = await getWeatherDataForTripDate(segment.endCity, segmentDate);
        
        const enrichedSegment = {
          ...segment,
          weather: weatherData,
          weatherData: weatherData // Backup property
        };
        
        enrichedSegments.push(enrichedSegment);
        console.log(`✅ Weather data enriched for Day ${segment.day}`);
        
      } catch (error) {
        console.warn(`⚠️ Failed to get weather for Day ${segment.day} (${segment.endCity}):`, error);
        
        // Add segment without weather data
        enrichedSegments.push({
          ...segment,
          weather: null,
          weatherData: null
        });
      }
    }

    console.log(`✅ Weather enrichment completed: ${enrichedSegments.length} segments processed`);
    return enrichedSegments;
  }
}
