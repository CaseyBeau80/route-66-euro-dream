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
        {/* Wood grain texture for Route 66 signs */}
        <linearGradient id="shared-woodGrain" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor:'#8B4513', stopOpacity:1}} />
          <stop offset="20%" style={{stopColor:'#A0522D', stopOpacity:1}} />
          <stop offset="40%" style={{stopColor:'#8B4513', stopOpacity:1}} />
          <stop offset="60%" style={{stopColor:'#654321', stopOpacity:1}} />
          <stop offset="80%" style={{stopColor:'#8B4513', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#A0522D', stopOpacity:1}} />
        </linearGradient>

        {/* Metal bracket gradient */}
        <linearGradient id="shared-metalBracket" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#C0C0C0', stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:'#808080', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#606060', stopOpacity:1}} />
        </linearGradient>

        {/* Post shadow filter */}
        <filter id="shared-postShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.4"/>
        </filter>

        {/* Route 66 shield gradient */}
        <linearGradient id="shared-route66Shield" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{stopColor:'#F5F5DC', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#E6E6D1', stopOpacity:1}} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default SvgDefinitions;