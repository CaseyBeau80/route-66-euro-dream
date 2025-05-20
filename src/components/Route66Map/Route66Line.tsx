
import React, { useEffect, useRef } from "react";

interface Route66LineProps {
  animated?: boolean;
}

const Route66Line = ({ animated = true }: Route66LineProps) => {
  const createRoutePath = () => {
    const routePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Path coordinates precisely aligned with the state boundaries and city markers
    routePath.setAttribute('d', 'M618,205 C615,210 610,220 605,230 C600,240 595,250 590,255 C580,265 570,270 560,280 C545,290 535,295 525,300 C515,305 505,308 495,310 C485,312 475,316 465,320 C455,322 445,325 435,326 C425,327 415,327 405,328 C390,329 375,330 360,332 C345,334 330,335 315,338 C300,340 285,342 270,345 C255,348 240,350 225,353 C200,358 180,362 160,368 C150,372 140,377 130,385 C125,400 120,405 120,410');
    
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
      d="M618,205 C615,210 610,220 605,230 C600,240 595,250 590,255 C580,265 570,270 560,280 C545,290 535,295 525,300 C515,305 505,308 495,310 C485,312 475,316 465,320 C455,322 445,325 435,326 C425,327 415,327 405,328 C390,329 375,330 360,332 C345,334 330,335 315,338 C300,340 285,342 270,345 C255,348 240,350 225,353 C200,358 180,362 160,368 C150,372 140,377 130,385 C125,400 120,405 120,410"
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
