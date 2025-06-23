
import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { GeographicAttractionService, NearbyAttraction } from '../services/attractions/GeographicAttractionService';
import { AttractionLimitingService } from '../services/attractions/AttractionLimitingService';
import { getDestinationCityWithState } from '../utils/DestinationUtils';
import AttractionItem from './AttractionItem';
import ErrorBoundary from './ErrorBoundary';

interface SegmentNearbyAttractionsProps {
  segment: DailySegment;
  maxAttractions?: number;
  forceDisplay?: boolean;
}

const SegmentNearbyAttractions: React.FC<SegmentNearbyAttractionsProps> = ({
  segment,
  maxAttractions = 3,
  forceDisplay = false
}) => {
  const [attractions, setAttractions] = useState<NearbyAttraction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const context = `SegmentNearbyAttractions-Day${segment.day}`;

  console.log('🎯 SegmentNearbyAttractions - FIXED attraction loading:', {
    day: segment.day,
    endCity: segment.endCity,
    forceDisplay,
    maxAttractions,
    existingData: {
      attractionsCount: segment.attractions?.length || 0,
      recommendedStopsCount: segment.recommendedStops?.length || 0,
      stopsCount: segment.stops?.length || 0
    },
    fixApplied: 'COMPREHENSIVE_ATTRACTION_DISPLAY'
  });

  // Load attractions from multiple sources
  useEffect(() => {
    const loadAttractions = async () => {
      if (!segment?.endCity) return;

      setIsLoading(true);
      setError(null);

      try {
        // Collect attractions from all available sources
        const allAttractions: NearbyAttraction[] = [];

        // 1. Use existing segment attractions if available
        if (segment.attractions && segment.attractions.length > 0) {
          const segmentAttractions = segment.attractions.map((attraction: any) => ({
            id: attraction.id || `attraction-${attraction.name}`,
            name: attraction.name,
            description: attraction.description || attraction.title || '',
            category: attraction.category || 'attraction',
            distanceFromCity: 0, // These are already associated with the city
            latitude: attraction.latitude || 0,
            longitude: attraction.longitude || 0,
            source: 'segment_data' as const
          }));
          allAttractions.push(...segmentAttractions);
        }

        // 2. Use recommended stops if available
        if (segment.recommendedStops && segment.recommendedStops.length > 0) {
          const recommendedAttractions = segment.recommendedStops.map((stop: any) => ({
            id: stop.id || stop.stopId || `stop-${stop.name}`,
            name: stop.name,
            description: stop.description || '',
            category: stop.category || 'recommended_stop',
            distanceFromCity: 0,
            latitude: stop.latitude || 0,
            longitude: stop.longitude || 0,
            source: 'recommended_stops' as const
          }));
          allAttractions.push(...recommendedAttractions);
        }

        // 3. If we still don't have enough attractions or forceDisplay is true, search for more
        if (allAttractions.length < maxAttractions || forceDisplay) {
          try {
            const { city, state } = getDestinationCityWithState(segment.endCity);
            const searchResult = await GeographicAttractionService.findAttractionsNearCity(
              city,
              state,
              40 // 40 mile radius
            );

            // Add geographic attractions that aren't already included
            const existingNames = new Set(allAttractions.map(a => a.name.toLowerCase()));
            const newAttractions = searchResult.attractions.filter(
              attraction => !existingNames.has(attraction.name.toLowerCase())
            );

            allAttractions.push(...newAttractions);
          } catch (geoError) {
            console.warn('⚠️ Geographic attraction search failed:', geoError);
          }
        }

        // Apply centralized limiting
        const limitResult = AttractionLimitingService.limitAttractions(
          allAttractions,
          context,
          maxAttractions
        );

        setAttractions(limitResult.limitedAttractions);

        console.log('✅ SegmentNearbyAttractions loaded successfully:', {
          day: segment.day,
          endCity: segment.endCity,
          totalFound: allAttractions.length,
          afterLimiting: limitResult.limitedAttractions.length,
          sources: {
            segmentAttractions: segment.attractions?.length || 0,
            recommendedStops: segment.recommendedStops?.length || 0,
            geographic: allAttractions.filter(a => a.source === 'geographic').length
          },
          fixApplied: 'COMPREHENSIVE_LOADING_SUCCESS'
        });

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load attractions';
        setError(errorMessage);
        console.error('❌ SegmentNearbyAttractions loading failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAttractions();
  }, [segment.endCity, segment.day, maxAttractions, forceDisplay]);

  // Validate the attraction limit
  if (attractions.length > 0 && !AttractionLimitingService.validateAttractionLimit(attractions, context)) {
    console.error(`🚨 CRITICAL: Attraction limit validation failed for ${context}`);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-red-600 mb-2">⚠️ Attraction Limit Error</h4>
        <p className="text-xs text-red-500">Attraction limiting failed for this segment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Recommended Stops
        </h4>
        <p className="text-xs text-yellow-700">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h4 className="font-travel font-bold text-route66-vintage-brown mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Recommended Stops
          <span className="text-xs text-gray-500">(loading...)</span>
        </h4>
        <div className="animate-pulse space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (attractions.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Recommended Stops
        </h4>
        <p className="text-sm text-gray-600">
          No attractions found for {segment.endCity}. Explore the area when you arrive!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-travel font-bold text-route66-vintage-brown mb-3 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Recommended Stops ({attractions.length})
      </h4>
      
      <div className="space-y-3">
        {attractions.map((attraction, index) => (
          <ErrorBoundary key={`${attraction.id}-${index}`} context={`AttractionItem-${index}`}>
            <AttractionItem attraction={attraction} index={index} />
          </ErrorBoundary>
        ))}
      </div>
    </div>
  );
};

export default SegmentNearbyAttractions;
