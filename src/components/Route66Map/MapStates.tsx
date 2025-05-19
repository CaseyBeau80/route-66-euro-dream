
import React from "react";
import { route66States } from "./mapData";

interface MapStatesProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
}

// DOM version for MapRenderer.tsx
const MapStates = ({ selectedState, onStateClick }: MapStatesProps) => {
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
  
  // DOM version for MapRenderer
  const createStatesPaths = () => {
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
      statePath.setAttribute('class', 'cursor-pointer hover:fill-[#7D9CB3] transition-colors duration-200');
      
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
    
    return statesPaths;
  };
  
  // React version for MapRendererReact
  const renderReactStates = () => {
    return (
      <g fill="#a3c1e0" stroke="#ffffff" strokeWidth="1.5">
        {route66States.map(state => {
          const stateCenter = getStateCentroid(state.d);
          return (
            <React.Fragment key={state.id}>
              <path
                d={state.d}
                id={`state-${state.id}`}
                fill={selectedState === state.id ? '#5D7B93' : state.color}
                data-state={state.id}
                data-state-name={state.name}
                className="cursor-pointer hover:fill-[#7D9CB3] transition-colors duration-200"
                onClick={() => onStateClick(state.id, state.name)}
              />
              {stateCenter && (
                <text
                  x={stateCenter.x}
                  y={stateCenter.y}
                  textAnchor="middle"
                  fontSize="12"
                  className="font-semibold pointer-events-none"
                  fill={selectedState === state.id ? '#ffffff' : '#444444'}
                >
                  {state.id}
                </text>
              )}
            </React.Fragment>
          );
        })}
      </g>
    );
  };

  return {
    createStatesPaths,
    renderReactStates
  };
};

// MapStatesComponent - Used in MapRendererReact as JSX component
export const MapStatesComponent = ({ selectedState, onStateClick }: MapStatesProps) => {
  const mapStates = MapStates({ selectedState, onStateClick });
  return mapStates.renderReactStates();
};

export default MapStates;
