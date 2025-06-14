
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherFetchCoordinator } from '../services/WeatherFetchCoordinator';
import { WeatherDataDebugger } from '../WeatherDataDebugger';

interface UseSegmentWeatherHandlersProps {
  segmentEndCity: string;
  segmentDate: Date | null;
  retryCount: number;
  setRetryCount: React.Dispatch<React.SetStateAction<number>>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setWeather: (weather: ForecastWeatherData | null) => void;
}

interface UseSegmentWeatherHandlersReturn {
  fetchWeatherData: () => Promise<void>;
  handleApiKeySet: () => void;
  handleTimeout: () => void;
  handleRetry: () => void;
}

export const useSegmentWeatherHandlers = ({
  segmentEndCity,
  segmentDate,
  retryCount,
  setRetryCount,
  setLoading,
  setError,
  setWeather
}: UseSegmentWeatherHandlersProps): UseSegmentWeatherHandlersReturn => {
  
  // 🚨 FORCE LOG: Handlers hook initialization
  console.log(`🚨 FORCE LOG: useSegmentWeatherHandlers initialized for ${segmentEndCity}`, {
    hasSegmentDate: !!segmentDate,
    segmentDate: segmentDate?.toISOString(),
    retryCount,
    timestamp: new Date().toISOString()
  });

  const fetchWeatherData = React.useCallback(async () => {
    console.log(`🚨 FORCE LOG: *** fetchWeatherData CALLED *** for ${segmentEndCity}`, {
      hasSegmentDate: !!segmentDate,
      segmentDate: segmentDate?.toISOString(),
      retryCount,
      timestamp: new Date().toISOString(),
      callStack: new Error().stack?.split('\n').slice(1, 4)
    });

    if (!segmentDate) {
      console.log(`🚨 FORCE LOG: fetchWeatherData EARLY EXIT - No segment date for ${segmentEndCity}`, {
        reason: 'missing_segment_date',
        timestamp: new Date().toISOString()
      });
      console.warn(`❌ Cannot fetch weather for ${segmentEndCity}: No segment date`);
      setError('Missing trip date - please set a trip start date');
      return;
    }

    console.log(`🚨 FORCE LOG: fetchWeatherData proceeding with WeatherFetchCoordinator for ${segmentEndCity}`, {
      segmentDate: segmentDate.toISOString(),
      retryCount,
      timestamp: new Date().toISOString()
    });

    WeatherDataDebugger.debugWeatherFlow(
      `useSegmentWeatherHandlers.fetchWeatherData [${segmentEndCity}]`,
      {
        segmentDate: segmentDate.toISOString(),
        retryCount,
        hasDate: !!segmentDate
      }
    );

    try {
      console.log(`🚨 FORCE LOG: Calling WeatherFetchCoordinator.fetchWeatherForSegment for ${segmentEndCity}`, {
        timestamp: new Date().toISOString()
      });

      await WeatherFetchCoordinator.fetchWeatherForSegment(
        segmentEndCity,
        segmentDate,
        {
          onLoadingChange: setLoading,
          onError: setError,
          onWeatherSet: setWeather
        }
      );

      console.log(`🚨 FORCE LOG: WeatherFetchCoordinator.fetchWeatherForSegment completed for ${segmentEndCity}`, {
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error(`🚨 FORCE LOG: *** WEATHER FETCH ERROR *** for ${segmentEndCity}:`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      console.error(`❌ Weather fetch failed for ${segmentEndCity}:`, error);
      setError(error instanceof Error ? error.message : 'Weather fetch failed');
      setLoading(false);
    }
  }, [segmentEndCity, segmentDate, retryCount, setLoading, setError, setWeather]);

  const handleApiKeySet = React.useCallback(() => {
    console.log(`🚨 FORCE LOG: handleApiKeySet called for ${segmentEndCity}`, {
      hasSegmentDate: !!segmentDate,
      timestamp: new Date().toISOString()
    });

    WeatherDataDebugger.debugWeatherFlow(
      `useSegmentWeatherHandlers.handleApiKeySet [${segmentEndCity}]`,
      { trigger: 'api_key_set' }
    );
    
    setError(null);
    setRetryCount(0);
    
    // Fetch weather data immediately after API key is set
    if (segmentDate) {
      console.log(`🚨 FORCE LOG: Scheduling weather fetch after API key set for ${segmentEndCity}`, {
        delay: 500,
        timestamp: new Date().toISOString()
      });

      setTimeout(() => {
        console.log(`🚨 FORCE LOG: Executing scheduled weather fetch after API key set for ${segmentEndCity}`, {
          timestamp: new Date().toISOString()
        });
        fetchWeatherData();
      }, 500);
    } else {
      console.log(`🚨 FORCE LOG: No segmentDate available for weather fetch after API key set for ${segmentEndCity}`, {
        timestamp: new Date().toISOString()
      });
    }
  }, [segmentEndCity, segmentDate, fetchWeatherData, setError, setRetryCount]);

  const handleTimeout = React.useCallback(() => {
    console.log(`🚨 FORCE LOG: handleTimeout called for ${segmentEndCity}`, {
      retryCount,
      timestamp: new Date().toISOString()
    });

    WeatherDataDebugger.debugWeatherFlow(
      `useSegmentWeatherHandlers.handleTimeout [${segmentEndCity}]`,
      { retryCount }
    );
    
    setError('Weather request timed out');
    setLoading(false);
  }, [segmentEndCity, retryCount, setError, setLoading]);

  const handleRetry = React.useCallback(() => {
    const newRetryCount = retryCount + 1;
    console.log(`🚨 FORCE LOG: handleRetry called for ${segmentEndCity}`, {
      retryCount,
      newRetryCount,
      timestamp: new Date().toISOString()
    });

    WeatherDataDebugger.debugWeatherFlow(
      `useSegmentWeatherHandlers.handleRetry [${segmentEndCity}]`,
      { retryCount, newRetryCount }
    );
    
    setRetryCount(prev => prev + 1);
    setError(null);
    setWeather(null);
    
    // Retry fetch immediately
    setTimeout(() => {
      console.log(`🚨 FORCE LOG: Executing retry weather fetch for ${segmentEndCity}`, {
        retryCount: newRetryCount,
        timestamp: new Date().toISOString()
      });
      fetchWeatherData();
    }, 100);
  }, [segmentEndCity, retryCount, setRetryCount, setError, setWeather, fetchWeatherData]);

  return {
    fetchWeatherData,
    handleApiKeySet,
    handleTimeout,
    handleRetry
  };
};
