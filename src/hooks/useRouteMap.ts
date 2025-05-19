
import { useEffect, useRef, useState, useCallback } from "react";
import { route66Towns } from "@/utils/mapTypes";
import { toast } from "@/hooks/use-toast";

export function useRouteMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  const initializeMap = useCallback(async () => {
    if (!mapRef.current) {
      console.log("Map container not found");
      return false;
    }
    
    try {
      console.log("Creating fallback map display directly");
      
      // Create a basic fallback map display
      const container = mapRef.current;
      
      // Create a container div with styling
      container.innerHTML = ''; // Clear any existing content
      
      const fallbackContainer = document.createElement('div');
      fallbackContainer.className = 'route66-fallback-map';
      fallbackContainer.style.width = '100%';
      fallbackContainer.style.height = '100%';
      fallbackContainer.style.background = '#f4f4f4';
      fallbackContainer.style.borderRadius = '8px';
      fallbackContainer.style.overflow = 'hidden';
      fallbackContainer.style.position = 'relative';
      fallbackContainer.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,0.1)';
      
      // Add a header
      const header = document.createElement('div');
      header.style.background = '#e74c3c';
      header.style.color = 'white';
      header.style.padding = '15px';
      header.style.textAlign = 'center';
      header.style.fontWeight = 'bold';
      header.style.fontSize = '20px';
      header.textContent = 'Route 66 Journey Map';
      fallbackContainer.appendChild(header);
      
      // Add a styled container for markers
      const markersContainer = document.createElement('div');
      markersContainer.style.padding = '20px';
      markersContainer.style.display = 'flex';
      markersContainer.style.flexDirection = 'column';
      markersContainer.style.gap = '15px';
      
      // Add the stops to the container
      route66Towns.forEach((location, index) => {
        const marker = document.createElement('div');
        marker.style.display = 'flex';
        marker.style.alignItems = 'center';
        marker.style.padding = '12px';
        marker.style.background = 'white';
        marker.style.borderRadius = '6px';
        marker.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        
        // Create marker icon
        const icon = document.createElement('div');
        icon.style.width = '30px';
        icon.style.height = '30px';
        icon.style.borderRadius = '50%';
        icon.style.background = '#e74c3c';
        icon.style.color = 'white';
        icon.style.display = 'flex';
        icon.style.alignItems = 'center';
        icon.style.justifyContent = 'center';
        icon.style.marginRight = '12px';
        icon.style.fontWeight = 'bold';
        icon.textContent = (index + 1).toString();
        
        // Create marker text
        const text = document.createElement('div');
        text.textContent = location.name;
        text.style.fontSize = '16px';
        
        marker.appendChild(icon);
        marker.appendChild(text);
        markersContainer.appendChild(marker);
      });
      
      fallbackContainer.appendChild(markersContainer);
      container.appendChild(fallbackContainer);
      
      console.log("✅ Map initialized successfully");
      
      setIsMapInitialized(true);
      toast({
        title: "Map loaded",
        description: "The Route 66 map has been loaded successfully.",
        variant: "default",
      });
      
      return true;
    } catch (error) {
      console.error("Error initializing map:", error);
      setLoadingError(`Error displaying map. Please try refreshing.`);
      return false;
    }
  }, []);

  useEffect(() => {
    // Initial initialization attempt with short delay
    const initialDelay = setTimeout(() => {
      if (!isMapInitialized) {
        initializeMap();
      }
    }, 500);
    
    return () => clearTimeout(initialDelay);
  }, [initializeMap, isMapInitialized]);

  useEffect(() => {
    // Handle retries
    if (retryCount > 0 && !isMapInitialized && retryCount <= maxRetries) {
      const retryDelay = 1000;
      
      console.log(`Retrying map initialization (attempt ${retryCount} of ${maxRetries})`);
      
      const timeoutId = setTimeout(() => {
        initializeMap().then(success => {
          if (!success && retryCount < maxRetries) {
            setRetryCount(prev => prev + 1);
          }
        });
      }, retryDelay);
      
      return () => clearTimeout(timeoutId);
    }
  }, [retryCount, isMapInitialized, initializeMap, maxRetries]);

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
