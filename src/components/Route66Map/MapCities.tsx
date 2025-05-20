import React, { useEffect, useRef } from "react";

interface City {
  x: number;
  y: number;
  name: string;
}

interface MapCitiesProps {
  cities: Array<City>;
}

// Component for city labels (to be rendered before the route line)
export const MapCityLabels = ({ cities }: MapCitiesProps) => {
  return (
    <g className="city-labels">
      {cities.map((city, index) => (
        <React.Fragment key={`city-label-${index}`}>
          {/* City label background - render first */}
          <rect
            x={city.x - 35}
            y={city.y - 22}
            width={70}
            height={16}
            rx={8}
            fill="rgba(255, 255, 255, 0.8)"
            stroke="#D92121"
            strokeWidth="0.5"
          />
          
          {/* City label text */}
          <text
            x={city.x}
            y={city.y - 10}
            textAnchor="middle"
            fontSize={11}
            fontWeight="bold"
            fill="#444444"
          >
            {city.name}
          </text>
        </React.Fragment>
      ))}
    </g>
  );
};

// Component for city markers/dots (to be rendered after the route line)
export const MapCityMarkers = ({ cities }: MapCitiesProps) => {
  return (
    <g className="city-markers">
      {cities.map((city, index) => (
        <g key={`city-marker-${index}`}>
          {/* Outer pulse with proper transparency */}
          <circle
            cx={city.x}
            cy={city.y}
            r={8}
            fill="#D92121"
            fillOpacity="0.15"
            className="animate-pulse"
          />
          
          {/* Middle pulse with proper transparency */}
          <circle
            cx={city.x}
            cy={city.y}
            r={6}
            fill="#D92121"
            fillOpacity="0.25"
          />
          
          {/* Main dot - completely transparent fill with stroke */}
          <circle
            cx={city.x}
            cy={city.y}
            r={4}
            fill="#ffffff"
            stroke="#D92121"
            strokeWidth="1.5"
          />
          
          {/* Small center dot */}
          <circle
            cx={city.x}
            cy={city.y}
            r={1.5}
            fill="#D92121"
          />
        </g>
      ))}
    </g>
  );
};

// Legacy DOM manipulation methods (keeping for backward compatibility)
const MapCities = ({ cities }: MapCitiesProps) => {
  const createCityMarkers = () => {
    const markers = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    cities.forEach(city => {
      // Create city labels first (so they appear behind dots)
      const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      labelBg.setAttribute('x', (city.x - 35).toString());
      labelBg.setAttribute('y', (city.y - 22).toString());
      labelBg.setAttribute('width', '70');
      labelBg.setAttribute('height', '16');
      labelBg.setAttribute('rx', '8');
      labelBg.setAttribute('fill', 'rgba(255, 255, 255, 0.8)');
      labelBg.setAttribute('stroke', '#D92121');
      labelBg.setAttribute('stroke-width', '0.5');
      
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', city.x.toString());
      label.setAttribute('y', (city.y - 10).toString());
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '11');
      label.setAttribute('font-weight', 'bold');
      label.setAttribute('fill', '#444444');
      label.textContent = city.name;
      
      // Add label elements to markers
      markers.appendChild(labelBg);
      markers.appendChild(label);
      
      // Create dot with circle and pulse effect in a separate group
      const dotGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      // Outer pulse circle with animation - fully transparent fill
      const outerPulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      outerPulse.setAttribute('cx', city.x.toString());
      outerPulse.setAttribute('cy', city.y.toString());
      outerPulse.setAttribute('r', '8');
      outerPulse.setAttribute('fill-opacity', '0.15');
      outerPulse.setAttribute('fill', '#D92121');
      outerPulse.setAttribute('class', 'animate-pulse');
      
      // Middle pulse circle - semi transparent
      const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pulse.setAttribute('cx', city.x.toString());
      pulse.setAttribute('cy', city.y.toString());
      pulse.setAttribute('r', '6');
      pulse.setAttribute('fill-opacity', '0.25');
      pulse.setAttribute('fill', '#D92121');
      
      // Main dot - white fill with stroke
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', city.x.toString());
      dot.setAttribute('cy', city.y.toString());
      dot.setAttribute('r', '4');
      dot.setAttribute('fill', '#ffffff');
      dot.setAttribute('stroke', '#D92121');
      dot.setAttribute('stroke-width', '1.5');
      
      // Small center dot
      const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      center.setAttribute('cx', city.x.toString());
      center.setAttribute('cy', city.y.toString());
      center.setAttribute('r', '1.5');
      center.setAttribute('fill', '#D92121');
      
      // Add dot elements to dotGroup in order of rendering (back to front)
      dotGroup.appendChild(outerPulse);
      dotGroup.appendChild(pulse);
      dotGroup.appendChild(dot);
      dotGroup.appendChild(center);
      
      // Add the dot group after labels
      markers.appendChild(dotGroup);
    });
    
    return markers;
  };

  return {
    createCityMarkers
  };
};

// Keeping this for backward compatibility
export const MapCitiesComponent = ({ cities }: MapCitiesProps) => {
  return (
    <>
      <MapCityLabels cities={cities} />
      <MapCityMarkers cities={cities} />
    </>
  );
};

export default MapCities;
