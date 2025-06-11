
import React, { useEffect, useState } from 'react';
import { MapPin, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { GeographicAttractionService, NearbyAttraction } from '../services/attractions/GeographicAttractionService';
import { getDestinationCityWithState } from '../utils/DestinationUtils';
import ErrorBoundary from './ErrorBoundary';

interface SegmentNearbyAttractionsProps {
  segment: DailySegment;
  maxAttractions?: number;
}

// Enhanced error display component
const EnhancedErrorDisplay: React.FC<{ 
  error: string; 
  cityName: string; 
  onRetry: () => void;
  onDebug?: () => void;
}> = ({ error, cityName, onRetry, onDebug }) => (
  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
    <div className="flex items-start gap-2 mb-2">
      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-red-700 font-medium">Unable to load attractions</p>
        <p className="text-xs text-red-600 mt-1">{error}</p>
        <p className="text-xs text-red-500 mt-1">Searching near: {cityName}</p>
      </div>
    </div>
    <div className="flex gap-2">
      <button
        onClick={onRetry}
        className="flex items-center gap-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded transition-colors"
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

// Enhanced loading component with timeout indicator
const EnhancedLoadingDisplay: React.FC<{ 
  cityName: string; 
  timeoutWarning?: boolean;
}> = ({ cityName, timeoutWarning = false }) => (
  <div className={`flex items-center justify-center p-4 rounded-lg border ${
    timeoutWarning ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
  }`}>
    <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mr-3"></div>
    <div className="text-sm">
      <span className="text-gray-600">Finding attractions near {cityName}...</span>
      {timeoutWarning && (
        <div className="text-xs text-yellow-600 mt-1">
          ⚠️ This is taking longer than expected
        </div>
      )}
    </div>
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
  maxAttractions = 4 
}) => {
  const [attractions, setAttractions] = useState<NearbyAttraction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const loadAttractions = async (isRetry: boolean = false) => {
    if (!segment?.endCity) return;
    
    setIsLoading(true);
    setError(null);
    setShowTimeoutWarning(false);
    
    if (isRetry) {
      setRetryCount(prev => prev + 1);
    }

    // Show timeout warning after 5 seconds
    const timeoutWarningTimer = setTimeout(() => {
      setShowTimeoutWarning(true);
    }, 5000);

    try {
      // Extract city and state from endCity
      const { city, state } = getDestinationCityWithState(segment.endCity);
      
      console.log(`🎯 Loading attractions near ${city}, ${state} for segment ${segment.day} (attempt ${retryCount + 1})`);
      
      const nearbyAttractions = await GeographicAttractionService.findAttractionsNearCity(
        city, 
        state, 
        40 // 40 mile radius
      );
      
      clearTimeout(timeoutWarningTimer);
      setAttractions(nearbyAttractions.slice(0, maxAttractions));
      setShowTimeoutWarning(false);
      
    } catch (error) {
      clearTimeout(timeoutWarningTimer);
      console.error('❌ Error loading attractions:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load nearby attractions';
      setError(errorMessage);
      setShowTimeoutWarning(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDebugInfo = async () => {
    if (!segment?.endCity) return;
    
    const { city, state } = getDestinationCityWithState(segment.endCity);
    try {
      const debug = await GeographicAttractionService.debugCitySearch(city, state);
      setDebugInfo(debug);
      console.log('🔍 Debug info for city search:', debug);
    } catch (error) {
      console.error('❌ Error getting debug info:', error);
    }
  };
  
  useEffect(() => {
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
          timeoutWarning={showTimeoutWarning}
        />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="space-y-3">
        <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Nearby Attractions
        </h4>
        <EnhancedErrorDisplay
          error={error}
          cityName={segment.endCity || 'destination'}
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
  
  if (attractions.length === 0) {
    return (
      <div className="space-y-3">
        <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Nearby Attractions
        </h4>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">
            No specific attractions found near {segment.endCity}
          </p>
          <button
            onClick={handleDebugInfo}
            className="text-xs text-blue-600 hover:text-blue-800 mt-1"
          >
            Debug city search
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Nearby Attractions ({attractions.length})
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
      
      {attractions.length > 0 && (
        <div className="text-xs text-blue-600 italic text-center p-2 bg-blue-50 rounded border border-blue-200">
          ✨ Attractions within 40 miles of {segment.endCity}
        </div>
      )}
    </div>
  );
};

export default SegmentNearbyAttractions;
