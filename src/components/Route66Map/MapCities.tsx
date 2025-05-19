
import { useEffect, useRef } from "react";

interface MapCitiesProps {
  cities: Array<{
    x: number;
    y: number;
    name: string;
  }>;
}

const MapCities = ({ cities }: MapCitiesProps) => {
  const createCityMarkers = () => {
    const markers = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    cities.forEach(city => {
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
    
    return markers;
  };

  return {
    createCityMarkers
  };
};

export default MapCities;
