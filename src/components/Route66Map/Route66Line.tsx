
import React, { useEffect, useRef } from "react";

interface Route66LineProps {
  animated?: boolean;
}

const Route66Line = ({ animated = true }: Route66LineProps) => {
  const createRoutePath = () => {
    const routePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Updated path coordinates to better align with the city positions
    routePath.setAttribute('d', 'M120,410 C125,405 130,395 135,390 C145,380 155,375 165,370 C175,365 185,362 195,360 C210,358 225,355 240,353 C255,350 270,348 285,346 C300,344 315,342 330,340 C345,338 360,336 375,334 C390,332 405,330 420,328 C435,326 450,324 465,320 C480,315 495,310 510,302 C525,295 540,285 555,275 C570,265 585,250 600,235 C610,220 615,210 618,205');
    
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
      d="M120,410 C125,405 130,395 135,390 C145,380 155,375 165,370 C175,365 185,362 195,360 C210,358 225,355 240,353 C255,350 270,348 285,346 C300,344 315,342 330,340 C345,338 360,336 375,334 C390,332 405,330 420,328 C435,326 450,324 465,320 C480,315 495,310 510,302 C525,295 540,285 555,275 C570,265 585,250 600,235 C610,220 615,210 618,205"
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
