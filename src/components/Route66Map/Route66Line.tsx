
import React, { useEffect, useRef } from "react";

interface Route66LineProps {
  animated?: boolean;
}

const Route66Line = ({ animated = true }: Route66LineProps) => {
  const createRoutePath = () => {
    const routePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Path coordinates precisely aligned with state boundaries and corrected city positions
    // The route follows the historical Route 66 from Chicago to Santa Monica
    routePath.setAttribute('d', 'M618,205 C617,210 615,215 612,220 C608,228 605,230 600,235 C595,240 590,248 585,255 C580,260 570,270 565,275 C560,280 550,285 545,290 C535,295 525,300 515,305 C505,308 495,310 485,312 C475,316 465,320 455,322 C445,325 435,326 425,328 C415,328 405,329 395,330 C380,331 365,332 350,334 C335,336 320,338 305,340 C290,342 275,344 260,346 C245,348 230,350 215,352 C195,356 175,360 155,366 C145,370 135,375 125,382 C122,395 120,400 120,410');
    
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
      d="M618,205 C617,210 615,215 612,220 C608,228 605,230 600,235 C595,240 590,248 585,255 C580,260 570,270 565,275 C560,280 550,285 545,290 C535,295 525,300 515,305 C505,308 495,310 485,312 C475,316 465,320 455,322 C445,325 435,326 425,328 C415,328 405,329 395,330 C380,331 365,332 350,334 C335,336 320,338 305,340 C290,342 275,344 260,346 C245,348 230,350 215,352 C195,356 175,360 155,366 C145,370 135,375 125,382 C122,395 120,400 120,410"
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
