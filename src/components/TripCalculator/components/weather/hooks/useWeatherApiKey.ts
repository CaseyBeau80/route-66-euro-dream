
import React from 'react';
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';

export const useWeatherApiKey = (cityName?: string) => {
  const [hasApiKey, setHasApiKey] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(true);

  React.useEffect(() => {
    const checkApiKey = () => {
      console.log(`🔑 useWeatherApiKey: Checking API key availability for ${cityName}`);
      setIsChecking(true);
      
      try {
        const service = EnhancedWeatherService.getInstance();
        service.refreshApiKey(); // Force refresh to ensure we have latest key
        const keyAvailable = service.hasApiKey();
        
        console.log(`🔑 useWeatherApiKey result for ${cityName}:`, {
          hasApiKey: keyAvailable,
          debugInfo: service.getDebugInfo()
        });
        
        setHasApiKey(keyAvailable);
      } catch (error) {
        console.error(`❌ useWeatherApiKey error for ${cityName}:`, error);
        setHasApiKey(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkApiKey();

    // Listen for API key changes in localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes('weather') || e.key?.includes('openweathermap')) {
        console.log(`🔄 useWeatherApiKey: Storage change detected for ${cityName}, rechecking...`);
        setTimeout(checkApiKey, 100); // Small delay to ensure storage is updated
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [cityName]);

  return { hasApiKey, isChecking };
};
