
import React from "react";
import { getStateCentroid } from "../utils/mapStateUtils";
import StateLabel from "./StateLabel";

interface StatePathProps {
  state: {
    id: string;
    name: string;
    d: string;
  };
  isRoute66State: boolean;
  isSelected: boolean;
  onClick?: () => void;
}

/**
 * Component for rendering an individual state path with its label
 */
const StatePath = ({ state, isRoute66State, isSelected, onClick }: StatePathProps) => {
  // Determine fill color based on state type and selection
  let fillColor;
  if (isSelected) {
    fillColor = '#5D7B93'; // Selected state color
  } else if (isRoute66State) {
    fillColor = '#7D9CB3'; // Route 66 state color
  } else {
    fillColor = '#e0e0e0'; // Non-Route 66 state color - made slightly lighter for contrast
  }
  
  const stateCenter = getStateCentroid(state.d);
  
  return (
    <>
      <path
        d={state.d}
        id={`state-${state.id}`}
        fill={fillColor}
        stroke="#ffffff"
        strokeWidth={isRoute66State ? "1.5" : "1"} // Thicker borders for Route 66 states
        data-state={state.id}
        data-state-name={state.name}
        className={isRoute66State ? "cursor-pointer hover:opacity-90" : ""}
        onClick={onClick}
      />
      {stateCenter && (
        <StateLabel 
          centroid={stateCenter}
          stateId={state.id}
          isSelected={isSelected}
        />
      )}
    </>
  );
};

export default StatePath;
