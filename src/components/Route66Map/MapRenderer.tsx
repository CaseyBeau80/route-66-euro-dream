
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

const majorCities = [
  { x: 195, y: 450, name: "Los Angeles" },
  { x: 270, y: 425, name: "Flagstaff" },
  { x: 380, y: 390, name: "Albuquerque" },
  { x: 450, y: 380, name: "Amarillo" },
  { x: 500, y: 350, name: "Oklahoma City" },
  { x: 580, y: 320, name: "St. Louis" },
  { x: 645, y: 250, name: "Chicago" }
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
    
    // Create the map wrapper
    const mapWrapper = document.createElement('div');
    mapWrapper.className = 'relative w-full h-full';
    
    // Append MapBackground (container for SVG)
    const mapBg = document.createElement('div');
    mapBg.className = 'absolute inset-0 rounded-xl bg-[#f5f5f5] overflow-hidden';
    
    // Create SVG for map elements with proper viewBox for full US map
    const mapSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mapSvg.setAttribute('viewBox', '0 200 900 500');
    mapSvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    mapSvg.setAttribute('class', 'absolute inset-0 w-full h-full');
    
    // Create and add states
    const mapStates = MapStates({ selectedState, onStateClick });
    const statesPaths = mapStates.createStatesPaths();
    mapSvg.appendChild(statesPaths);
    
    // Create and add route line with animation
    const route66Line = Route66Line({ animated: true });
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
