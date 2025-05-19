
import { useEffect, useState } from "react";
import { Route, SignpostBig, MapPin } from "lucide-react";
import { route66Towns } from "@/types/route66";
import MapLoading from "./Route66Map/MapLoading";
import { toast } from "@/components/ui/use-toast";

const Route66Map = () => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  // States that Route 66 passes through
  const route66States = [
    { id: "IL", name: "Illinois", d: "M617,300 L645,250 L670,240 L690,280 L650,310 L617,300 Z", color: "#a3c1e0" },
    { id: "MO", name: "Missouri", d: "M560,320 L617,300 L650,310 L640,350 L590,360 L560,320 Z", color: "#a3c1e0" },
    { id: "KS", name: "Kansas", d: "M530,335 L560,320 L590,360 L570,380 L530,370 L530,335 Z", color: "#a3c1e0" },
    { id: "OK", name: "Oklahoma", d: "M460,380 L530,370 L570,380 L550,410 L480,420 L460,380 Z", color: "#a3c1e0" },
    { id: "TX", name: "Texas", d: "M430,420 L480,420 L460,460 L410,440 L430,420 Z", color: "#a3c1e0" },
    { id: "NM", name: "New Mexico", d: "M350,410 L410,440 L380,490 L320,470 L350,410 Z", color: "#a3c1e0" },
    { id: "AZ", name: "Arizona", d: "M270,425 L320,470 L290,500 L240,450 L270,425 Z", color: "#a3c1e0" },
    { id: "CA", name: "California", d: "M180,450 L240,450 L260,490 L200,510 L180,450 Z", color: "#a3c1e0" }
  ];

  useEffect(() => {
    // Short delay to ensure the DOM is ready
    const timer = setTimeout(() => {
      try {
        renderRouteMap();
        setLoaded(true);
      } catch (err) {
        console.error("Error rendering map:", err);
        setError("Unable to load the Route 66 map. Please try refreshing the page.");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedState]); // Re-render when selected state changes

  const handleRetry = () => {
    setError(null);
    setLoaded(false);
    
    setTimeout(() => {
      try {
        renderRouteMap();
        setLoaded(true);
      } catch (err) {
        console.error("Error on retry:", err);
        setError("Unable to load the Route 66 map. Please try refreshing the page.");
      }
    }, 300);
  };

  const handleStateClick = (stateId: string, stateName: string) => {
    setSelectedState(stateId);
    
    // Get towns in the selected state
    const townsInState = route66Towns.filter(town => town.name.includes(stateName));
    
    toast({
      title: `Route 66 through ${stateName}`,
      description: `${townsInState.length} stops in ${stateName}: ${townsInState.map(town => town.name.split(',')[0]).join(', ')}`,
      duration: 5000,
    });
  };
  
  const renderRouteMap = () => {
    const container = document.getElementById('route66-map-container');
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
        handleStateClick(state.id, state.name);
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
    
    // Add the list of towns below the map
    const townsList = document.createElement('div');
    townsList.className = 'absolute bottom-2 left-2 right-2 bg-white/90 p-2 rounded-lg text-xs grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1';
    
    // Filter towns if state is selected
    let visibleTowns = route66Towns;
    if (selectedState) {
      const stateName = route66States.find(s => s.id === selectedState)?.name || '';
      visibleTowns = route66Towns.filter(town => town.name.includes(stateName));
      
      // Add a clear selection button
      const clearButton = document.createElement('button');
      clearButton.className = 'absolute top-2 left-24 bg-white px-2 py-1 rounded-full text-xs shadow-md z-10 flex items-center gap-1';
      clearButton.innerHTML = `<span>Clear ${stateName}</span>`;
      clearButton.addEventListener('click', () => {
        setSelectedState(null);
      });
      mapWrapper.appendChild(clearButton);
    }
    
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

  return (
    <div className="my-8 px-4">
      <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Historic Route 66</h2>
      
      {/* Map container */}
      <div className="relative">
        {/* Map display */}
        <div
          id="route66-map-container"
          className="w-full h-[600px] rounded-xl shadow-lg border border-gray-200"
          style={{
            display: loaded ? "block" : "none"
          }}
        ></div>
        
        {/* Loading/Error states */}
        {!loaded && <MapLoading error={error} onRetry={handleRetry} />}
      </div>
      
      <div className="text-center mt-6 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Route className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-medium">The Mother Road</h3>
          <SignpostBig className="h-5 w-5 text-red-600" />
        </div>
        <p className="text-gray-600">
          Historic Route 66 spans 2,448 miles from Chicago to Santa Monica,
          passing through Illinois, Missouri, Kansas, Oklahoma, Texas, New Mexico, Arizona, and California.
          {selectedState && <span className="font-semibold"> Click on states to see specific stops.</span>}
        </p>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span className="text-xs">Route 66</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-red-600" />
            <span className="text-xs">Major Stops</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-route66-blue"></div>
            <span className="text-xs">Selected State</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Route66Map;
