
import { useEffect, useRef, useState, useCallback } from "react";
import { checkScriptsLoaded, initializeJVectorMap, cleanupMap } from "@/utils/mapUtils";
import { route66Towns } from "@/types/route66";
import { toast } from "@/components/ui/use-toast";

export function useRouteMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 10; // Reduced for faster feedback
  const initAttemptRef = useRef(0);

  const initializeMap = useCallback((): boolean => {
    if (!mapRef.current) {
      console.log("❌ Map container not found");
      return false;
    }
    
    if (!checkScriptsLoaded()) {
      console.log(`❌ Required scripts not ready (attempt ${retryCount + 1})`);
      return false;
    }
    
    try {
      // Log current attempt number
      initAttemptRef.current += 1;
      console.log(`Attempting to initialize map (attempt ${initAttemptRef.current})`);
      
      const success = initializeJVectorMap(mapRef.current, route66Towns);
      
      if (success) {
        setIsMapInitialized(true);
        console.log("✅ Map initialized successfully");
        toast({
          title: "Map loaded",
          description: "The Route 66 map has been loaded successfully.",
          variant: "default",
        });
        return true;
      } else {
        console.log(`❌ Map initialization failed (attempt ${initAttemptRef.current})`);
        return false;
      }
    } catch (error) {
      console.error("❌ Error initializing map:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setLoadingError(`Error initializing map: ${errorMessage}`);
      return false;
    }
  }, [retryCount]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const attemptMapInitialization = () => {
      if (initializeMap()) {
        return;
      }
      
      if (retryCount >= maxRetries) {
        setLoadingError(`Failed to load map after ${maxRetries} attempts. Try refreshing the page.`);
        return;
      }
      
      // Retry with exponential backoff, capped at 2 seconds
      const delay = Math.min(500 * Math.pow(1.2, retryCount), 2000);
      console.log(`Scheduling next attempt in ${delay}ms (attempt ${retryCount + 1} of ${maxRetries})`);
      
      timeoutId = setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, delay);
    };
    
    // Only attempt initialization if not already initialized
    if (!isMapInitialized) {
      // Add a small delay before first attempt to ensure DOM is fully loaded
      timeoutId = setTimeout(attemptMapInitialization, 500);
    }
    
    return () => {
      clearTimeout(timeoutId);
      if (isMapInitialized && mapRef.current) {
        cleanupMap(mapRef.current);
      }
    };
  }, [retryCount, isMapInitialized, initializeMap, maxRetries]);

  const handleRetry = () => {
    setLoadingError(null);
    setRetryCount(0);
    initAttemptRef.current = 0;
  };

  return {
    mapRef,
    isMapInitialized,
    loadingError,
    handleRetry
  };
}
