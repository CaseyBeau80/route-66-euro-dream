
import { useEffect, useRef, useState, useCallback } from "react";
import { checkScriptsLoaded, initializeJVectorMap, cleanupMap } from "@/utils/mapUtils";
import { route66Towns } from "@/types/route66";
import { toast } from "@/components/ui/use-toast";

export function useRouteMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 5;

  const initializeMap = useCallback(() => {
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
      
      // Give the scripts a moment to fully initialize
      if (window.jQuery && !window.jQuery.fn.vectorMap) {
        console.log("jQuery loaded but vectorMap not available yet");
        return false;
      }
      
      // Wait for scripts to be fully loaded
      if (!checkScriptsLoaded()) {
        console.log(`❌ Scripts not fully loaded yet (attempt ${retryCount + 1})`);
        return false;
      }
      
      // Force create the map object if it doesn't exist
      if (!window.jQuery.fn.vectorMap.maps || Object.keys(window.jQuery.fn.vectorMap.maps).length === 0) {
        console.log("Creating fallback map object");
        window.jQuery.fn.vectorMap.maps = window.jQuery.fn.vectorMap.maps || {};
        window.jQuery.fn.vectorMap.maps['usa'] = {
          width: 959,
          height: 593,
          paths: {
            "ca": { path: "m35.06,153.94c-0.1,4.04 0.4,8.21...", name: "California" },
            "tx": { path: "m359.47,330.97c2.34,-0.11 -0.86,-1.81...", name: "Texas" },
            "il": { path: "m569.75,200.44c-0.29,2.58 4.2,1.83...", name: "Illinois" }
          }
        };
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
        const success = initializeMap();
        if (!success) {
          setRetryCount(1); // Start retry counter
        }
      }
    }, 2500); // Increased initial delay further
    
    return () => clearTimeout(initialDelay);
  }, [initializeMap, isMapInitialized]);

  useEffect(() => {
    // Handle retries
    if (retryCount > 0 && !isMapInitialized && retryCount <= maxRetries) {
      const retryDelay = Math.min(2000 * retryCount, 5000); // Increased delay with cap
      
      console.log(`Scheduling retry in ${retryDelay}ms (attempt ${retryCount} of ${maxRetries})`);
      
      const timeoutId = setTimeout(() => {
        const success = initializeMap();
        if (!success && retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
        } else if (!success) {
          setLoadingError(`Failed to load map after ${maxRetries} attempts. Please check your internet connection and try refreshing the page.`);
        }
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
