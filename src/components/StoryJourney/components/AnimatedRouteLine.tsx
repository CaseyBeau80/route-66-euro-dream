
import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { TimelineMilestone } from '@/data/timelineData';

interface AnimatedRouteLineProps {
  milestones: TimelineMilestone[];
  currentIndex: number;
}

export const AnimatedRouteLine: React.FC<AnimatedRouteLineProps> = ({
  milestones,
  currentIndex
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Create a simplified route path based on the major waypoints
  const createRoutePath = () => {
    const width = 100;
    const height = milestones.length * 60;
    
    // Create a winding path that represents Route 66's journey
    let path = `M 20 20`;
    
    milestones.forEach((milestone, index) => {
      const y = (index + 1) * 60;
      const x = index % 2 === 0 ? 20 : 80; // Alternate sides
      
      if (index === 0) {
        path += ` L ${x} ${y}`;
      } else {
        // Add curves for a more organic route feel
        const prevX = (index - 1) % 2 === 0 ? 20 : 80;
        const controlX = (x + prevX) / 2;
        const controlY = y - 30;
        path += ` Q ${controlX} ${controlY} ${x} ${y}`;
      }
    });

    return { path, width, height };
  };

  const { path, width, height } = createRoutePath();

  return (
    <div 
      ref={containerRef}
      className="fixed right-8 top-0 bottom-0 w-24 pointer-events-none hidden xl:block z-40"
    >
      <div className="sticky top-20 h-screen flex items-center">
        <svg
          width={width}
          height={Math.min(height, window.innerHeight - 160)}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto opacity-60"
        >
          {/* Background path */}
          <path
            d={path}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 4"
          />
          
          {/* Animated progress path */}
          <motion.path
            ref={pathRef}
            d={path}
            stroke="url(#routeGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            style={{
              pathLength
            }}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1B2951" />
              <stop offset="50%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Mile markers */}
          {milestones.map((milestone, index) => {
            const y = (index + 1) * 60;
            const x = index % 2 === 0 ? 20 : 80;
            const isActive = index <= currentIndex;
            
            return (
              <g key={milestone.id}>
                {/* Mile marker circle */}
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={isActive ? "#DC2626" : "rgba(255, 255, 255, 0.3)"}
                  stroke={isActive ? "#F59E0B" : "rgba(255, 255, 255, 0.5)"}
                  strokeWidth="2"
                />
                
                {/* Year label */}
                <text
                  x={x + (index % 2 === 0 ? 12 : -12)}
                  y={y + 1}
                  fontSize="8"
                  fill={isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.6)"}
                  textAnchor={index % 2 === 0 ? "start" : "end"}
                  className="font-mono"
                >
                  {milestone.year}
                </text>
              </g>
            );
          })}

          {/* Moving car icon */}
          <motion.g
            animate={{
              y: currentIndex * 60 + 20
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <text
              x={currentIndex % 2 === 0 ? 35 : 65}
              y={5}
              fontSize="12"
              textAnchor="middle"
              className="filter drop-shadow-sm"
            >
              🚗
            </text>
          </motion.g>
        </svg>
      </div>
    </div>
  );
};
