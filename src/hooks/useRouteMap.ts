
import { useEffect, useRef, useState } from "react";
import { checkScriptsLoaded, initializeJVectorMap, cleanupMap } from "@/utils/mapUtils";
import { route66Towns } from "@/types/route66";

export function useRouteMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const initializeMap = (): boolean => {
    if (!mapRef.current) {
      console.log("❌ Map container not found");
      return false;
    }
    
    if (!checkScriptsLoaded()) {
      console.log(`❌ Required scripts not ready (attempt ${retryCount + 1})`);
      if (retryCount > 20) {
        setLoadingError("Failed to load map scripts. Please try refreshing the page.");
        return false;
      }
      setRetryCount(prev => prev + 1);
      return false;
    }
    
    try {
      const success = initializeJVectorMap(mapRef.current, route66Towns);
      
      if (success) {
        setIsMapInitialized(true);
        console.log("✅ Map initialized successfully");
        return true;
      } else {
        setLoadingError("Map data not loaded. Please try refreshing the page.");
        return false;
      }
    } catch (error) {
      console.error("❌ Error initializing map:", error);
      setLoadingError(`Error initializing map: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  };

  useEffect(() => {
    const attemptMapInitialization = () => {
      if (initializeMap()) {
        return;
      }
      
      // Retry with exponential backoff
      const timeoutId = setTimeout(() => {
        if (retryCount < 20) {
          attemptMapInitialization();
        }
      }, Math.min(100 * Math.pow(1.5, retryCount), 2000));
      
      return () => clearTimeout(timeoutId);
    };
    
    // Small delay to ensure scripts are loaded
    const initialDelay = setTimeout(() => {
      attemptMapInitialization();
    }, 500);
    
    return () => {
      clearTimeout(initialDelay);
      if (isMapInitialized && mapRef.current) {
        cleanupMap(mapRef.current);
      }
    };
  }, [retryCount, isMapInitialized]);

  const handleRetry = () => {
    setLoadingError(null);
    setRetryCount(0);
    // Force a reload of the scripts
    window.location.reload();
  };

  return {
    mapRef,
    isMapInitialized,
    loadingError,
    handleRetry
  };
}
