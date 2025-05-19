
import { useEffect, useRef } from "react";
import TownsList from "./TownsList";
import { route66States } from "./mapData";
import { route66Towns } from "@/types/route66";

interface MapDisplayProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
}

const MapDisplay = ({ selectedState, onStateClick }: MapDisplayProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    renderRouteMap();
  }, [selectedState]);
  
  // Helper function to calculate approximate centroids for state labels
  const getStateCentroid = (pathD: string): {x: number, y: number} | null => {
    // A simple centroid approximation based on the path's points
    const points = pathD.split(/[ML,Z]/).filter(Boolean);
    let sumX = 0, sumY = 0, count = 0;
    
    points.forEach(point => {
      const [x, y] = point.trim().split(' ').map(Number);
      if (!isNaN(x) && !isNaN(y)) {
        sumX += x;
        sumY += y;
        count++;
      }
    });
    
    return count ? {x: sumX/count, y: sumY/count} : null;
  };
  
  const renderRouteMap = () => {
    const container = mapContainerRef.current;
    if (!container) return;
    
    // Clear previous content
    container.innerHTML = '';
    
    // Create the map wrapper
    const mapWrapper = document.createElement('div');
    mapWrapper.className = 'relative w-full h-full';
    
    // Create the map background
    const mapBg = document.createElement('div');
    mapBg.className = 'absolute inset-0 rounded-xl bg-[#f5f5f5] overflow-hidden';
    
    // Create the title
    const title = document.createElement('div');
    title.className = 'absolute top-2 right-4 bg-white px-4 py-1 rounded-full shadow-md z-10';
    title.innerHTML = '<h3 class="text-lg font-bold">HISTORIC ROUTE 66</h3>';
    mapWrapper.appendChild(title);
    
    // Create the route 66 badge
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
    
    // Add the US map outline
    const mapSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mapSvg.setAttribute('viewBox', '0 0 960 600');
    mapSvg.setAttribute('class', 'absolute inset-0 w-full h-full');
    
    // Add state boundaries group
    const statesPaths = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    statesPaths.setAttribute('fill', '#a3c1e0');
    statesPaths.setAttribute('stroke', '#ffffff');
    statesPaths.setAttribute('stroke-width', '1.5');

    // Add states with click handlers
    route66States.forEach(state => {
      const statePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      statePath.setAttribute('d', state.d);
      statePath.setAttribute('id', `state-${state.id}`);
      statePath.setAttribute('fill', selectedState === state.id ? '#5D7B93' : state.color);
      statePath.setAttribute('data-state', state.id);
      statePath.setAttribute('data-state-name', state.name);
      statePath.setAttribute('class', 'cursor-pointer hover:fill-route66-blue transition-colors duration-200');
      
      // Add click event
      statePath.addEventListener('click', () => {
        onStateClick(state.id, state.name);
      });
      
      statesPaths.appendChild(statePath);
      
      // Add state label
      const stateCenter = getStateCentroid(state.d);
      if (stateCenter) {
        const stateLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        stateLabel.setAttribute('x', stateCenter.x.toString());
        stateLabel.setAttribute('y', stateCenter.y.toString());
        stateLabel.setAttribute('text-anchor', 'middle');
        stateLabel.setAttribute('font-size', '12');
        stateLabel.setAttribute('class', 'font-semibold pointer-events-none');
        stateLabel.setAttribute('fill', selectedState === state.id ? '#ffffff' : '#444444');
        stateLabel.textContent = state.id;
        statesPaths.appendChild(stateLabel);
      }
    });
    
    mapSvg.appendChild(statesPaths);
    
    // Add the Route 66 line path
    const routePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    routePath.setAttribute('d', 'M645,250 L617,300 L590,320 L560,320 L520,340 L480,370 L450,380 L400,410 L350,410 L300,430 L250,440 L200,450');
    routePath.setAttribute('stroke', '#D92121');
    routePath.setAttribute('stroke-width', '4');
    routePath.setAttribute('fill', 'none');
    routePath.setAttribute('stroke-linecap', 'round');
    routePath.setAttribute('stroke-linejoin', 'round');
    routePath.setAttribute('stroke-dasharray', '6 3');
    mapSvg.appendChild(routePath);
    
    // Add city markers
    const markers = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Add major cities as dots with labels
    const majorCities = [
      { x: 195, y: 450, name: "Los Angeles" },
      { x: 270, y: 425, name: "Flagstaff" },
      { x: 380, y: 390, name: "Albuquerque" },
      { x: 450, y: 380, name: "Amarillo" },
      { x: 500, y: 350, name: "Oklahoma City" },
      { x: 580, y: 320, name: "St. Louis" },
      { x: 645, y: 250, name: "Chicago" }
    ];
    
    majorCities.forEach(city => {
      // Create dot with circle and pulse effect
      const dotGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      // Pulse circle
      const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pulse.setAttribute('cx', city.x.toString());
      pulse.setAttribute('cy', city.y.toString());
      pulse.setAttribute('r', '6');
      pulse.setAttribute('fill', 'rgba(217, 33, 33, 0.3)');
      pulse.setAttribute('class', 'animate-pulse');
      
      // Main dot
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', city.x.toString());
      dot.setAttribute('cy', city.y.toString());
      dot.setAttribute('r', '4');
      dot.setAttribute('fill', '#D92121');
      
      // Create city label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', city.x.toString());
      label.setAttribute('y', (city.y - 10).toString());
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '10');
      label.setAttribute('font-weight', 'bold');
      label.setAttribute('fill', '#444444');
      label.textContent = city.name;
      
      dotGroup.appendChild(pulse);
      dotGroup.appendChild(dot);
      markers.appendChild(dotGroup);
      markers.appendChild(label);
    });
    
    mapSvg.appendChild(markers);
    mapBg.appendChild(mapSvg);
    mapWrapper.appendChild(mapBg);
    
    // Add towns list
    const visibleTowns = getVisibleTowns();
    
    // Add a clear selection button if state is selected
    if (selectedState) {
      const stateName = route66States.find(s => s.id === selectedState)?.name || '';
      
      // Add a clear selection button
      const clearButton = document.createElement('button');
      clearButton.className = 'absolute top-2 left-24 bg-white px-2 py-1 rounded-full text-xs shadow-md z-10 flex items-center gap-1';
      clearButton.innerHTML = `<span>Clear ${stateName}</span>`;
      clearButton.addEventListener('click', () => {
        onStateClick('', '');
      });
      mapWrapper.appendChild(clearButton);
    }
    
    // Append the towns list
    const townsList = document.createElement('div');
    townsList.className = 'absolute bottom-2 left-2 right-2 bg-white/90 p-2 rounded-lg text-xs grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1';
    
    visibleTowns.forEach(town => {
      const townItem = document.createElement('div');
      townItem.className = 'flex items-center gap-1';
      townItem.innerHTML = `
        <span class="text-red-600"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg></span>
        <span>${town.name}</span>
      `;
      townsList.appendChild(townItem);
    });
    
    mapWrapper.appendChild(townsList);
    container.appendChild(mapWrapper);
  };
  
  const getVisibleTowns = () => {
    // Filter towns if state is selected
    if (selectedState) {
      const stateName = route66States.find(s => s.id === selectedState)?.name || '';
      return route66Towns.filter(town => town.name.includes(stateName));
    }
    return route66Towns;
  };

  return (
    <div
      ref={mapContainerRef}
      id="route66-map-container"
      className="w-full h-[600px] rounded-xl shadow-lg border border-gray-200"
    ></div>
  );
};

export default MapDisplay;
