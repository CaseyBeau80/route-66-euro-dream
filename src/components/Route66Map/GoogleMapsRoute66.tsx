import React, { useState, useEffect, useCallback } from 'react';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { useSupabaseRoute66 } from './hooks/useSupabaseRoute66';
import MapLoadError from './components/MapLoadError';
import MapLoadingIndicator from './components/MapLoading';
import MapOverlaysContainer from './components/MapOverlaysContainer';
import MapCore from './components/MapCore';
import { useMapBounds } from './components/MapBounds';
import { useMapEventHandlers } from './components/MapEventHandlers';
import { useRouteStatistics } from './hooks/useRouteStatistics';
import { useWaypointManagement } from './hooks/useWaypointManagement';
import type { Route66Waypoint } from './types/supabaseTypes';

interface GoogleMapsRoute66Props {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
  onClearSelection: () => void;
}

const GoogleMapsRoute66: React.FC<GoogleMapsRoute66Props> = ({ 
  selectedState,
  onStateClick,
  onClearSelection
}: GoogleMapsRoute66Props) => {
  const {
    isLoaded,
    loadError,
    activeMarker,
    currentZoom,
    isDragging,
    mapRef,
    handleMarkerClick,
    handleMapClick,
    setCurrentZoom,
    setIsDragging
  } = useGoogleMaps();

  const { waypoints, isLoading: waypointsLoading, error: waypointsError } = useSupabaseRoute66();
  
  const mapEventHandlers = useMapEventHandlers({ 
    isDragging, 
    selectedState, 
    onClearSelection 
  });

  const mapBounds = useMapBounds({
    onMapLoad: (map: google.maps.Map) => {
      console.log('🗺️ Map loaded and bounds initialized');
    },
    setCurrentZoom,
    setIsDragging,
    mapRef
  });

  const { showRouteStats, setShowRouteStats } = useRouteStatistics({
    mapInitialized: true,
    isMapReady: mapEventHandlers.isMapReady
  });

  const { visibleWaypoints, handleDestinationClick, handleAttractionClick } = useWaypointManagement({
    waypoints,
    selectedState
  });

  // Enhanced mapRef stability tracking
  const [mapRefStabilityCounter, setMapRefStabilityCounter] = useState(0);
  const [isMapRefStable, setIsMapRefStable] = useState(false);

  // Track mapRef changes and stability
  useEffect(() => {
    const hasStableMap = !!(
      mapRef.current && 
      typeof mapRef.current.getZoom === 'function' &&
      typeof mapRef.current.setZoom === 'function' &&
      mapEventHandlers.isMapReady
    );

    setIsMapRefStable(hasStableMap);
    
    if (mapRef.current) {
      setMapRefStabilityCounter(prev => prev + 1);
    }

    console.log('🗺️ GoogleMapsRoute66 mapRef stability check:', {
      hasMapRef: !!mapRef.current,
      hasZoomMethods: !!(mapRef.current && typeof mapRef.current.getZoom === 'function'),
      isMapReady: mapEventHandlers.isMapReady,
      isMapRefStable: hasStableMap,
      stabilityCounter: mapRefStabilityCounter,
      currentZoom: mapRef.current?.getZoom()
    });
  }, [mapRef.current, mapEventHandlers.isMapReady]);

  // Enhanced cleanup with comprehensive overlay error handling
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        console.log('🧹 GoogleMapsRoute66: Starting comprehensive overlay cleanup');
        
        try {
          const mapInstance = mapRef.current as any;
          
          // Enhanced overlay cleanup with type checking
          if (mapInstance.overlayMapTypes) {
            console.log('🔍 Inspecting overlay map types before cleanup');
            
            // Log overlay types for debugging
            for (let i = 0; i < mapInstance.overlayMapTypes.getLength(); i++) {
              try {
                const overlay = mapInstance.overlayMapTypes.getAt(i);
                console.log(`🔍 Overlay ${i}:`, {
                  type: typeof overlay,
                  hasRemove: typeof overlay?.remove === 'function',
                  hasSetMap: typeof overlay?.setMap === 'function',
                  constructor: overlay?.constructor?.name
                });
              } catch (inspectionError) {
                console.warn(`⚠️ Error inspecting overlay ${i}:`, inspectionError);
              }
            }
            
            // Safe overlay removal with multiple strategies
            const overlayCount = mapInstance.overlayMapTypes.getLength();
            console.log(`🧹 Attempting to clean ${overlayCount} overlays`);
            
            for (let i = overlayCount - 1; i >= 0; i--) {
              try {
                const overlay = mapInstance.overlayMapTypes.getAt(i);
                console.log(`🧹 Cleaning overlay ${i}`);
                
                if (overlay) {
                  // Strategy 1: Try overlay.remove() if available
                  if (typeof overlay.remove === 'function') {
                    console.log(`🧹 Using overlay.remove() for overlay ${i}`);
                    overlay.remove();
                  }
                  // Strategy 2: Try overlay.setMap(null) if available
                  else if (typeof overlay.setMap === 'function') {
                    console.log(`🧹 Using overlay.setMap(null) for overlay ${i}`);
                    overlay.setMap(null);
                  }
                  // Strategy 3: Remove from overlayMapTypes collection
                  else {
                    console.log(`🧹 Removing overlay ${i} from collection`);
                    mapInstance.overlayMapTypes.removeAt(i);
                  }
                }
              } catch (overlayError) {
                console.error(`❌ Error cleaning overlay ${i}:`, overlayError);
                
                // Fallback: try to remove from collection
                try {
                  mapInstance.overlayMapTypes.removeAt(i);
                  console.log(`✅ Fallback removal successful for overlay ${i}`);
                } catch (fallbackError) {
                  console.error(`❌ Fallback removal failed for overlay ${i}:`, fallbackError);
                }
              }
            }
            
            // Final safety clear
            try {
              mapInstance.overlayMapTypes.clear();
              console.log('🧹 Final overlay collection clear completed');
            } catch (clearError) {
              console.warn('⚠️ Error during final overlay clear:', clearError);
            }
          }

          // Enhanced event listener cleanup
          if (window.google?.maps?.event) {
            try {
              console.log('🧹 Clearing Google Maps event listeners');
              google.maps.event.clearInstanceListeners(mapRef.current);
              console.log('✅ Event listeners cleared successfully');
            } catch (eventError) {
              console.error('❌ Error clearing event listeners:', eventError);
            }
          }

          // Additional safety cleanup for map instance
          try {
            if (typeof mapInstance.setOptions === 'function') {
              mapInstance.setOptions({ gestureHandling: 'none' });
            }
          } catch (optionsError) {
            console.warn('⚠️ Error setting cleanup options:', optionsError);
          }

          console.log('✅ Comprehensive overlay cleanup completed');
          
        } catch (cleanupError) {
          console.error('❌ Error during comprehensive cleanup:', cleanupError);
          
          // Emergency cleanup fallback
          try {
            console.log('🚨 Attempting emergency cleanup fallback');
            if (mapRef.current && (mapRef.current as any).overlayMapTypes) {
              (mapRef.current as any).overlayMapTypes.clear();
            }
          } catch (emergencyError) {
            console.error('❌ Emergency cleanup also failed:', emergencyError);
          }
        }
      }
    };
  }, []);

  if (loadError) {
    console.error('❌ Google Maps API failed to load:', loadError);
    return <MapLoadError error="Failed to load Google Maps API." />;
  }

  if (!isLoaded) {
    console.log('⏳ Google Maps API still loading...');
    return <MapLoadingIndicator />;
  }

  if (waypointsLoading) {
    console.log('⏳ Route 66 waypoints still loading...');
    return <MapLoadingIndicator />;
  }

  if (waypointsError) {
    console.error('❌ Failed to load Route 66 waypoints:', waypointsError);
    return <MapLoadError error={`Failed to load Route 66 waypoints: ${waypointsError}`} />;
  }

  console.log('🗺️ Rendering GoogleMapsRoute66 with enhanced overlay error handling', {
    isLoaded,
    isMapReady: mapEventHandlers.isMapReady,
    isMapRefStable,
    selectedState,
    visibleWaypoints: visibleWaypoints.length,
    totalWaypoints: waypoints.length,
    stabilityCounter: mapRefStabilityCounter
  });

  return (
    <div className="relative w-full h-full">
      <MapOverlaysContainer
        selectedState={selectedState}
        onClearSelection={onClearSelection}
        isDragging={isDragging}
        showRouteStats={showRouteStats}
        isMapReady={mapEventHandlers.isMapReady && isMapRefStable}
        onToggleRouteStats={() => setShowRouteStats(!showRouteStats)}
        mapRef={mapRef}
      />
      
      <MapCore
        mapRef={mapRef}
        isMapReady={mapEventHandlers.isMapReady}
        visibleWaypoints={visibleWaypoints}
        onMapLoad={mapBounds.handleMapLoad}
        onMapClick={handleMapClick}
        onMapReady={mapEventHandlers.onMapReady}
        onDestinationClick={handleDestinationClick}
        onAttractionClick={handleAttractionClick}
      />
    </div>
  );
};

export default GoogleMapsRoute66;
