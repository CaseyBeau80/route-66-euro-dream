
import React from "react";

interface StateLabelProps {
  centroid: {x: number, y: number};
  stateId: string;
  isSelected: boolean;
}

/**
 * Component for rendering a state label with background
 */
const StateLabel = ({ centroid, stateId, isSelected }: StateLabelProps) => {
  return (
    <>
      <rect
        x={centroid.x - 12}
        y={centroid.y - 10}
        width={24}
        height={16}
        rx={4}
        fill={isSelected ? '#5D7B93' : 'rgba(255,255,255,0.7)'}
        className="pointer-events-none"
      />
      <text
        x={centroid.x}
        y={centroid.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="10"
        fontWeight="bold"
        className="pointer-events-none"
        fill={isSelected ? '#ffffff' : '#333333'}
      >
        {stateId}
      </text>
    </>
  );
};

export default StateLabel;
