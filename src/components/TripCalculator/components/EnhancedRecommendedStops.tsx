
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { MapPin } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { TripStop } from '../types/TripStop';
import { useStableSegment } from '../hooks/useStableSegments';
import { useOptimizedValidation } from '../hooks/useOptimizedValidation';
import { useRecommendedStops } from '../hooks/useRecommendedStops';
import { StopEnhancementService } from './stops/StopEnhancementService';
import { StopsCombiner } from './stops/StopsCombiner';
import StopItem from './StopItem';
import StopsEmpty from './StopsEmpty';
import RecommendedStopsDisplay from './RecommendedStopsDisplay';
import ErrorBoundary from './ErrorBoundary';

interface EnhancedRecommendedStopsProps {
  segment: DailySegment;
  maxStops?: number;
}

const EnhancedRecommendedStops: React.FC<EnhancedRecommendedStopsProps> = ({ 
  segment, 
  maxStops = 3 
}) => {
  const safeMaxStops = maxStops ?? 3;
  
  const stableSegment = useStableSegment(segment);
  const { validStops, userRelevantStops, isValid } = useOptimizedValidation(stableSegment);
  
  // Use the enhanced recommended stops hook
  const { recommendedStops, isLoading: isLoadingRecommended, hasStops: hasRecommendedStops, error } = useRecommendedStops(stableSegment, safeMaxStops);
  
  const [enhancedStops, setEnhancedStops] = useState<TripStop[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [enhancedError, setEnhancedError] = useState<string | null>(null);
  
  const segmentDay = stableSegment?.day || 0;
  const startCity = stableSegment?.startCity || '';
  const endCity = stableSegment?.endCity || '';
  
  const shouldTriggerEnhanced = useMemo(() => 
    isValid && userRelevantStops.length < 2 && !hasRecommendedStops && startCity !== '' && endCity !== '',
    [isValid, userRelevantStops.length, hasRecommendedStops, startCity, endCity]
  );
  
  const tryEnhancedSelection = useCallback(async () => {
    if (!shouldTriggerEnhanced) return;
    
    setIsLoading(true);
    setEnhancedError(null);
    
    try {
      const enhanced = await StopEnhancementService.enhanceStopsForSegment(
        startCity, endCity, segmentDay, safeMaxStops
      );
      setEnhancedStops(enhanced);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setEnhancedError(`Failed to load enhanced stops: ${errorMessage}`);
      console.error('❌ Enhanced selection failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [shouldTriggerEnhanced, startCity, endCity, safeMaxStops, segmentDay]);
  
  useEffect(() => {
    tryEnhancedSelection();
  }, [tryEnhancedSelection]);
  
  // Prioritize recommended stops over legacy system
  const finalStops = useMemo(() => {
    if (hasRecommendedStops) {
      // Convert recommended stops to TripStop format for compatibility with legacy components
      return recommendedStops.map(stop => ({
        ...stop.originalStop,
        relevanceScore: stop.relevanceScore // Add score for debugging
      } as TripStop & { relevanceScore: number }));
    }
    
    return StopsCombiner.combineStops(userRelevantStops, enhancedStops, safeMaxStops);
  }, [userRelevantStops, enhancedStops, safeMaxStops, recommendedStops, hasRecommendedStops]);

  console.log('🎯 EnhancedRecommendedStops ENHANCED final result:', {
    segmentDay,
    route: `${startCity} → ${endCity}`,
    originalStops: userRelevantStops.length,
    enhancedStops: enhancedStops.length,
    recommendedStops: recommendedStops.length,
    hasRecommendedStops,
    safeMaxStops,
    finalStops: finalStops.length,
    isLoading: isLoading || isLoadingRecommended,
    error: error || enhancedError,
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

  // PRIORITY: Use the new RecommendedStopsDisplay for enhanced stops
  if (hasRecommendedStops) {
    return (
      <ErrorBoundary context="RecommendedStopsDisplay">
        <RecommendedStopsDisplay 
          stops={recommendedStops}
          maxDisplay={safeMaxStops}
          showLocation={true}
          compact={false}
        />
      </ErrorBoundary>
    );
  }

  // Fallback to legacy system with enhanced error handling
  return (
    <ErrorBoundary context="EnhancedRecommendedStops">
      <div>
        <h4 className="font-travel font-bold text-route66-vintage-brown mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Recommended Stops ({finalStops.length})
          {(isLoading || isLoadingRecommended) && <span className="text-xs text-gray-500">(searching...)</span>}
          {(error || enhancedError) && <span className="text-xs text-red-500">(error)</span>}
        </h4>
        
        {(error || enhancedError) && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
            {error || enhancedError}
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
                ✨ Enhanced selection found {enhancedStops.length} additional stops (limited to {safeMaxStops})
              </div>
            )}
          </div>
        ) : (isLoading || isLoadingRecommended) ? (
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
