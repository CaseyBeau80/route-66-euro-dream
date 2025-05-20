
import { route66States } from "../mapData";
import { getStateCentroid } from "../utils/mapStateUtils";

interface DomMapStatesProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
}

/**
 * DOM-based implementation of MapStates for legacy support
 */
const DomMapStates = ({ selectedState, onStateClick }: DomMapStatesProps) => {
  const createStatesPaths = () => {
    const statesPaths = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    statesPaths.setAttribute('stroke', '#ffffff');
    statesPaths.setAttribute('stroke-width', '1');
    
    // Add all states
    const allUSStates = [...route66States];
    
    allUSStates.forEach(state => {
      // Determine if this is a Route 66 state
      const isRoute66State = route66States.some(r66 => r66.id === state.id);
      
      const statePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      statePath.setAttribute('d', state.d);
      statePath.setAttribute('id', `state-${state.id}`);
      
      // Set fill color based on whether it's a Route 66 state, selected state, or other state
      if (selectedState === state.id) {
        statePath.setAttribute('fill', '#5D7B93'); // Selected state color
      } else if (isRoute66State) {
        statePath.setAttribute('fill', '#7D9CB3'); // Route 66 state color
      } else {
        statePath.setAttribute('fill', '#d3d3d3'); // Non-Route 66 state color
      }
      
      statePath.setAttribute('data-state', state.id);
      statePath.setAttribute('data-state-name', state.name);
      statePath.setAttribute('class', isRoute66State ? 'cursor-pointer' : '');
      statePath.setAttribute('opacity', '1');
      
      // Add hover effect using event listeners, but only for Route 66 states
      if (isRoute66State) {
        statePath.addEventListener('mouseover', () => {
          if (selectedState !== state.id) {
            statePath.setAttribute('fill', '#5D7B93');
          }
          statePath.setAttribute('opacity', '0.9');
        });
        
        statePath.addEventListener('mouseout', () => {
          if (selectedState !== state.id) {
            statePath.setAttribute('fill', '#7D9CB3');
          }
          statePath.setAttribute('opacity', '1');
        });
        
        // Add click event only to Route 66 states
        statePath.addEventListener('click', () => {
          onStateClick(state.id, state.name);
        });
      }
      
      statesPaths.appendChild(statePath);
      
      // Add state label for all states
      const stateCenter = getStateCentroid(state.d);
      if (stateCenter) {
        // Create a background rectangle for better visibility
        const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        labelBg.setAttribute('x', (stateCenter.x - 12).toString());
        labelBg.setAttribute('y', (stateCenter.y - 10).toString());
        labelBg.setAttribute('width', '24');
        labelBg.setAttribute('height', '16');
        labelBg.setAttribute('rx', '4');
        labelBg.setAttribute('fill', selectedState === state.id ? '#5D7B93' : 'rgba(255,255,255,0.7)');
        labelBg.setAttribute('class', 'pointer-events-none');
        statesPaths.appendChild(labelBg);
        
        // Add the state text
        const stateLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        stateLabel.setAttribute('x', stateCenter.x.toString());
        stateLabel.setAttribute('y', stateCenter.y.toString());
        stateLabel.setAttribute('text-anchor', 'middle');
        stateLabel.setAttribute('dominant-baseline', 'middle');
        stateLabel.setAttribute('font-size', '10');
        stateLabel.setAttribute('font-weight', 'bold');
        stateLabel.setAttribute('class', 'pointer-events-none');
        stateLabel.setAttribute('fill', selectedState === state.id ? '#ffffff' : '#333333');
        stateLabel.textContent = state.id;
        statesPaths.appendChild(stateLabel);
      }
    });
    
    return statesPaths;
  };

  return { createStatesPaths };
};

export default DomMapStates;
