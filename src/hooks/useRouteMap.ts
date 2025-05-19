
import { useEffect, useRef, useState, useCallback } from "react";
import { checkScriptsLoaded, initializeJVectorMap, cleanupMap, ensureMapDataLoaded } from "@/utils/mapUtils";
import { route66Towns } from "@/types/route66";
import { toast } from "@/components/ui/use-toast";

export function useRouteMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 5;

  const initializeMap = useCallback(async () => {
    if (!mapRef.current) {
      console.log("❌ Map container not found");
      return false;
    }
    
    try {
      console.log(`Attempting to initialize map (attempt ${retryCount + 1})`);
      
      // Ensure jQuery is actually available
      if (!window.jQuery) {
        console.log("❌ jQuery not available");
        return false;
      }

      // First ensure map data is loaded
      const mapDataLoaded = await ensureMapDataLoaded();
      if (!mapDataLoaded) {
        console.log("❌ Failed to load map data");
        return false;
      }
      
      // Wait for scripts to be fully loaded
      if (!checkScriptsLoaded()) {
        console.log(`❌ Scripts not fully loaded yet (attempt ${retryCount + 1})`);
        return false;
      }
      
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
      }
      
      return false;
    } catch (error) {
      console.error("❌ Error initializing map:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setLoadingError(`Error initializing map: ${errorMessage}`);
      return false;
    }
  }, [retryCount]);

  useEffect(() => {
    // Always give the browser a moment to load scripts before first attempt
    const initialDelay = setTimeout(() => {
      if (!isMapInitialized) {
        initializeMap().then(success => {
          if (!success) {
            setRetryCount(1); // Start retry counter
          }
        });
      }
    }, 3500); // Increased initial delay further
    
    return () => clearTimeout(initialDelay);
  }, [initializeMap, isMapInitialized]);

  useEffect(() => {
    // Handle retries
    if (retryCount > 0 && !isMapInitialized && retryCount <= maxRetries) {
      const retryDelay = Math.min(2000 * retryCount, 5000); // Increased delay with cap
      
      console.log(`Scheduling retry in ${retryDelay}ms (attempt ${retryCount} of ${maxRetries})`);
      
      const timeoutId = setTimeout(() => {
        initializeMap().then(success => {
          if (!success && retryCount < maxRetries) {
            setRetryCount(prev => prev + 1);
          } else if (!success) {
            setLoadingError(`Failed to load map after ${maxRetries} attempts. Please check your internet connection and try refreshing the page.`);
          }
        });
      }, retryDelay);
      
      return () => clearTimeout(timeoutId);
    }
    
    return undefined;
  }, [retryCount, isMapInitialized, initializeMap, maxRetries]);

  useEffect(() => {
    return () => {
      if (isMapInitialized && mapRef.current) {
        cleanupMap(mapRef.current);
      }
    };
  }, [isMapInitialized]);

  const handleRetry = () => {
    setLoadingError(null);
    setRetryCount(1);
  };

  return {
    mapRef,
    isMapInitialized,
    loadingError,
    handleRetry
  };
}
