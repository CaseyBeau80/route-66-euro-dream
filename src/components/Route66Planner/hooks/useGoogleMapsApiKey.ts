
import { useState, useEffect } from 'react';
import { GoogleDistanceMatrixService } from '../services/GoogleDistanceMatrixService';

export const useGoogleMapsApiKey = () => {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkApiKey = async () => {
    setIsLoading(true);
    try {
      const available = await GoogleDistanceMatrixService.isAvailable();
      setHasApiKey(available);
    } catch (error) {
      console.error('Error checking API key:', error);
      setHasApiKey(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkApiKey();
  }, []);

  const refreshApiKey = () => {
    checkApiKey();
  };

  return {
    hasApiKey,
    isLoading,
    refreshApiKey
  };
};
