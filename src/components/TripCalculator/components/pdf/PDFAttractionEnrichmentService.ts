import { DailySegment } from '../../services/planning/TripPlanTypes';
import { TripStop } from '../../types/TripStop';
import { SupabaseDataService } from '../../services/data/SupabaseDataService';
import { DistanceCalculationService } from '../../services/utils/DistanceCalculationService';

export class PDFAttractionEnrichmentService {
  /**
   * Enrich segments with attraction data for PDF generation
   */
  static async enrichSegmentsWithAttractions(segments: DailySegment[]): Promise<DailySegment[]> {
    console.log('🎯 PDF: Starting attraction enrichment for PDF segments');
    
    try {
      // Get all available stops data
      const allStops = await SupabaseDataService.fetchAllStops();
      console.log(`🎯 PDF: Loaded ${allStops.length} stops for attraction enrichment`);
      
      // Enrich each segment with attractions
      const enrichedSegments = await Promise.all(
        segments.map(async (segment, index) => {
          console.log(`🎯 PDF: Enriching segment ${index + 1}: ${segment.startCity} → ${segment.endCity}`);
          
          // Find attractions for this segment
          const attractions = this.findAttractionsForSegment(segment, allStops);
          console.log(`🎯 PDF: Found ${attractions.length} attractions for ${segment.endCity}`);
          
          return {
            ...segment,
            attractions: attractions.map(stop => ({
              name: stop.name,
              title: stop.name,
              description: stop.description,
              city: stop.city || stop.city_name || 'Unknown',
              category: stop.category || 'attraction'
            })),
            recommendedStops: attractions.map(stop => ({
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
            }))
          };
        })
      );
      
      console.log('✅ PDF: Attraction enrichment completed for all segments');
      return enrichedSegments;
      
    } catch (error) {
      console.error('❌ PDF: Failed to enrich segments with attractions:', error);
      return segments; // Return original segments if enrichment fails
    }
  }
  
  /**
   * Find attractions for a specific segment
   */
  private static findAttractionsForSegment(segment: DailySegment, allStops: TripStop[]): TripStop[] {
    // Try to find start and end stops for this segment
    const startStop = allStops.find(stop => 
      stop.name?.toLowerCase().includes(segment.startCity.toLowerCase()) ||
      stop.city_name?.toLowerCase().includes(segment.startCity.toLowerCase())
    );
    
    const endStop = allStops.find(stop => 
      stop.name?.toLowerCase().includes(segment.endCity.toLowerCase()) ||
      stop.city_name?.toLowerCase().includes(segment.endCity.toLowerCase())
    );
    
    if (!startStop || !endStop) {
      console.log(`🎯 PDF: Could not find start/end stops for ${segment.startCity} → ${segment.endCity}`);
      // Fallback: find attractions near the end city
      return this.findNearbyAttractions(segment.endCity, allStops);
    }
    
    console.log(`🎯 PDF: Found route stops: ${startStop.name} → ${endStop.name}`);
    
    // Calculate route distance
    const directDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude, endStop.latitude, endStop.longitude
    );
    
    // Find attractions along the route
    const routeAttractions = allStops.filter(stop => {
      // Skip start and end stops
      if (stop.id === startStop.id || stop.id === endStop.id) return false;
      
      // Only include valid attraction types
      if (!['attraction', 'historic_site', 'hidden_gems'].includes(stop.category)) return false;
      
      // Calculate if stop is along the route
      const distFromStart = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, stop.latitude, stop.longitude
      );
      const distToEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude, endStop.latitude, endStop.longitude
      );
      
      const routeDeviation = (distFromStart + distToEnd) - directDistance;
      const isOnRoute = routeDeviation < (directDistance * 0.3); // More lenient than the strict 0.2
      const isBetween = distFromStart < directDistance && distToEnd < directDistance;
      
      return isOnRoute && isBetween;
    });
    
    if (routeAttractions.length > 0) {
      console.log(`🎯 PDF: Found ${routeAttractions.length} route attractions: ${routeAttractions.map(s => s.name).join(', ')}`);
      return routeAttractions.slice(0, 3); // Limit to 3
    }
    
    // Fallback: find nearby attractions
    console.log(`🎯 PDF: No route attractions found, searching near ${segment.endCity}`);
    return this.findNearbyAttractions(segment.endCity, allStops);
  }
  
  /**
   * Find attractions near a city
   */
  private static findNearbyAttractions(cityName: string, allStops: TripStop[]): TripStop[] {
    // Find the destination city stop
    const cityStop = allStops.find(stop => 
      stop.name?.toLowerCase().includes(cityName.toLowerCase()) ||
      stop.city_name?.toLowerCase().includes(cityName.toLowerCase()) ||
      stop.city?.toLowerCase().includes(cityName.toLowerCase())
    );
    
    if (!cityStop) {
      console.log(`🎯 PDF: Could not find city stop for ${cityName}`);
      return [];
    }
    
    // Find attractions within 50 miles of the city
    const nearbyAttractions = allStops.filter(stop => {
      if (!['attraction', 'historic_site', 'hidden_gems'].includes(stop.category)) return false;
      if (stop.id === cityStop.id) return false;
      
      const distance = DistanceCalculationService.calculateDistance(
        cityStop.latitude, cityStop.longitude, stop.latitude, stop.longitude
      );
      
      return distance <= 50;
    }).sort((a, b) => {
      // Sort by distance to city
      const distA = DistanceCalculationService.calculateDistance(
        cityStop.latitude, cityStop.longitude, a.latitude, a.longitude
      );
      const distB = DistanceCalculationService.calculateDistance(
        cityStop.latitude, cityStop.longitude, b.latitude, b.longitude
      );
      return distA - distB;
    });
    
    const result = nearbyAttractions.slice(0, 3);
    console.log(`🎯 PDF: Found ${result.length} nearby attractions for ${cityName}: ${result.map(s => s.name).join(', ')}`);
    return result;
  }
}