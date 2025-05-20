
import React, { useEffect, useRef } from "react";

interface Route66LineProps {
  animated?: boolean;
}

const Route66Line = ({ animated = true }: Route66LineProps) => {
  const createRoutePath = () => {
    const routePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Carefully refined path coordinates based on accurate Route 66 trajectory
    routePath.setAttribute('d', 'M134,435 C136,432 137,430 140,427 C147,420 152,415 157,410 C162,405 167,402 172,400 C182,395 192,392 202,390 C212,388 222,387 227,385 C237,385 247,385 252,385 C262,385 272,385 277,385 C287,385 297,385 307,385 C317,384 327,382 337,380 C347,378 357,375 367,370 C377,368 387,370 397,370 C407,368 417,365 427,355 C437,350 447,342 457,340 C467,338 477,338 472,338 C482,336 492,335 502,324 C512,328 522,325 532,315 C542,308 552,302 562,295 C572,285 582,275 587,265 C592,255 597,250 602,245 C607,240 610,235 612,230');
    
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
      d="M134,435 C136,432 137,430 140,427 C147,420 152,415 157,410 C162,405 167,402 172,400 C182,395 192,392 202,390 C212,388 222,387 227,385 C237,385 247,385 252,385 C262,385 272,385 277,385 C287,385 297,385 307,385 C317,384 327,382 337,380 C347,378 357,375 367,370 C377,368 387,370 397,370 C407,368 417,365 427,355 C437,350 447,342 457,340 C467,338 477,338 472,338 C482,336 492,335 502,324 C512,328 522,325 532,315 C542,308 552,302 562,295 C572,285 582,275 587,265 C592,255 597,250 602,245 C607,240 610,235 612,230"
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
