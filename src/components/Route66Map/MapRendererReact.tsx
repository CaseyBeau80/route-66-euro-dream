import React, { useState, useEffect, useCallback } from "react";
import { MapStatesComponent } from "./MapStates";
import { MapCitiesComponent } from "./MapCities";
import { Route66LineComponent } from "./Route66Line";
import MapTitle from "./MapElements/MapTitle";
import Route66Badge from "./MapElements/Route66Badge";
import ClearSelectionButton from "./MapElements/ClearSelectionButton";
import MapBackground from "./MapElements/MapBackground";
import MapSvgContainer from "./MapElements/MapSvgContainer";
import ZoomControls from "./MapElements/ZoomControls";
import { route66States } from "./mapData";
import { Touchpad } from "lucide-react";

interface MapRendererReactProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
  onClearSelection: () => void;
}

// Cities along Route 66 with properly aligned coordinates to match the map projection
const majorCities = [
  // Illinois
  { x: 593, y: 242, name: "Chicago" },
  { x: 588, y: 255, name: "Joliet" },
  { x: 570, y: 275, name: "Springfield, IL" },
  
  // Missouri
  { x: 550, y: 295, name: "St. Louis" },
  { x: 520, y: 320, name: "Springfield, MO" },
  { x: 500, y: 330, name: "Joplin" },
  
  // Kansas
  { x: 495, y: 330, name: "Galena, KS" },
  
  // Oklahoma
  { x: 470, y: 340, name: "Tulsa" },
  { x: 445, y: 355, name: "Oklahoma City" },
  
  // Texas
  { x: 390, y: 375, name: "Amarillo" },
  
  // New Mexico
  { x: 360, y: 385, name: "Tucumcari" },
  { x: 330, y: 390, name: "Santa Fe" },
  { x: 320, y: 400, name: "Albuquerque" },
  { x: 290, y: 400, name: "Gallup" },
  
  // Arizona
  { x: 270, y: 395, name: "Winslow" },
  { x: 250, y: 390, name: "Flagstaff" },
  { x: 220, y: 387, name: "Kingman" },
  
  // California
  { x: 200, y: 390, name: "Needles" },
  { x: 180, y: 405, name: "Barstow" },
  { x: 160, y: 415, name: "San Bernardino" },
  { x: 150, y: 425, name: "Los Angeles" },
  { x: 145, y: 430, name: "Santa Monica" }
];

/**
 * React-based implementation of the MapRenderer
 * This can replace the DOM-manipulation based MapRenderer in the future
 */
const MapRendererReact = ({
  selectedState,
  onStateClick,
  onClearSelection
}: MapRendererReactProps) => {
  // Zoom state management
  const [zoom, setZoom] = useState(1);
  const [isPinching, setIsPinching] = useState(false);
  const [zoomActivity, setZoomActivity] = useState<boolean>(false);
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 4;
  const ZOOM_STEP = 0.5;

  // Reset the zoom activity indicator after a delay
  useEffect(() => {
    if (zoomActivity) {
      const timer = setTimeout(() => {
        setZoomActivity(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [zoomActivity]);

  // Zoom handlers with debounce to prevent rapid updates
  const handleZoomIn = useCallback(() => {
    setZoom(prevZoom => {
      const newZoom = Math.min(prevZoom + ZOOM_STEP, MAX_ZOOM);
      console.log('Zoom in to:', newZoom);
      setZoomActivity(true);
      return newZoom;
    });
  }, [MAX_ZOOM, ZOOM_STEP]);

  const handleZoomOut = useCallback(() => {
    setZoom(prevZoom => {
      const newZoom = Math.max(prevZoom - ZOOM_STEP, MIN_ZOOM);
      console.log('Zoom out to:', newZoom);
      setZoomActivity(true);
      return newZoom;
    });
  }, [MIN_ZOOM, ZOOM_STEP]);
  
  const handleZoomChange = useCallback((newZoom: number) => {
    console.log('Zoom changed to:', newZoom.toFixed(2));
    setIsPinching(true);
    setZoom(newZoom);
    setZoomActivity(true);
    
    // Reset isPinching after a short delay
    const timeout = setTimeout(() => {
      setIsPinching(false);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  // Log when component mounts to help with debugging
  useEffect(() => {
    console.log('MapRendererReact mounted, isMobile detection available:', typeof window !== 'undefined');
  }, []);

  return (
    <div className="relative w-full h-full">
      <MapTitle />
      <Route66Badge />
      
      {selectedState && (
        <ClearSelectionButton 
          selectedState={selectedState} 
          onClearSelection={onClearSelection} 
        />
      )}
      
      {/* Add ZoomControls component */}
      <ZoomControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        currentZoom={zoom}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
      />
      
      {/* Add pinch indicator for mobile devices with pulsing animation when active */}
      <div className={`absolute top-4 right-4 bg-white/80 p-2 rounded-md shadow-md backdrop-blur-sm md:hidden flex items-center gap-2 transition-all ${isPinching || zoomActivity ? 'bg-blue-100 scale-110' : ''}`}>
        <Touchpad className={`h-4 w-4 ${isPinching || zoomActivity ? 'text-blue-500 animate-pulse' : ''}`} />
        <span className="text-xs">Pinch to zoom {zoom.toFixed(1)}x</span>
      </div>
      
      <MapBackground>
        <MapSvgContainer 
          zoom={zoom} 
          minZoom={MIN_ZOOM} 
          maxZoom={MAX_ZOOM}
          onZoomChange={handleZoomChange}
        >
          <MapStatesComponent 
            selectedState={selectedState}
            onStateClick={onStateClick}
          />
          <Route66LineComponent animated={true} />
          <MapCitiesComponent cities={majorCities} />
        </MapSvgContainer>
      </MapBackground>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow-md z-10 flex flex-col gap-2">
        <div className="text-xs font-bold mb-1">Legend</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#5D7B93]"></div>
          <div className="text-xs">Route 66 States</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#d3d3d3]"></div>
          <div className="text-xs">Other States</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#D92121]"></div>
          <div className="text-xs">Route 66</div>
        </div>
      </div>
    </div>
  );
};

export default MapRendererReact;
