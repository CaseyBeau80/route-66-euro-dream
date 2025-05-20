
import React from "react";
import { route66States } from "../mapData";

interface MapControlsProps {
  selectedState: string | null;
  onClearSelection: () => void;
  currentZoom: number;
  MIN_ZOOM: number; 
  MAX_ZOOM: number;
  updateViewBox: (newZoom: number) => void;
}

/**
 * Renders zoom controls, legend, and state selection for DOM-based map
 */
const MapControlsDOM = ({
  selectedState,
  onClearSelection,
  currentZoom,
  MIN_ZOOM,
  MAX_ZOOM,
  updateViewBox
}: MapControlsProps) => {
  
  // Create zoom controls
  const createZoomControls = () => {
    const zoomControls = document.createElement('div');
    zoomControls.className = 'absolute bottom-4 left-4 z-10 flex flex-col gap-1 bg-white/80 p-1 rounded-md shadow-md backdrop-blur-sm';
    
    // Create zoom in button
    const zoomInBtn = document.createElement('button');
    zoomInBtn.className = 'w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center hover:bg-gray-100 transition-colors';
    zoomInBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`;
    zoomInBtn.addEventListener('click', () => {
      if (currentZoom < MAX_ZOOM) {
        updateViewBox(Math.min(currentZoom + 0.5, MAX_ZOOM));
      }
    });
    
    // Create zoom out button
    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.className = 'w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center hover:bg-gray-100 transition-colors';
    zoomOutBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`;
    zoomOutBtn.addEventListener('click', () => {
      if (currentZoom > MIN_ZOOM) {
        updateViewBox(Math.max(currentZoom - 0.5, MIN_ZOOM));
      }
    });
    
    zoomControls.appendChild(zoomInBtn);
    zoomControls.appendChild(zoomOutBtn);
    
    return zoomControls;
  };

  // Create map legend
  const createLegend = () => {
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
    
    return legend;
  };

  // Create clear selection button if a state is selected
  const createClearSelectionButton = () => {
    if (!selectedState) return null;
    
    const stateName = route66States.find(s => s.id === selectedState)?.name || '';
    const clearButton = document.createElement('button');
    clearButton.className = 'absolute top-2 left-24 bg-white px-3 py-1 rounded-full text-xs shadow-md z-10 flex items-center gap-1 hover:bg-gray-100 transition-colors';
    clearButton.innerHTML = `<span>Clear ${stateName}</span>`;
    clearButton.addEventListener('click', onClearSelection);
    
    return clearButton;
  };

  return {
    createZoomControls,
    createLegend,
    createClearSelectionButton
  };
};

export default MapControlsDOM;
