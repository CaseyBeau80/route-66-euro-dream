import React from "react";
import MapStates from "./MapStates";
import MapCities from "./MapCities";
import Route66Line from "./Route66Line";
import { route66States } from "./mapData";

interface MapRendererProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
  onClearSelection: () => void;
  mapContainerRef: React.RefObject<HTMLDivElement>;
}

// Using the same city coordinates as in MapRendererReact for consistency
const majorCities = [
  // Illinois
  { x: 617, y: 206, name: "Chicago" },       // Start of Route 66
  { x: 610, y: 218, name: "Joliet" },
  { x: 600, y: 235, name: "Springfield, IL" },
  
  // Missouri
  { x: 588, y: 248, name: "St. Louis" },
  { x: 560, y: 275, name: "Springfield, MO" },
  { x: 545, y: 290, name: "Joplin" },
  
  // Kansas (small segment)
  { x: 530, y: 298, name: "Galena, KS" },
  
  // Oklahoma
  { x: 500, y: 309, name: "Tulsa" },
  { x: 470, y: 318, name: "Oklahoma City" },
  
  // Texas
  { x: 395, y: 330, name: "Amarillo" },
  
  // New Mexico
  { x: 365, y: 333, name: "Tucumcari" },
  { x: 350, y: 335, name: "Santa Fe" },
  { x: 320, y: 338, name: "Albuquerque" },
  { x: 290, y: 342, name: "Gallup" },
  
  // Arizona
  { x: 260, y: 346, name: "Winslow" },
  { x: 230, y: 350, name: "Flagstaff" },
  { x: 190, y: 354, name: "Kingman" },
  
  // California
  { x: 170, y: 359, name: "Needles" },
  { x: 150, y: 364, name: "Barstow" },
  { x: 140, y: 368, name: "San Bernardino" },
  { x: 125, y: 377, name: "Los Angeles" },   // Adjusted for better alignment
  { x: 115, y: 385, name: "Santa Monica" }   // End of Route 66 - adjusted for better alignment
];

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
    
    // Create the map wrapper
    const mapWrapper = document.createElement('div');
    mapWrapper.className = 'relative w-full h-full';
    
    // Append MapBackground (container for SVG)
    const mapBg = document.createElement('div');
    mapBg.className = 'absolute inset-0 rounded-xl bg-[#f8f8f8] overflow-hidden';
    
    // Create SVG for map elements with proper viewBox for full US map
    const mapSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mapSvg.setAttribute('viewBox', '0 0 959 593');
    mapSvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    mapSvg.setAttribute('class', 'absolute inset-0 w-full h-full transition-all duration-300 ease-in-out');
    
    // Create and add states
    const mapStates = MapStates({ selectedState, onStateClick });
    const statesPaths = mapStates.createStatesPaths();
    mapSvg.appendChild(statesPaths);
    
    // Create and add route line with animation, passing cities
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
    
    // Add the title component
    const title = document.createElement('div');
    title.className = 'absolute top-2 right-4 bg-white px-4 py-1 rounded-full shadow-md z-10';
    title.innerHTML = '<h3 class="text-lg font-bold">HISTORIC ROUTE 66</h3>';
    mapWrapper.appendChild(title);
    
    // Add the Route 66 badge
    const badge = document.createElement('div');
    badge.className = 'absolute top-4 left-4 z-10';
    badge.innerHTML = `
      <div class="bg-white rounded-full p-1 shadow-md">
        <div class="bg-white border-2 border-black rounded-full p-2 flex flex-col items-center w-16 h-16">
          <div class="text-xs">ROUTE</div>
          <div class="text-xs">US</div>
          <div class="text-xl font-black">66</div>
        </div>
      </div>
    `;
    mapWrapper.appendChild(badge);
    
    // Add zoom controls
    const zoomControls = document.createElement('div');
    zoomControls.className = 'absolute bottom-4 left-4 z-10 flex flex-col gap-1 bg-white/80 p-1 rounded-md shadow-md backdrop-blur-sm';
    
    const updateViewBox = () => {
      // Base viewBox dimensions
      const baseWidth = 959;
      const baseHeight = 593;
      const baseCenterX = baseWidth / 2;
      const baseCenterY = baseHeight / 2;
      
      // Calculate adjusted viewBox based on zoom
      const viewBoxWidth = baseWidth / currentZoom;
      const viewBoxHeight = baseHeight / currentZoom;
      
      // Calculate new viewBox origin to keep the map centered
      const viewBoxX = baseCenterX - (viewBoxWidth / 2);
      const viewBoxY = baseCenterY - (viewBoxHeight / 2);
      
      mapSvg.setAttribute('viewBox', `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`);
    };
    
    // Create zoom in button
    const zoomInBtn = document.createElement('button');
    zoomInBtn.className = 'w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center hover:bg-gray-100 transition-colors';
    zoomInBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`;
    zoomInBtn.addEventListener('click', () => {
      if (currentZoom < MAX_ZOOM) {
        currentZoom = Math.min(currentZoom + ZOOM_STEP, MAX_ZOOM);
        updateViewBox();
      }
    });
    
    // Create zoom out button
    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.className = 'w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center hover:bg-gray-100 transition-colors';
    zoomOutBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`;
    zoomOutBtn.addEventListener('click', () => {
      if (currentZoom > MIN_ZOOM) {
        currentZoom = Math.max(currentZoom - ZOOM_STEP, MIN_ZOOM);
        updateViewBox();
      }
    });
    
    zoomControls.appendChild(zoomInBtn);
    zoomControls.appendChild(zoomOutBtn);
    mapWrapper.appendChild(zoomControls);
    
    // Add a legend for the map
    const legend = document.createElement('div');
    legend.className = 'absolute bottom-4 right-4 bg-white p-2 rounded shadow-md z-10 flex flex-col gap-2';
    legend.innerHTML = `
      <div class="text-xs font-bold mb-1">Legend</div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-[#5D7B93]"></div>
        <div class="text-xs">Route 66 States</div>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-[#d3d3d3]"></div>
        <div class="text-xs">Other States</div>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-[#D92121]"></div>
        <div class="text-xs">Route 66</div>
      </div>
    `;
    mapWrapper.appendChild(legend);
    
    // Add a clear selection button if state is selected
    if (selectedState) {
      const stateName = route66States.find(s => s.id === selectedState)?.name || '';
      // Create button manually for DOM version
      const clearButton = document.createElement('button');
      clearButton.className = 'absolute top-2 left-24 bg-white px-3 py-1 rounded-full text-xs shadow-md z-10 flex items-center gap-1 hover:bg-gray-100 transition-colors';
      clearButton.innerHTML = `<span>Clear ${stateName}</span>`;
      clearButton.addEventListener('click', onClearSelection);
      
      mapWrapper.appendChild(clearButton);
    }
    
    container.appendChild(mapWrapper);
  };

  return {
    renderRouteMap
  };
};

export default MapRenderer;
