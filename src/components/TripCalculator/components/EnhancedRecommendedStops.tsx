
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { MapPin } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { getValidatedStops, isUserRelevantStop } from './utils/stopValidation';
import { EnhancedStopSelectionService } from '../services/planning/EnhancedStopSelectionService';
import { SupabaseDataService } from '../services/data/SupabaseDataService';
import { ErrorHandlingService } from '../services/error/ErrorHandlingService';
import { DataValidationService } from '../services/validation/DataValidationService';
import { TripStop, convertToTripStop } from '../types/TripStop';
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
  const isValidSegment = useMemo(() => 
    DataValidationService.validateDailySegment(segment, 'EnhancedRecommendedStops.segment'),
    [segment]
  );
  
  // Memoize validated stops to prevent re-renders
  const { validStops, userRelevantStops } = useMemo(() => {
    if (!isValidSegment) {
      return { validStops: [], userRelevantStops: [] };
    }
    
    try {
      const valid = getValidatedStops(segment);
      const userRelevant = valid.filter(isUserRelevantStop);
      return { validStops: valid, userRelevantStops: userRelevant };
    } catch (error) {
      ErrorHandlingService.logError(error as Error, 'EnhancedRecommendedStops.getValidatedStops');
      console.error('❌ Error getting validated stops:', error);
      return { validStops: [], userRelevantStops: [] };
    }
  }, [segment, isValidSegment]);
  
  // Memoize the enhanced selection trigger
  const shouldTriggerEnhanced = useMemo(() => 
    userRelevantStops.length < 2 && segment.startCity && segment.endCity,
    [userRelevantStops.length, segment.startCity, segment.endCity]
  );
  
  // Enhanced selection with comprehensive error handling
  const tryEnhancedSelection = useCallback(async () => {
    if (!shouldTriggerEnhanced) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`🚀 TRIGGERING ENHANCED SELECTION for ${segment.startCity} → ${segment.endCity}`);
      
      // Create mock start/end stops for the enhanced selection
      const startStop: TripStop = convertToTripStop({
        id: 'temp-start',
        name: segment.startCity,
        description: 'Start location',
        city_name: segment.startCity,
        state: 'Unknown',
        latitude: 0,
        longitude: 0,
        category: 'destination_city'
      });
      
      const endStop: TripStop = convertToTripStop({
        id: 'temp-end',
        name: segment.endCity,
        description: 'End location',
        city_name: segment.endCity,
        state: 'Unknown',
        latitude: 0,
        longitude: 0,
        category: 'destination_city'
      });
      
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
        // Convert to unified TripStop format
        const convertedEnhanced = enhanced.map(stop => convertToTripStop(stop));
        setEnhancedStops(convertedEnhanced);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      ErrorHandlingService.logError(error as Error, 'EnhancedRecommendedStops.tryEnhancedSelection');
      setError(`Failed to load enhanced stops: ${errorMessage}`);
      console.error('❌ Enhanced selection failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [shouldTriggerEnhanced, segment.startCity, segment.endCity, maxStops]);
  
  useEffect(() => {
    tryEnhancedSelection();
  }, [tryEnhancedSelection]);
  
  // Combine and deduplicate stops with error handling
  const finalStops = useMemo(() => {
    const combinedStops = [...userRelevantStops];
    
    try {
      enhancedStops.forEach(enhancedStop => {
        const alreadyExists = combinedStops.some(stop => 
          stop.name.toLowerCase() === enhancedStop.name.toLowerCase()
        );
        
        if (!alreadyExists) {
          combinedStops.push(enhancedStop);
        }
      });
    } catch (error) {
      ErrorHandlingService.logError(error as Error, 'EnhancedRecommendedStops.combineStops');
      console.error('❌ Error combining stops:', error);
    }
    
    return combinedStops.slice(0, maxStops);
  }, [userRelevantStops, enhancedStops, maxStops]);

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

  if (!isValidSegment) {
    return (
      <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-sm text-red-600">
          Unable to load stops due to invalid segment data
        </p>
      </div>
    );
  }

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
              <ErrorBoundary key={stop.id} context={`StopItem-${index}`}>
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
