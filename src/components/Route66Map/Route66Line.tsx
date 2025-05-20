
import React, { useEffect, useRef } from "react";

interface Route66LineProps {
  animated?: boolean;
}

const Route66Line = ({ animated = true }: Route66LineProps) => {
  const createRoutePath = () => {
    const routePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Updated path coordinates to match the adjusted city positions
    routePath.setAttribute('d', 'M120,410 C125,405 130,400 135,395 C145,385 155,378 165,372 C175,368 185,365 195,363 C210,360 225,358 235,367 C250,367 265,367 275,367 C295,367 310,367 320,367 C330,367 340,367 350,366 C360,365 370,363 380,365 C390,367 400,370 410,365 C420,360 430,350 440,345 C450,340 460,335 470,330 C480,325 490,320 497,315 C505,310 512,303 520,300 C530,290 540,285 550,280 C562,272 575,260 587,240 C595,230 602,220 610,210');
    
    routePath.setAttribute('stroke', '#D92121');
    routePath.setAttribute('stroke-width', '6');
    routePath.setAttribute('fill', 'none');
    routePath.setAttribute('stroke-linecap', 'round');
    routePath.setAttribute('stroke-linejoin', 'round');
    
    if (animated) {
      // Add dash animation with improved settings
      const pathLength = routePath.getTotalLength ? routePath.getTotalLength() : 1000;
      routePath.setAttribute('stroke-dasharray', pathLength.toString());
      routePath.setAttribute('stroke-dashoffset', pathLength.toString());
      
      // Add animation with CSS
      routePath.style.animation = 'route66-dash 3s ease-in-out forwards';
      routePath.style.animationDelay = '0.5s';
    } else {
      // Standard dashed line if not animated
      routePath.setAttribute('stroke-dasharray', '6 3');
    }
    
    return routePath;
  };

  return {
    createRoutePath
  };
};

// Add a style element for the animation
if (typeof document !== 'undefined') {
  // Check if animation style already exists
  const styleId = 'route66-animation-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes route66-dash {
        to {
          stroke-dashoffset: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// React component for MapRendererReact
export const Route66LineComponent = ({ animated = true }: Route66LineProps) => {
  const pathRef = useRef<SVGPathElement>(null);
  
  useEffect(() => {
    if (animated && pathRef.current) {
      const pathLength = pathRef.current.getTotalLength();
      pathRef.current.style.strokeDasharray = pathLength.toString();
      pathRef.current.style.strokeDashoffset = pathLength.toString();
      pathRef.current.style.animation = 'route66-dash 3s ease-in-out forwards';
      pathRef.current.style.animationDelay = '0.5s';
    }
  }, [animated]);
  
  return (
    <path
      ref={pathRef}
      d="M120,410 C125,405 130,400 135,395 C145,385 155,378 165,372 C175,368 185,365 195,363 C210,360 225,358 235,367 C250,367 265,367 275,367 C295,367 310,367 320,367 C330,367 340,367 350,366 C360,365 370,363 380,365 C390,367 400,370 410,365 C420,360 430,350 440,345 C450,340 460,335 470,330 C480,325 490,320 497,315 C505,310 512,303 520,300 C530,290 540,285 550,280 C562,272 575,260 587,240 C595,230 602,220 610,210"
      stroke="#D92121"
      strokeWidth="6"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={animated ? undefined : "6 3"}
    />
  );
};

export default Route66Line;
