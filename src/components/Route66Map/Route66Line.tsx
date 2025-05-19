
import React, { useEffect, useRef } from "react";

interface Route66LineProps {
  animated?: boolean;
}

const Route66Line = ({ animated = true }: Route66LineProps) => {
  const createRoutePath = () => {
    const routePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Enhanced path with more detailed points for a smoother Route 66 line using bezier curves
    routePath.setAttribute('d', 'M645,250 C640,255 635,260 630,270 C625,280 620,290 617,300 C610,305 605,308 600,310 C595,315 592,318 590,320 C580,320 575,320 570,320 C565,320 562,320 560,320 C550,325 545,328 540,330 C530,335 525,338 520,340 C510,348 505,352 500,355 C490,363 485,367 480,370 C472,373 468,374 465,375 C457,378 453,379 450,380 C437,388 431,392 425,395 C412,403 406,407 400,410 C387,410 381,410 375,410 C362,410 356,410 350,410 C337,415 331,418 325,420 C312,425 306,428 300,430 C287,433 281,434 275,435 C262,438 256,439 250,440 C237,443 231,444 225,445 C212,448 206,449 200,450');
    
    routePath.setAttribute('stroke', '#D92121');
    routePath.setAttribute('stroke-width', '4');
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
      d="M645,250 C640,255 635,260 630,270 C625,280 620,290 617,300 C610,305 605,308 600,310 C595,315 592,318 590,320 C580,320 575,320 570,320 C565,320 562,320 560,320 C550,325 545,328 540,330 C530,335 525,338 520,340 C510,348 505,352 500,355 C490,363 485,367 480,370 C472,373 468,374 465,375 C457,378 453,379 450,380 C437,388 431,392 425,395 C412,403 406,407 400,410 C387,410 381,410 375,410 C362,410 356,410 350,410 C337,415 331,418 325,420 C312,425 306,428 300,430 C287,433 281,434 275,435 C262,438 256,439 250,440 C237,443 231,444 225,445 C212,448 206,449 200,450"
      stroke="#D92121"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={animated ? undefined : "6 3"}
    />
  );
};

export default Route66Line;
