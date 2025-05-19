
import { useEffect, useState } from "react";
import { Route, SignpostBig, Navigation } from "lucide-react";
import { route66Towns } from "@/types/route66";
import MapLoading from "./Route66Map/MapLoading";

const Route66Map = () => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

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
    mapBg.className = 'absolute inset-0 rounded-xl bg-[#a3c1e0] overflow-hidden';
    
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
    
    // Add state boundaries
    const statesPaths = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    statesPaths.setAttribute('fill', '#a3c1e0');
    statesPaths.setAttribute('stroke', '#ffffff');
    statesPaths.setAttribute('stroke-width', '1.5');
    
    // We'll use a simplified US map for performance
    const usOutline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    usOutline.setAttribute('d', 'M215,493v14l-31-3v-12L215,493z M215,521l-31-3v12l31,3V521z M233,476v14l-18,3v-14L233,476z M233,505l-18,3v-14l18-3V505z M233,520l-18,3v-14l18-3V520z M233,534l-18,3v-14l18-3V534z M243,460l-6,1l-4,15l18-4L243,460z M215,435h31l-5,19l-26,5V435z M215,409v-49c21,0,38,0,38,23c0,15-1,26-7,30L215,409z M215,330v-19h38v19H215z M215,282v-19h38v19H215z M215,234h38v19h-38V234z M215,206h38v19h-38V206z M215,178h38v19h-38V178z M215,153h38v15h-38V153z M196,120c18,0,57,0,57,20c0,17-39,16-57,16V120z M196,438l19-4v23l-19,4V438z M196,483l19-4v23l-19,4V483z M196,529l19-4v22l-19,4V529z M177,120v36c-13,0-39,0-39-18C138,121,164,120,177,120z M177,206v47h-18v-28L177,206z M177,310l-18-22v-35h18V310z M177,329v23l-18-23H177z M177,387v24l-18-24H177z M177,444v24l-18-24H177z M177,530v54h-18v-30L177,530z M88,125c36,0,71,0,71,36c0,8-7,29-11,35H88V125z M88,210h60v42c-30-20-60,0-60,0V210z M88,272c42,0,60,48,60,48v31H88V272z M88,365h60v65H88V365z M88,444h60v65H88V444z M88,523h60v61H88V523z M138,92V25h-15L88,69v23H138z M51,10h87v102H51V10z M17,10h34v102H17V10z M215,92V25h15l35,44v23H215z M283,10h-68v102h68V10z M317,10h-34v102h34V10z');
    
    statesPaths.appendChild(usOutline);
    mapSvg.appendChild(statesPaths);
    
    // Add the Route 66 line path
    const routePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    routePath.setAttribute('d', 'M215,460 L300,430 L350,410 L400,390 L450,380 L500,350 L550,320 L600,300 L650,250');
    routePath.setAttribute('stroke', '#e74c3c');
    routePath.setAttribute('stroke-width', '4');
    routePath.setAttribute('fill', 'none');
    routePath.setAttribute('stroke-linecap', 'round');
    routePath.setAttribute('stroke-linejoin', 'round');
    mapSvg.appendChild(routePath);
    
    // Add city markers
    const markers = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Add major cities as dots with labels
    const cities = [
      { x: 205, y: 450, name: "Los Angeles" },
      { x: 245, y: 435, name: "Barstow" },
      { x: 270, y: 425, name: "Needles" },
      { x: 300, y: 415, name: "Kingman" },
      { x: 330, y: 410, name: "Flagstaff" },
      { x: 380, y: 390, name: "Albuquerque" },
      { x: 420, y: 385, name: "Tucumcari" },
      { x: 450, y: 380, name: "Amarillo" },
      { x: 500, y: 350, name: "Oklahoma City" },
      { x: 520, y: 335, name: "Tulsa" },
      { x: 550, y: 320, name: "Joplin" },
      { x: 580, y: 310, name: "Springfield" },
      { x: 600, y: 300, name: "St. Louis" },
      { x: 645, y: 250, name: "Chicago" }
    ];
    
    cities.forEach(city => {
      // Create dot
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', city.x.toString());
      dot.setAttribute('cy', city.y.toString());
      dot.setAttribute('r', '4');
      dot.setAttribute('fill', '#000');
      
      // Create city label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', city.x.toString());
      label.setAttribute('y', (city.y - 8).toString());
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '8');
      label.setAttribute('fill', '#000');
      label.textContent = city.name;
      
      markers.appendChild(dot);
      markers.appendChild(label);
    });
    
    mapSvg.appendChild(markers);
    mapBg.appendChild(mapSvg);
    mapWrapper.appendChild(mapBg);
    
    // Add the list of towns below the map
    const townsList = document.createElement('div');
    townsList.className = 'absolute bottom-2 left-2 right-2 bg-white/80 p-2 rounded-lg text-xs grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2';
    
    route66Towns.forEach(town => {
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
        </p>
      </div>
    </div>
  );
};

export default Route66Map;
