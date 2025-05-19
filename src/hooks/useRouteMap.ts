
import { useEffect, useRef, useState, useCallback } from "react";
import { ensureMapDataLoaded } from "@/utils/mapDataUtils";
import { initializeJVectorMap, cleanupMap, checkScriptsLoaded } from "@/utils/mapUtils";
import { route66Towns } from "@/utils/mapTypes";
import { toast } from "@/hooks/use-toast";
import { ensureJvmObjectExists } from "@/utils/jvmObjectHandler";

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
      
      // Check for jQuery first - most basic requirement
      if (typeof window.jQuery === 'undefined') {
        console.log("❌ jQuery not available yet");
        return false;
      }

      // Ensure jvm object exists
      ensureJvmObjectExists();

      // First ensure map data is loaded
      const mapDataLoaded = await ensureMapDataLoaded();
      if (!mapDataLoaded) {
        console.log("❌ Failed to load map data, will retry");
        return false;
      }
      
      // Wait for scripts to be fully loaded
      if (!checkScriptsLoaded()) {
        console.log(`❌ Scripts not fully loaded yet (attempt ${retryCount + 1})`);
        return false;
      }
      
      // Try to initialize the map with our data
      let success = false;
      
      try {
        // Try the normal vector map initialization
        success = initializeJVectorMap(mapRef.current, route66Towns);
      } catch (error) {
        console.error("Error using standard map initialization:", error);
        
        // If it fails, we'll create the fallback display directly
        try {
          console.log("Creating fallback display directly");
          
          // Import the fallback renderer and create the display
          const { createFallbackMapDisplay } = await import('@/utils/mapFallbackRenderer');
          createFallbackMapDisplay(mapRef.current, route66Towns);
          
          success = true;
        } catch (fallbackError) {
          console.error("Even fallback display creation failed:", fallbackError);
          throw fallbackError;
        }
      }
      
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
    // Initial delay to ensure scripts have a chance to load
    const initialDelay = setTimeout(() => {
      if (!isMapInitialized) {
        initializeMap().then(success => {
          if (!success) {
            setRetryCount(1); // Start retry counter
          }
        });
      }
    }, 2000);
    
    return () => clearTimeout(initialDelay);
  }, [initializeMap, isMapInitialized]);

  useEffect(() => {
    // Handle retries
    if (retryCount > 0 && !isMapInitialized && retryCount <= maxRetries) {
      const retryDelay = Math.min(2000 * retryCount, 5000);
      
      console.log(`Scheduling retry in ${retryDelay}ms (attempt ${retryCount} of ${maxRetries})`);
      
      const timeoutId = setTimeout(() => {
        initializeMap().then(success => {
          if (!success && retryCount < maxRetries) {
            setRetryCount(prev => prev + 1);
          } else if (!success) {
            // On final attempt, try direct fallback rendering
            try {
              if (mapRef.current) {
                import('@/utils/mapFallbackRenderer').then(({ createFallbackMapDisplay }) => {
                  createFallbackMapDisplay(mapRef.current!, route66Towns);
                  setIsMapInitialized(true);
                  console.log("✅ Fallback map display created on final attempt");
                  toast({
                    title: "Map loaded",
                    description: "A simplified Route 66 map has been loaded.",
                    variant: "default",
                  });
                });
              }
            } catch (error) {
              console.error("Final fallback attempt failed:", error);
              setLoadingError(`Failed to load map after ${maxRetries} attempts. Please check your internet connection and try refreshing the page.`);
            }
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
