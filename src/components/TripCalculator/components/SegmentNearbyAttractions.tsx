
import React, { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { AttractionSearchStatus } from '../services/attractions/AttractionSearchResult';
import { AttractionLimitingService } from '../services/attractions/AttractionLimitingService';
import { useUITimeout } from '../hooks/useUITimeout';
import { useAttractionLoader } from './attractions/useAttractionLoader';
import AttractionErrorDisplay from './attractions/AttractionErrorDisplay';
import AttractionLoadingDisplay from './attractions/AttractionLoadingDisplay';
import AttractionEmptyDisplay from './attractions/AttractionEmptyDisplay';
import AttractionCard from './attractions/AttractionCard';
import ErrorBoundary from './ErrorBoundary';

interface SegmentNearbyAttractionsProps {
  segment: DailySegment;
  maxAttractions?: number;
}

const UI_TIMEOUT_MS = 10000; // 10 seconds

const SegmentNearbyAttractions: React.FC<SegmentNearbyAttractionsProps> = ({ 
  segment, 
  maxAttractions 
}) => {
  const context = `SegmentNearbyAttractions-Day${segment.day}-${segment.endCity}`;
  
  console.log('🔍 SegmentNearbyAttractions using centralized limiting:', {
    segmentDay: segment.day,
    endCity: segment.endCity,
    requestedMax: maxAttractions,
    context
  });

  // Enhanced UI timeout fallback handler
  const handleUITimeout = () => {
    console.log(`⏰ UI timeout triggered after ${UI_TIMEOUT_MS}ms for ${segment.endCity}`);
    // Let the hook handle timeout internally - don't try to set state directly
  };

  const { clearUITimeout, getRemainingTime } = useUITimeout({
    timeoutMs: UI_TIMEOUT_MS,
    onTimeout: handleUITimeout,
    isActive: false // Will be controlled by the loader hook
  });

  const {
    searchResult,
    isLoading,
    retryCount,
    searchStartTime,
    debugInfo,
    loadAttractions,
    handleDebugInfo
  } = useAttractionLoader({
    segment,
    onUITimeout: handleUITimeout,
    clearUITimeout
  });

  useEffect(() => {
    console.log(`🎯 SegmentNearbyAttractions effect triggered:`, {
      endCity: segment?.endCity,
      day: segment?.day,
      context
    });
    
    loadAttractions();
  }, [segment?.endCity, segment?.day, loadAttractions]);
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Nearby Attractions (max {AttractionLimitingService.getMaxAttractions()})
        </h4>
        <AttractionLoadingDisplay 
          cityName={segment.endCity || 'destination'} 
          searchStartTime={searchStartTime}
          remainingTime={getRemainingTime()}
        />
      </div>
    );
  }
  
  if (!searchResult) {
    return (
      <div className="space-y-3">
        <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Nearby Attractions (max {AttractionLimitingService.getMaxAttractions()})
        </h4>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">No search results available</p>
        </div>
      </div>
    );
  }

  // Handle error states
  if (searchResult.status === AttractionSearchStatus.ERROR || 
      searchResult.status === AttractionSearchStatus.TIMEOUT ||
      searchResult.status === AttractionSearchStatus.CITY_NOT_FOUND) {
    return (
      <div className="space-y-3">
        <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Nearby Attractions (max {AttractionLimitingService.getMaxAttractions()})
        </h4>
        <AttractionErrorDisplay
          searchResult={searchResult}
          onRetry={() => loadAttractions(true)}
          onDebug={handleDebugInfo}
        />
        
        {debugInfo && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-xs font-mono text-gray-600">
              <div className="font-bold mb-2">Debug Information:</div>
              <pre className="whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Handle no attractions found
  if (searchResult.status === AttractionSearchStatus.NO_ATTRACTIONS) {
    return (
      <div className="space-y-3">
        <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Nearby Attractions (max {AttractionLimitingService.getMaxAttractions()})
        </h4>
        <AttractionEmptyDisplay
          searchResult={searchResult}
          onDebug={handleDebugInfo}
        />
        
        {debugInfo && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-xs font-mono text-gray-600">
              <div className="font-bold mb-2">Debug Information:</div>
              <pre className="whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // CRITICAL: Apply centralized attraction limiting
  const rawAttractions = searchResult.attractions || [];
  const limitResult = AttractionLimitingService.limitAttractions(
    rawAttractions, 
    context,
    maxAttractions
  );
  
  // Final validation check
  if (!AttractionLimitingService.validateAttractionLimit(limitResult.limitedAttractions, context)) {
    console.error('🚨 CRITICAL: Post-limiting validation failed!', {
      context,
      limitedCount: limitResult.limitedAttractions.length,
      maxAllowed: AttractionLimitingService.getMaxAttractions()
    });
    
    return (
      <div className="space-y-3">
        <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Nearby Attractions ({AttractionLimitingService.getMaxAttractions()})
        </h4>
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">⚠️ Attraction limit enforcement failure detected</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Nearby Attractions ({limitResult.hasMoreAttractions ? `${limitResult.limitedAttractions.length} of ${limitResult.totalAttractions}` : limitResult.limitedAttractions.length} • max {limitResult.limitApplied})
        {retryCount > 0 && (
          <span className="text-xs text-gray-500">(retry {retryCount})</span>
        )}
      </h4>
      
      <div className="space-y-2">
        {limitResult.limitedAttractions.map((attraction, index) => (
          <ErrorBoundary key={`${attraction.id}-${index}`} context={`AttractionCard-${index}`}>
            <AttractionCard attraction={attraction} />
          </ErrorBoundary>
        ))}
      </div>
      
      {limitResult.hasMoreAttractions && (
        <div className="text-xs text-gray-600 italic text-center p-2 bg-yellow-50 rounded border border-yellow-200">
          🚫 Showing only {limitResult.limitedAttractions.length} of {limitResult.totalAttractions} attractions (limited to max {limitResult.limitApplied})
          <div className="text-xs text-gray-500 mt-1">
            + {limitResult.remainingCount} more attraction{limitResult.remainingCount !== 1 ? 's' : ''} nearby
          </div>
        </div>
      )}
      
      <div className="text-xs text-blue-600 italic text-center p-2 bg-blue-50 rounded border border-blue-200">
        ✨ {searchResult.message}
      </div>
    </div>
  );
};

export default SegmentNearbyAttractions;
