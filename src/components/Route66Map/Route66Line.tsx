

import React, { useEffect, useRef } from "react";

interface Route66LineProps {
  animated?: boolean;
}

const Route66Line = ({ animated = true }: Route66LineProps) => {
  const createRoutePath = () => {
    const routePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Enhanced path following the actual Route 66 through all states with proper coordinates
    // This path connects the cities in the majorCities array in MapRendererReact.tsx
    routePath.setAttribute('d', 'M145,430 C145,428 148,426 150,425 C155,423 158,419 160,415 C170,410 175,408 180,405 C190,397 195,393 200,390 C210,388 215,387 220,387 C230,389 240,389 250,390 C260,391 265,393 270,395 C280,397 300,399 320,400 C330,395 330,392 330,390 C343,387 350,386 360,385 C375,380 382,378 390,375 C405,370 425,362 445,355 C458,348 465,343 470,340 C485,335 492,332 500,330 C512,324 516,322 520,320 C530,310 540,302 550,295 C560,285 565,280 570,275 C580,265 585,260 588,255 C590,248 592,245 593,242');
    
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
      d="M145,430 C145,428 148,426 150,425 C155,423 158,419 160,415 C170,410 175,408 180,405 C190,397 195,393 200,390 C210,388 215,387 220,387 C230,389 240,389 250,390 C260,391 265,393 270,395 C280,397 300,399 320,400 C330,395 330,392 330,390 C343,387 350,386 360,385 C375,380 382,378 390,375 C405,370 425,362 445,355 C458,348 465,343 470,340 C485,335 492,332 500,330 C512,324 516,322 520,320 C530,310 540,302 550,295 C560,285 565,280 570,275 C580,265 585,260 588,255 C590,248 592,245 593,242"
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

