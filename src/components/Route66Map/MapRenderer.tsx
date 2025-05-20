import React from "react";
import MapStates from "./MapStates";
import MapCities from "./MapCities";
import Route66Line from "./Route66Line";
import MapControlsDOM from "./components/MapControlsDOM";
import MapDecorationDOM from "./components/MapDecorationDOM";
import MapWrapperDOM from "./components/MapWrapperDOM";
import { route66Towns } from "@/types/route66"; 
import { transformTownsToSvgPoints } from "@/utils/mapProjection";

interface MapRendererProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
  onClearSelection: () => void;
  mapContainerRef: React.RefObject<HTMLDivElement>;
}

// Using the same updated city coordinates as in MapRendererReact for consistency
// Y-coordinates increased to shift cities south for better geographical alignment
const majorCities = transformTownsToSvgPoints(route66Towns);

const MapRenderer = ({
  selectedState,
  onStateClick,
  onClearSelection,
  mapContainerRef
}: MapRendererProps) => {
  const renderRouteMap = () => {
    const container = mapContainerRef.current;
    if (!container) return;
    
    // Clear previous content
    container.innerHTML = '';
    
    // Initialize zoom state
    let currentZoom = 1;
    const MIN_ZOOM = 1;
    const MAX_ZOOM = 4;
    const ZOOM_STEP = 0.5;
    
    // Base dimensions
    const baseWidth = 959;
    const baseHeight = 593;
    
    // Initialize map structure components
    const mapWrapperDOM = MapWrapperDOM({ 
      baseWidth, 
      baseHeight,
      updateViewBox 
    });
    
    // Initialize map decorations
    const mapDecorationDOM = MapDecorationDOM();
    
    // Initialize map controls
    const mapControlsDOM = MapControlsDOM({
      selectedState,
      onClearSelection,
      currentZoom,
      MIN_ZOOM,
      MAX_ZOOM,
      updateViewBox
    });
    
    // Create the ViewBox updater function
    function updateViewBox(newZoom) {
      currentZoom = newZoom;
      
      // Base viewBox dimensions
      const baseCenterX = baseWidth / 2;
      const baseCenterY = baseHeight / 2;
      
      // Calculate adjusted viewBox based on zoom
      const viewBoxWidth = baseWidth / currentZoom;
      const viewBoxHeight = baseHeight / currentZoom;
      
      // Calculate new viewBox origin to keep the map centered
      const viewBoxX = baseCenterX - (viewBoxWidth / 2);
      const viewBoxY = baseCenterY - (viewBoxHeight / 2);
      
      mapSvg.setAttribute('viewBox', `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`);
    }
    
    // Build the map structure
    const mapWrapper = mapWrapperDOM.createMapWrapper();
    const mapBg = mapWrapperDOM.createMapBackground();
    const mapSvg = mapWrapperDOM.createMapSvg();
    
    // Create and add states
    const mapStates = MapStates({ selectedState, onStateClick });
    const statesPaths = mapStates.createStatesPaths();
    mapSvg.appendChild(statesPaths);
    
    // Create and add route line with animation
    const route66Line = Route66Line({ animated: true, cities: majorCities });
    const routePath = route66Line.createRoutePath();
    mapSvg.appendChild(routePath);
    
    // Create and add city markers
    const mapCities = MapCities({ cities: majorCities });
    const markers = mapCities.createCityMarkers();
    mapSvg.appendChild(markers);
    
    // Append SVG to map background
    mapBg.appendChild(mapSvg);
    mapWrapper.appendChild(mapBg);
    
    // Add decorative elements
    const title = mapDecorationDOM.createTitle();
    const badge = mapDecorationDOM.createBadge();
    mapWrapper.appendChild(title);
    mapWrapper.appendChild(badge);
    
    // Add control elements
    const zoomControls = mapControlsDOM.createZoomControls();
    const legend = mapControlsDOM.createLegend();
    const clearButton = mapControlsDOM.createClearSelectionButton();
    
    mapWrapper.appendChild(zoomControls);
    mapWrapper.appendChild(legend);
    if (clearButton) mapWrapper.appendChild(clearButton);
    
    container.appendChild(mapWrapper);
  };

  return {
    renderRouteMap
  };
};

export default MapRenderer;
