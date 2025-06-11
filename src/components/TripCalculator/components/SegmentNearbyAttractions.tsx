
import React, { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { AttractionSearchStatus } from '../services/attractions/AttractionSearchResult';
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

// CRITICAL: Absolute maximum attractions enforced at module level
const ABSOLUTE_MAX_ATTRACTIONS = 3;
const UI_TIMEOUT_MS = 10000; // 10 seconds
const UI_TIMEOUT_FALLBACK_MESSAGE = "Search took too long and was stopped to prevent infinite loading.";

const SegmentNearbyAttractions: React.FC<SegmentNearbyAttractionsProps> = ({ 
  segment, 
  maxAttractions 
}) => {
  // CRITICAL: Triple-layer enforcement of 3-attraction limit
  const requestedMax = maxAttractions ?? ABSOLUTE_MAX_ATTRACTIONS;
  const enforcedMax = Math.min(requestedMax, ABSOLUTE_MAX_ATTRACTIONS);
  
  console.log('🔍 SegmentNearbyAttractions TRIPLE-ENFORCED limit:', {
    segmentDay: segment.day,
    endCity: segment.endCity,
    requestedMax,
    enforcedMax,
    absoluteMax: ABSOLUTE_MAX_ATTRACTIONS,
    finalMaxAttractions: enforcedMax
  });

  // Enhanced UI timeout fallback handler
  const handleUITimeout = () => {
    console.log(`⏰ UI timeout triggered after ${UI_TIMEOUT_MS}ms for ${segment.endCity}`);
    setSearchResult({
      status: AttractionSearchStatus.TIMEOUT,
      attractions: [],
      message: UI_TIMEOUT_FALLBACK_MESSAGE,
      citySearched: segment.endCity || '',
      stateSearched: ''
    });
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
      enforcedMax
    });
    
    loadAttractions();
  }, [segment?.endCity, segment?.day, enforcedMax, loadAttractions]);
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Nearby Attractions (max {enforcedMax})
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
          Nearby Attractions (max {enforcedMax})
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
          Nearby Attractions (max {enforcedMax})
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
          Nearby Attractions (max {enforcedMax})
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
  
  // CRITICAL: Apply the absolute maximum limit with quadruple safety checks
  const rawAttractions = searchResult.attractions || [];
  const totalAttractions = rawAttractions.length;
  
  // Quadruple enforcement: slice twice to be absolutely sure
  const firstSlice = rawAttractions.slice(0, enforcedMax);
  const attractions = firstSlice.slice(0, ABSOLUTE_MAX_ATTRACTIONS);
  
  const actualCount = attractions.length;
  const hasMoreAttractions = totalAttractions > actualCount;
  const remainingCount = totalAttractions - actualCount;
  
  console.log('🔍 SegmentNearbyAttractions QUADRUPLE-ENFORCED attraction limiting:', {
    totalAttractions,
    enforcedMax,
    absoluteMax: ABSOLUTE_MAX_ATTRACTIONS,
    firstSliceLength: firstSlice.length,
    finalAttractionsLength: actualCount,
    hasMoreAttractions,
    remainingCount,
    segmentDay: segment.day,
    endCity: segment.endCity,
    limitingWorking: actualCount <= ABSOLUTE_MAX_ATTRACTIONS
  });
  
  // Final safety check
  if (actualCount > ABSOLUTE_MAX_ATTRACTIONS) {
    console.error('🚨 CRITICAL: Attraction limit breach detected!', {
      actualCount,
      absoluteMax: ABSOLUTE_MAX_ATTRACTIONS,
      segment: segment.day,
      endCity: segment.endCity
    });
    
    const emergencySlice = attractions.slice(0, ABSOLUTE_MAX_ATTRACTIONS);
    return (
      <div className="space-y-3">
        <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Nearby Attractions ({emergencySlice.length} of {totalAttractions})
        </h4>
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">⚠️ Emergency limit enforcement applied</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Nearby Attractions ({hasMoreAttractions ? `${actualCount} of ${totalAttractions}` : actualCount} • max {ABSOLUTE_MAX_ATTRACTIONS})
        {retryCount > 0 && (
          <span className="text-xs text-gray-500">(retry {retryCount})</span>
        )}
      </h4>
      
      <div className="space-y-2">
        {attractions.map((attraction, index) => (
          <ErrorBoundary key={`${attraction.id}-${index}`} context={`AttractionCard-${index}`}>
            <AttractionCard attraction={attraction} />
          </ErrorBoundary>
        ))}
      </div>
      
      {hasMoreAttractions && (
        <div className="text-xs text-gray-600 italic text-center p-2 bg-yellow-50 rounded border border-yellow-200">
          🚫 Showing only {actualCount} of {totalAttractions} attractions (limited to max {ABSOLUTE_MAX_ATTRACTIONS})
          <div className="text-xs text-gray-500 mt-1">
            + {remainingCount} more attraction{remainingCount !== 1 ? 's' : ''} nearby
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
