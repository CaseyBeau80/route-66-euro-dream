
import React, { useEffect, useRef } from "react";

interface Route66LineProps {
  animated?: boolean;
}

const Route66Line = ({ animated = true }: Route66LineProps) => {
  const createRoutePath = () => {
    const routePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Complete reimplementation of the path to accurately follow state borders
    routePath.setAttribute('d', 'M137,430 C140,425 145,420 150,415 C155,410 160,405 165,400 C170,395 175,390 180,387 C190,385 200,383 210,383 C220,383 230,384 240,386 C250,388 260,390 270,392 C280,394 290,396 300,398 C310,400 320,401 330,401 C340,400 350,397 360,392 C370,387 380,383 390,380 C400,377 410,374 420,370 C430,366 440,362 450,358 C460,354 470,350 480,346 C490,342 500,338 510,334 C520,330 530,325 540,320 C550,315 560,310 570,300 C580,290 590,280 600,270 C605,260 610,250 615,240');
    
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
      d="M137,430 C140,425 145,420 150,415 C155,410 160,405 165,400 C170,395 175,390 180,387 C190,385 200,383 210,383 C220,383 230,384 240,386 C250,388 260,390 270,392 C280,394 290,396 300,398 C310,400 320,401 330,401 C340,400 350,397 360,392 C370,387 380,383 390,380 C400,377 410,374 420,370 C430,366 440,362 450,358 C460,354 470,350 480,346 C490,342 500,338 510,334 C520,330 530,325 540,320 C550,315 560,310 570,300 C580,290 590,280 600,270 C605,260 610,250 615,240"
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
