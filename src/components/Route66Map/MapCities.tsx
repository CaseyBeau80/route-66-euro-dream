
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
      
      // Outer pulse circle with animation
      const outerPulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      outerPulse.setAttribute('cx', city.x.toString());
      outerPulse.setAttribute('cy', city.y.toString());
      outerPulse.setAttribute('r', '8');
      outerPulse.setAttribute('fill', 'rgba(217, 33, 33, 0.2)');
      outerPulse.setAttribute('class', 'animate-pulse');
      
      // Middle pulse circle
      const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pulse.setAttribute('cx', city.x.toString());
      pulse.setAttribute('cy', city.y.toString());
      pulse.setAttribute('r', '6');
      pulse.setAttribute('fill', 'rgba(217, 33, 33, 0.4)');
      
      // Main dot
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', city.x.toString());
      dot.setAttribute('cy', city.y.toString());
      dot.setAttribute('r', '4');
      dot.setAttribute('fill', '#D92121');
      
      // White center for better visibility
      const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      center.setAttribute('cx', city.x.toString());
      center.setAttribute('cy', city.y.toString());
      center.setAttribute('r', '1.5');
      center.setAttribute('fill', 'white');
      
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

export default MapCities;
