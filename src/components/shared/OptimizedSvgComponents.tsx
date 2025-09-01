import React, { useMemo } from 'react';

interface SimplifiedGradientDefsProps {
  id: string;
  colors: Array<{ offset: string; color: string; opacity?: number }>;
}

/**
 * Optimized gradient component that reduces DOM complexity
 * by consolidating multiple gradient definitions into simpler forms
 */
export const SimplifiedGradientDefs: React.FC<SimplifiedGradientDefsProps> = ({ 
  id, 
  colors 
}) => {
  const optimizedColors = useMemo(() => {
    // If more than 2 colors, simplify to just start and end colors
    if (colors.length > 2) {
      return [colors[0], colors[colors.length - 1]];
    }
    return colors;
  }, [colors]);

  return (
    <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
      {optimizedColors.map((color, index) => (
        <stop 
          key={index}
          offset={color.offset} 
          style={{
            stopColor: color.color, 
            stopOpacity: color.opacity ?? 1
          }} 
        />
      ))}
    </linearGradient>
  );
};

/**
 * DOM-optimized SVG icon component that reduces nesting depth
 */
export const OptimizedIconSVG: React.FC<{
  viewBox?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ 
  viewBox = "0 0 24 24", 
  className = "", 
  children 
}) => (
  <svg 
    viewBox={viewBox} 
    className={`inline-block ${className}`}
    fill="currentColor"
  >
    {children}
  </svg>
);