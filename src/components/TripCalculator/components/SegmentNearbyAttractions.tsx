
import React, { useEffect, useState, useCallback } from 'react';
import { MapPin, Clock, AlertTriangle, RefreshCw, Info } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { GeographicAttractionService, NearbyAttraction } from '../services/attractions/GeographicAttractionService';
import { AttractionSearchResult, AttractionSearchStatus } from '../services/attractions/AttractionSearchResult';
import { getDestinationCityWithState } from '../utils/DestinationUtils';
import { useUITimeout } from '../hooks/useUITimeout';
import ErrorBoundary from './ErrorBoundary';

interface SegmentNearbyAttractionsProps {
  segment: DailySegment;
  maxAttractions?: number;
}

// UI timeout configuration - reduced to prevent infinite loading
const UI_TIMEOUT_MS = 10000; // 10 seconds
const UI_TIMEOUT_FALLBACK_MESSAGE = "Search took too long and was stopped to prevent infinite loading.";

// Enhanced error display component
const EnhancedErrorDisplay: React.FC<{ 
  searchResult: AttractionSearchResult;
  onRetry: () => void;
  onDebug?: () => void;
}> = ({ searchResult, onRetry, onDebug }) => {
  const getErrorColor = () => {
    switch (searchResult.status) {
      case AttractionSearchStatus.CITY_NOT_FOUND:
        return 'yellow';
      case AttractionSearchStatus.TIMEOUT:
        return 'orange';
      case AttractionSearchStatus.ERROR:
        return 'red';
      default:
        return 'red';
    }
  };

  const color = getErrorColor();

  return (
    <div className={`p-3 bg-${color}-50 border border-${color}-200 rounded-lg`}>
      <div className="flex items-start gap-2 mb-2">
        <AlertTriangle className={`h-4 w-4 text-${color}-600 mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          <p className={`text-sm text-${color}-700 font-medium`}>
            {searchResult.status === AttractionSearchStatus.CITY_NOT_FOUND && 'City Not Found'}
            {searchResult.status === AttractionSearchStatus.TIMEOUT && 'Search Timed Out'}
            {searchResult.status === AttractionSearchStatus.ERROR && 'Search Failed'}
          </p>
          <p className={`text-xs text-${color}-600 mt-1`}>{searchResult.message}</p>
          <p className={`text-xs text-${color}-500 mt-1`}>
            Searching: {searchResult.citySearched}, {searchResult.stateSearched}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onRetry}
          className={`flex items-center gap-1 text-xs bg-${color}-100 hover:bg-${color}-200 text-${color}-700 px-2 py-1 rounded transition-colors`}
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
        {onDebug && (
          <button
            onClick={onDebug}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
          >
            Debug Info
          </button>
        )}
      </div>
    </div>
  );
};

// Enhanced loading component with better timeout indication
const EnhancedLoadingDisplay: React.FC<{ 
  cityName: string; 
  searchStartTime: number;
  remainingTime: number;
}> = ({ cityName, searchStartTime, remainingTime }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - searchStartTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [searchStartTime]);

  const isLongRunning = elapsedTime > 3;
  const remainingSeconds = Math.ceil(remainingTime / 1000);

  return (
    <div className={`flex items-center justify-center p-4 rounded-lg border ${
      isLongRunning ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mr-3"></div>
      <div className="text-sm">
        <span className="text-gray-600">Finding attractions near {cityName}...</span>
        <div className="text-xs text-gray-500 mt-1">
          {elapsedTime}s elapsed
          {remainingSeconds > 0 && <span className="ml-2">({remainingSeconds}s remaining)</span>}
          {isLongRunning && <span className="text-yellow-600 ml-2">⚠️ Taking longer than expected</span>}
        </div>
      </div>
    </div>
  );
};

// No attractions found display
const NoAttractionsDisplay: React.FC<{ 
  searchResult: AttractionSearchResult;
  onDebug?: () => void;
}> = ({ searchResult, onDebug }) => (
  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
    <div className="flex items-start gap-2">
      <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-blue-700 font-medium">No Attractions Found</p>
        <p className="text-xs text-blue-600 mt-1">{searchResult.message}</p>
      </div>
    </div>
    {onDebug && (
      <button
        onClick={onDebug}
        className="text-xs text-blue-600 hover:text-blue-800 mt-2"
      >
        Debug city search
      </button>
    )}
  </div>
);

const AttractionCard: React.FC<{ attraction: NearbyAttraction }> = ({ attraction }) => {
  const icon = GeographicAttractionService.getAttractionIcon(attraction);
  const typeLabel = GeographicAttractionService.getAttractionTypeLabel(attraction);
  
  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="text-xl">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-800 truncate">
          {attraction.name}
        </div>
        <div className="text-sm text-gray-600 line-clamp-2">
          {attraction.description}
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
            {typeLabel}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {attraction.distanceFromCity.toFixed(1)} mi away
          </span>
        </div>
      </div>
    </div>
  );
};

const SegmentNearbyAttractions: React.FC<SegmentNearbyAttractionsProps> = ({ 
  segment, 
  maxAttractions = 3 
}) => {
  // DEBUG: Add console logging to track component rendering
  console.log('🔍 SegmentNearbyAttractions render DEBUG:', {
    segmentDay: segment.day,
    endCity: segment.endCity,
    maxAttractions,
    componentKey: `SegmentNearbyAttractions-${segment.day}-${segment.endCity}`
  });

  const [searchResult, setSearchResult] = useState<AttractionSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [searchStartTime, setSearchStartTime] = useState(0);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Enhanced UI timeout fallback handler
  const handleUITimeout = useCallback(() => {
    console.log(`⏰ UI timeout triggered after ${UI_TIMEOUT_MS}ms for ${segment.endCity}`);
    setIsLoading(false);
    setSearchResult({
      status: AttractionSearchStatus.TIMEOUT,
      attractions: [],
      message: UI_TIMEOUT_FALLBACK_MESSAGE,
      citySearched: segment.endCity || '',
      stateSearched: ''
    });
  }, [segment.endCity]);

  // Set up enhanced UI timeout with remaining time tracking
  const { clearUITimeout, getRemainingTime } = useUITimeout({
    timeoutMs: UI_TIMEOUT_MS,
    onTimeout: handleUITimeout,
    isActive: isLoading
  });

  const loadAttractions = async (isRetry: boolean = false) => {
    if (!segment?.endCity) {
      console.warn('⚠️ No endCity provided for segment:', segment);
      return;
    }
    
    console.log(`🚀 Starting attraction search for "${segment.endCity}" (Day ${segment.day})`);
    
    setIsLoading(true);
    setSearchResult(null);
    setSearchStartTime(Date.now());
    
    if (isRetry) {
      setRetryCount(prev => prev + 1);
      console.log(`🔄 Retry attempt ${retryCount + 1} for "${segment.endCity}"`);
    } else {
      setRetryCount(0);
    }

    try {
      // Extract city and state from endCity with enhanced logging
      const { city, state } = getDestinationCityWithState(segment.endCity);
      
      console.log(`🔍 Parsed destination:`, {
        original: segment.endCity,
        city,
        state,
        attemptNumber: retryCount + 1
      });
      
      const result = await GeographicAttractionService.findAttractionsNearCity(
        city, 
        state, 
        40 // 40 mile radius
      );
      
      console.log(`📊 Search completed for "${segment.endCity}":`, {
        status: result.status,
        attractionsFound: result.attractions.length,
        message: result.message,
        attemptNumber: retryCount + 1
      });
      
      // Clear UI timeout since we got a response
      clearUITimeout();
      setSearchResult(result);
      
    } catch (error) {
      console.error(`❌ Error loading attractions for "${segment.endCity}":`, error);
      clearUITimeout();
      setSearchResult({
        status: AttractionSearchStatus.ERROR,
        attractions: [],
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        citySearched: segment.endCity,
        stateSearched: ''
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDebugInfo = async () => {
    if (!segment?.endCity) return;
    
    console.log(`🔍 Getting debug info for "${segment.endCity}"`);
    
    const { city, state } = getDestinationCityWithState(segment.endCity);
    try {
      const debug = await GeographicAttractionService.debugCitySearch(city, state);
      setDebugInfo(debug);
      console.log('🔍 Debug info for city search:', debug);
    } catch (error) {
      console.error('❌ Error getting debug info:', error);
    }
  };

  // Enhanced effect with better dependency management
  useEffect(() => {
    console.log(`🎯 SegmentNearbyAttractions effect triggered:`, {
      endCity: segment?.endCity,
      day: segment?.day,
      maxAttractions
    });
    
    loadAttractions();
  }, [segment?.endCity, segment?.day, maxAttractions]);
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Nearby Attractions
        </h4>
        <EnhancedLoadingDisplay 
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
          Nearby Attractions
        </h4>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">No search results available</p>
        </div>
      </div>
    );
  }

  // Handle error states with enhanced debugging
  if (searchResult.status === AttractionSearchStatus.ERROR || 
      searchResult.status === AttractionSearchStatus.TIMEOUT ||
      searchResult.status === AttractionSearchStatus.CITY_NOT_FOUND) {
    return (
      <div className="space-y-3">
        <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Nearby Attractions
        </h4>
        <EnhancedErrorDisplay
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
          Nearby Attractions
        </h4>
        <NoAttractionsDisplay
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
  
  // CRITICAL: Apply the maxAttractions limit strictly
  const attractions = searchResult.attractions.slice(0, maxAttractions);
  const totalAttractions = searchResult.attractions.length;
  const hasMoreAttractions = totalAttractions > maxAttractions;
  const remainingCount = totalAttractions - maxAttractions;
  
  // DEBUG: Log the attraction limiting
  console.log('🔍 SegmentNearbyAttractions attraction limiting DEBUG:', {
    totalAttractions,
    maxAttractions,
    attractionsToShow: attractions.length,
    hasMoreAttractions,
    remainingCount,
    segmentDay: segment.day,
    endCity: segment.endCity
  });
  
  return (
    <div className="space-y-3">
      <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Nearby Attractions ({hasMoreAttractions ? `${attractions.length} of ${totalAttractions}` : attractions.length})
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
        <div className="text-xs text-gray-600 italic text-center p-2 bg-gray-50 rounded border border-gray-200">
          + {remainingCount} more attraction{remainingCount !== 1 ? 's' : ''} nearby
        </div>
      )}
      
      <div className="text-xs text-blue-600 italic text-center p-2 bg-blue-50 rounded border border-blue-200">
        ✨ {searchResult.message}
      </div>
    </div>
  );
};

export default SegmentNearbyAttractions;
