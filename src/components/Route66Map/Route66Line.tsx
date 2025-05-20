
import React, { useEffect, useRef } from "react";

interface Route66LineProps {
  animated?: boolean;
  cities: Array<{ x: number; y: number; name: string }>;
}

const Route66Line = ({ animated = true, cities = [] }: Route66LineProps) => {
  const createRoutePath = () => {
    const routePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Generate the path dynamically based on city coordinates
    let pathD = "";
    
    // Start at the first city (Chicago)
    if (cities.length > 0) {
      pathD = `M${cities[0].x},${cities[0].y}`;
      
      // Create a smooth curve through each city
      for (let i = 1; i < cities.length; i++) {
        // Simple curve to the next point
        const prevCity = cities[i-1];
        const currentCity = cities[i];
        
        // Calculate control points for smoother curve
        // Control point is slightly closer to the current point to create a more natural path
        const dx = currentCity.x - prevCity.x;
        const dy = currentCity.y - prevCity.y;
        
        pathD += ` C${prevCity.x + dx*0.4},${prevCity.y + dy*0.1} ${currentCity.x - dx*0.4},${currentCity.y - dy*0.1} ${currentCity.x},${currentCity.y}`;
      }
    } else {
      // Fallback path if no cities provided
      pathD = 'M618,205 C615,208 613,212 610,218 C607,225 605,230 600,235 C595,240 590,245 588,248 C585,252 580,255 575,260 C570,265 565,270 560,275 C555,280 550,285 545,290 C540,292 535,295 530,298 C525,300 520,302 515,305 C510,307 505,308 500,309 C495,310 490,311 485,312 C480,314 475,316 470,318 C465,320 460,321 455,322 C450,323 445,324 440,325 C435,326 430,327 425,328 C420,328 415,329 410,329 C405,330 400,330 395,330 C390,331 385,331 380,332 C375,332 370,333 365,333 C360,334 355,334 350,335 C340,336 330,337 320,338 C310,339 300,340 290,342 C280,343 270,345 260,346 C250,347 240,349 230,350 C220,351 210,353 200,354 C190,355 180,357 170,359 C160,362 150,364 140,368 C135,370 130,373 125,382 C122,390 120,400 120,410';
    }
    
    routePath.setAttribute('d', pathD);
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
export const Route66LineComponent = ({ animated = true, cities = [] }: Route66LineProps) => {
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
  
  // Generate the path dynamically
  const generatePath = () => {
    if (cities.length === 0) {
      // Fallback path if no cities provided
      return 'M618,205 C615,208 613,212 610,218 C607,225 605,230 600,235 C595,240 590,245 588,248 C585,252 580,255 575,260 C570,265 565,270 560,275 C555,280 550,285 545,290 C540,292 535,295 530,298 C525,300 520,302 515,305 C510,307 505,308 500,309 C495,310 490,311 485,312 C480,314 475,316 470,318 C465,320 460,321 455,322 C450,323 445,324 440,325 C435,326 430,327 425,328 C420,328 415,329 410,329 C405,330 400,330 395,330 C390,331 385,331 380,332 C375,332 370,333 365,333 C360,334 355,334 350,335 C340,336 330,337 320,338 C310,339 300,340 290,342 C280,343 270,345 260,346 C250,347 240,349 230,350 C220,351 210,353 200,354 C190,355 180,357 170,359 C160,362 150,364 140,368 C135,370 130,373 125,382 C122,390 120,400 120,410';
    }
    
    // Start with the first city
    let pathD = `M${cities[0].x},${cities[0].y}`;
    
    // Create a smooth curve through each city
    for (let i = 1; i < cities.length; i++) {
      const prevCity = cities[i-1];
      const currentCity = cities[i];
      
      // Calculate control points for smoother curve
      const dx = currentCity.x - prevCity.x;
      const dy = currentCity.y - prevCity.y;
      
      pathD += ` C${prevCity.x + dx*0.4},${prevCity.y + dy*0.1} ${currentCity.x - dx*0.4},${currentCity.y - dy*0.1} ${currentCity.x},${currentCity.y}`;
    }
    
    return pathD;
  };
  
  return (
    <path
      ref={pathRef}
      d={generatePath()}
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
