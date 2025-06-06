
import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { getValidatedStops, isUserRelevantStop } from './utils/stopValidation';
import { EnhancedStopSelectionService } from '../services/planning/EnhancedStopSelectionService';
import { SupabaseDataService, TripStop } from '../services/data/SupabaseDataService';
import { ErrorHandlingService } from '../services/error/ErrorHandlingService';
import { DataValidationService } from '../services/validation/DataValidationService';
import StopItem from './StopItem';
import StopsEmpty from './StopsEmpty';
import ErrorBoundary from './ErrorBoundary';

interface EnhancedRecommendedStopsProps {
  segment: DailySegment;
  maxStops?: number;
}

const EnhancedRecommendedStops: React.FC<EnhancedRecommendedStopsProps> = ({ 
  segment, 
  maxStops = 5
}) => {
  const [enhancedStops, setEnhancedStops] = useState<TripStop[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Validate segment data
  const isValidSegment = DataValidationService.validateDailySegment(segment, 'EnhancedRecommendedStops.segment');
  
  if (!isValidSegment) {
    console.error('❌ Invalid segment data provided to EnhancedRecommendedStops');
    return (
      <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-sm text-red-600">
          Unable to load stops due to invalid segment data
        </p>
      </div>
    );
  }

  // Get standard validated stops with error handling
  let validStops: TripStop[] = [];
  let userRelevantStops: TripStop[] = [];
  
  try {
    validStops = getValidatedStops(segment);
    userRelevantStops = validStops.filter(isUserRelevantStop);
  } catch (error) {
    ErrorHandlingService.logError(error as Error, 'EnhancedRecommendedStops.getValidatedStops');
    console.error('❌ Error getting validated stops:', error);
  }
  
  // Enhanced selection with comprehensive error handling
  useEffect(() => {
    const tryEnhancedSelection = async () => {
      if (userRelevantStops.length >= 2 || !segment.startCity || !segment.endCity) {
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`🚀 TRIGGERING ENHANCED SELECTION for ${segment.startCity} → ${segment.endCity}`);
        
        // Create mock start/end stops for the enhanced selection
        const startStop: TripStop = {
          id: 'temp-start',
          name: segment.startCity,
          description: 'Start location',
          city_name: segment.startCity,
          state: 'Unknown',
          latitude: 0,
          longitude: 0,
          category: 'destination_city'
        };
        
        const endStop: TripStop = {
          id: 'temp-end',
          name: segment.endCity,
          description: 'End location',
          city_name: segment.endCity,
          state: 'Unknown',
          latitude: 0,
          longitude: 0,
          category: 'destination_city'
        };
        
        const allStops = await ErrorHandlingService.handleAsyncError(
          () => SupabaseDataService.fetchAllStops(),
          'EnhancedRecommendedStops.fetchAllStops',
          []
        );
        
        if (!allStops || allStops.length === 0) {
          console.warn('⚠️ No stops data available for enhanced selection');
          return;
        }
        
        const enhanced = await ErrorHandlingService.handleAsyncError(
          () => EnhancedStopSelectionService.selectStopsForSegment(
            startStop, endStop, allStops, maxStops
          ),
          'EnhancedRecommendedStops.selectStopsForSegment',
          []
        );
        
        if (enhanced && enhanced.length > 0) {
          console.log(`✅ Enhanced selection found ${enhanced.length} stops`);
          // Validate enhanced stops before setting state
          const validatedEnhanced = DataValidationService.validateTripStops(enhanced, 'EnhancedSelection');
          setEnhancedStops(validatedEnhanced);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        ErrorHandlingService.logError(error as Error, 'EnhancedRecommendedStops.tryEnhancedSelection');
        setError(`Failed to load enhanced stops: ${errorMessage}`);
        console.error('❌ Enhanced selection failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    tryEnhancedSelection();
  }, [segment.startCity, segment.endCity, userRelevantStops.length, maxStops]);
  
  // Combine and deduplicate stops with error handling
  const combinedStops = [...userRelevantStops];
  
  try {
    enhancedStops.forEach(enhancedStop => {
      if (!DataValidationService.validateTripStop(enhancedStop, 'EnhancedStop')) {
        return; // Skip invalid stops
      }
      
      const alreadyExists = combinedStops.some(stop => 
        stop.name.toLowerCase() === enhancedStop.name.toLowerCase()
      );
      
      if (!alreadyExists) {
        combinedStops.push({
          id: enhancedStop.id,
          name: enhancedStop.name,
          description: enhancedStop.description || `Discover ${enhancedStop.name} along your Route 66 journey`,
          category: enhancedStop.category,
          city_name: enhancedStop.city_name,
          state: enhancedStop.state,
          latitude: enhancedStop.latitude || 0,
          longitude: enhancedStop.longitude || 0,
          image_url: enhancedStop.image_url,
          is_major_stop: enhancedStop.is_major_stop,
          is_official_destination: enhancedStop.is_official_destination
        });
      }
    });
  } catch (error) {
    ErrorHandlingService.logError(error as Error, 'EnhancedRecommendedStops.combineStops');
    console.error('❌ Error combining stops:', error);
  }
  
  const finalStops = combinedStops.slice(0, maxStops);

  console.log('🎯 EnhancedRecommendedStops final result:', {
    segmentDay: segment.day,
    route: `${segment.startCity} → ${segment.endCity}`,
    originalStops: userRelevantStops.length,
    enhancedStops: enhancedStops.length,
    finalStops: finalStops.length,
    isLoading,
    error,
    stopNames: finalStops.map(s => s.name)
  });

  return (
    <ErrorBoundary context="EnhancedRecommendedStops">
      <div>
        <h4 className="font-travel font-bold text-route66-vintage-brown mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Recommended Stops ({finalStops.length})
          {isLoading && <span className="text-xs text-gray-500">(searching...)</span>}
          {error && <span className="text-xs text-red-500">(error)</span>}
        </h4>
        
        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
            {error}
          </div>
        )}
        
        {finalStops.length > 0 ? (
          <div className="space-y-3">
            {finalStops.map((stop, index) => (
              <ErrorBoundary key={stop.id || `stop-${index}`} context={`StopItem-${index}`}>
                <StopItem stop={stop} index={index} />
              </ErrorBoundary>
            ))}
            
            {enhancedStops.length > 0 && (
              <div className="text-xs text-blue-600 italic text-center p-2 bg-blue-50 rounded border border-blue-200">
                ✨ Enhanced selection found {enhancedStops.length} additional stops
              </div>
            )}
          </div>
        ) : isLoading ? (
          <div className="text-center p-4 bg-route66-background-alt rounded-lg border border-route66-border">
            <div className="animate-spin h-6 w-6 border-2 border-route66-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-route66-vintage-brown">
              Searching for Route 66 attractions...
            </p>
          </div>
        ) : (
          <StopsEmpty />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default EnhancedRecommendedStops;
