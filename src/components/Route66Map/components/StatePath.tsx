
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
    fillColor = '#5D7B93'; // Selected state color - kept the same
  } else if (isRoute66State) {
    fillColor = '#6B8DA5'; // Route 66 state color - made darker for more prominence
  } else {
    fillColor = '#e8e8e8'; // Non-Route 66 state color - made lighter for more contrast
  }
  
  const stateCenter = getStateCentroid(state.d);
  
  return (
    <>
      <path
        d={state.d}
        id={`state-${state.id}`}
        fill={fillColor}
        stroke="#ffffff"
        strokeWidth={isRoute66State ? "2" : "1"} // Increased stroke width for Route 66 states
        data-state={state.id}
        data-state-name={state.name}
        className={isRoute66State ? "cursor-pointer hover:opacity-80" : ""}
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
