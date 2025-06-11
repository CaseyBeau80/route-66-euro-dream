
import { useState, useCallback } from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { AttractionSearchResult, AttractionSearchStatus } from '../../services/attractions/AttractionSearchResult';
import { GeographicAttractionService } from '../../services/attractions/GeographicAttractionService';
import { getDestinationCityWithState } from '../../utils/DestinationUtils';

interface UseAttractionLoaderProps {
  segment: DailySegment;
  onUITimeout: () => void;
  clearUITimeout: () => void;
}

export const useAttractionLoader = ({
  segment,
  onUITimeout,
  clearUITimeout
}: UseAttractionLoaderProps) => {
  const [searchResult, setSearchResult] = useState<AttractionSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [searchStartTime, setSearchStartTime] = useState(0);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const loadAttractions = useCallback(async (isRetry: boolean = false) => {
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
        40
      );
      
      console.log(`📊 Search completed for "${segment.endCity}":`, {
        status: result.status,
        attractionsFound: result.attractions.length,
        message: result.message,
        attemptNumber: retryCount + 1
      });
      
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
  }, [segment?.endCity, segment?.day, clearUITimeout, retryCount]);

  const handleDebugInfo = useCallback(async () => {
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
  }, [segment?.endCity]);

  return {
    searchResult,
    isLoading,
    retryCount,
    searchStartTime,
    debugInfo,
    loadAttractions,
    handleDebugInfo
  };
};
