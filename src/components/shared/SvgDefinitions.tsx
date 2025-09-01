import React from 'react';

/**
 * Shared SVG definitions to reduce DOM complexity and duplication
 * This component should be rendered once at the app level
 */
const SvgDefinitions: React.FC = () => {
  return (
    <svg 
      width="0" 
      height="0" 
      style={{ position: 'absolute', visibility: 'hidden' }}
      aria-hidden="true"
    >
      <defs>
        {/* Optimized wood grain texture - reduced stops for DOM efficiency */}
        <linearGradient id="shared-woodGrain" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor:'#8B4513', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#654321', stopOpacity:1}} />
        </linearGradient>

        {/* Optimized metal bracket gradient - reduced complexity */}
        <linearGradient id="shared-metalBracket" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#C0C0C0', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#606060', stopOpacity:1}} />
        </linearGradient>

        {/* Optimized Route 66 shield gradient - fewer stops */}
        <linearGradient id="shared-route66Shield" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{stopColor:'#F5F5DC', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#E6E6D1', stopOpacity:1}} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default SvgDefinitions;