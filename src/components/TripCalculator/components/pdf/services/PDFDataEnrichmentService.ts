import { DailySegment } from '../../../services/planning/TripPlanBuilder';
import { PDFWeatherIntegrationService } from '../PDFWeatherIntegrationService';
import { GeographicAttractionService } from '../../../services/attractions/GeographicAttractionService';
import { AttractionLimitingService } from '../../../services/attractions/AttractionLimitingService';

export class PDFDataEnrichmentService {
  /**
   * Enriches trip segments with both weather and attractions data for PDF export
   */
  static async enrichSegmentsForPDF(
    segments: DailySegment[], 
    tripStartDate?: Date
  ): Promise<DailySegment[]> {
    console.log('📋 PDFDataEnrichmentService: Starting comprehensive data enrichment for PDF...');
    
    if (!segments || segments.length === 0) {
      console.log('⚠️ No segments to enrich');
      return [];
    }

    // First, enrich with weather data
    console.log('🌤️ Step 1: Enriching with weather data...');
    const weatherEnrichedSegments = await PDFWeatherIntegrationService.enrichSegmentsWithWeather(
      segments, 
      tripStartDate
    );

    // Then, enrich with attractions data
    console.log('🎯 Step 2: Enriching with attractions data...');
    const fullyEnrichedSegments: DailySegment[] = [];

    for (const segment of weatherEnrichedSegments) {
      try {
        console.log(`🎯 Fetching attractions for Day ${segment.day} - ${segment.endCity}`);
        
        // Use the same attraction service that the UI uses
        const attractionsSearchResult = await GeographicAttractionService.findAttractionsNearCity(
          segment.endCity,
          '', // State - we don't have it on DailySegment, so use empty string
          25 // Search within 25 miles
        );

        let attractions = attractionsSearchResult.attractions || [];
        
        // Apply limiting service to ensure reasonable number of attractions
        const limitingContext = `PDF-Day${segment.day}-${segment.endCity}`;
        const limitResult = AttractionLimitingService.limitAttractions(
          attractions,
          limitingContext,
          6 // Max 6 attractions per day for PDF readability
        );

        if (AttractionLimitingService.validateAttractionLimit(limitResult.limitedAttractions, limitingContext)) {
          attractions = limitResult.limitedAttractions;
        }

        // Also include any existing recommended stops
        const allAttractions = [
          ...attractions,
          ...(segment.recommendedStops || []).map(stop => ({
            name: stop.name || 'Unnamed Stop',
            description: stop.description || '',
            category: stop.category || 'attraction',
            distance: 0,
            city: segment.endCity,
            state: '' // DailySegment doesn't have endState property
          }))
        ];

        // Remove duplicates based on name
        const uniqueAttractions = allAttractions.reduce((acc, attraction) => {
          const name = attraction.name || 'Unnamed Stop';
          if (!acc.find(existing => existing.name === name)) {
            acc.push(attraction);
          }
          return acc;
        }, [] as any[]);

        const enrichedSegment = {
          ...segment,
          attractions: uniqueAttractions,
          // Keep existing data too
          recommendedStops: segment.recommendedStops || [],
          stops: segment.stops || []
        };

        fullyEnrichedSegments.push(enrichedSegment);
        console.log(`✅ Enriched Day ${segment.day} with ${uniqueAttractions.length} attractions`);

      } catch (error) {
        console.warn(`⚠️ Failed to fetch attractions for Day ${segment.day} (${segment.endCity}):`, error);
        
        // Add segment without new attractions data (but keep existing data)
        fullyEnrichedSegments.push({
          ...segment,
          attractions: segment.attractions || [],
          recommendedStops: segment.recommendedStops || [],
          stops: segment.stops || []
        });
      }
    }

    console.log(`✅ PDF data enrichment completed: ${fullyEnrichedSegments.length} segments fully enriched`);
    console.log('📊 Enrichment summary:', {
      total: fullyEnrichedSegments.length,
      withWeather: fullyEnrichedSegments.filter(s => !!(s.weather || s.weatherData)).length,
      withAttractions: fullyEnrichedSegments.filter(s => s.attractions && s.attractions.length > 0).length,
      totalAttractions: fullyEnrichedSegments.reduce((sum, s) => sum + (s.attractions?.length || 0), 0)
    });

    return fullyEnrichedSegments;
  }
}
