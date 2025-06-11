
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { MapPin } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { TripStop } from '../types/TripStop';
import { useStableSegment } from '../hooks/useStableSegments';
import { useOptimizedValidation } from '../hooks/useOptimizedValidation';
import { StopEnhancementService } from './stops/StopEnhancementService';
import { StopsCombiner } from './stops/StopsCombiner';
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
  const stableSegment = useStableSegment(segment);
  const { validStops, userRelevantStops, isValid } = useOptimizedValidation(stableSegment);
  
  const [enhancedStops, setEnhancedStops] = useState<TripStop[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const segmentDay = stableSegment?.day || 0;
  const startCity = stableSegment?.startCity || '';
  const endCity = stableSegment?.endCity || '';
  
  const shouldTriggerEnhanced = useMemo(() => 
    isValid && userRelevantStops.length < 2 && startCity !== '' && endCity !== '',
    [isValid, userRelevantStops.length, startCity, endCity]
  );
  
  const tryEnhancedSelection = useCallback(async () => {
    if (!shouldTriggerEnhanced) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const enhanced = await StopEnhancementService.enhanceStopsForSegment(
        startCity, endCity, segmentDay, maxStops
      );
      setEnhancedStops(enhanced);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to load enhanced stops: ${errorMessage}`);
      console.error('❌ Enhanced selection failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [shouldTriggerEnhanced, startCity, endCity, maxStops, segmentDay]);
  
  useEffect(() => {
    tryEnhancedSelection();
  }, [tryEnhancedSelection]);
  
  const finalStops = useMemo(() => 
    StopsCombiner.combineStops(userRelevantStops, enhancedStops, maxStops),
    [userRelevantStops, enhancedStops, maxStops]
  );

  console.log('🎯 EnhancedRecommendedStops final result:', {
    segmentDay,
    route: `${startCity} → ${endCity}`,
    originalStops: userRelevantStops.length,
    enhancedStops: enhancedStops.length,
    finalStops: finalStops.length,
    isLoading,
    error,
    stopNames: finalStops.map(s => s.name)
  });

  if (!isValid) {
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
              <ErrorBoundary key={`${stop.id}-${index}`} context={`StopItem-${index}`}>
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
