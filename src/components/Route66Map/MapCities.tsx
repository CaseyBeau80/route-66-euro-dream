
import React, { useEffect, useRef } from "react";

interface City {
  x: number;
  y: number;
  name: string;
}

interface MapCitiesProps {
  cities: Array<City>;
}

const MapCities = ({ cities }: MapCitiesProps) => {
  const createCityMarkers = () => {
    const markers = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    cities.forEach(city => {
      // Create dot with circle and pulse effect
      const dotGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      // Outer pulse circle with animation
      const outerPulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      outerPulse.setAttribute('cx', city.x.toString());
      outerPulse.setAttribute('cy', city.y.toString());
      outerPulse.setAttribute('r', '8');
      outerPulse.setAttribute('fill', 'rgba(217, 33, 33, 0.05)'); // More transparent
      outerPulse.setAttribute('class', 'animate-pulse');
      
      // Middle pulse circle
      const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pulse.setAttribute('cx', city.x.toString());
      pulse.setAttribute('cy', city.y.toString());
      pulse.setAttribute('r', '6');
      pulse.setAttribute('fill', 'rgba(217, 33, 33, 0.1)'); // More transparent
      
      // Main dot - completely transparent fill with stroke
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', city.x.toString());
      dot.setAttribute('cy', city.y.toString());
      dot.setAttribute('r', '4');
      dot.setAttribute('fill', 'transparent'); // Completely transparent fill
      dot.setAttribute('stroke', '#D92121'); // Red stroke
      dot.setAttribute('stroke-width', '1.5'); // Stroke width
      
      // Small center dot
      const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      center.setAttribute('cx', city.x.toString());
      center.setAttribute('cy', city.y.toString());
      center.setAttribute('r', '1');
      center.setAttribute('fill', '#D92121'); // Small red dot in center
      
      // Create city label with background for better readability
      const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      labelBg.setAttribute('x', (city.x - 35).toString());
      labelBg.setAttribute('y', (city.y - 22).toString());
      labelBg.setAttribute('width', '70');
      labelBg.setAttribute('height', '16');
      labelBg.setAttribute('rx', '8');
      labelBg.setAttribute('fill', 'rgba(255, 255, 255, 0.8)');
      
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', city.x.toString());
      label.setAttribute('y', (city.y - 10).toString());
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '11');
      label.setAttribute('font-weight', 'bold');
      label.setAttribute('fill', '#444444');
      label.textContent = city.name;
      
      // Add all elements in proper order
      markers.appendChild(labelBg);
      
      dotGroup.appendChild(outerPulse);
      dotGroup.appendChild(pulse);
      dotGroup.appendChild(dot);
      dotGroup.appendChild(center);
      
      markers.appendChild(dotGroup);
      markers.appendChild(label);
    });
    
    return markers;
  };

  return {
    createCityMarkers
  };
};

// React component for MapRendererReact
export const MapCitiesComponent = ({ cities }: MapCitiesProps) => {
  return (
    <g>
      {cities.map((city, index) => (
        <React.Fragment key={`city-${index}`}>
          {/* City label background */}
          <rect
            x={city.x - 35}
            y={city.y - 22}
            width={70}
            height={16}
            rx={8}
            fill="rgba(255, 255, 255, 0.8)"
          />
          
          {/* Dot group */}
          <g>
            {/* Outer pulse */}
            <circle
              cx={city.x}
              cy={city.y}
              r={8}
              fill="rgba(217, 33, 33, 0.05)" // More transparent
              className="animate-pulse"
            />
            
            {/* Middle pulse */}
            <circle
              cx={city.x}
              cy={city.y}
              r={6}
              fill="rgba(217, 33, 33, 0.1)" // More transparent
            />
            
            {/* Main dot - completely transparent fill with stroke */}
            <circle
              cx={city.x}
              cy={city.y}
              r={4}
              fill="transparent" // Completely transparent fill
              stroke="#D92121" // Red stroke
              strokeWidth="1.5"
            />
            
            {/* Small center dot */}
            <circle
              cx={city.x}
              cy={city.y}
              r={1}
              fill="#D92121" // Small dot in center
            />
          </g>
          
          {/* City label */}
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

export default MapCities;
