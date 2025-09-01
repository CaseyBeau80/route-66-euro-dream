import React from 'react';

/**
 * Ultra-minimal SVG definitions to reduce DOM size
 * Optimized for performance with minimal gradient stops
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
        {/* Minimal wood grain - single gradient stop to reduce DOM complexity */}
        <linearGradient id="shared-woodGrain">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="100%" stopColor="#654321" />
        </linearGradient>

        {/* Minimal metal bracket - simplified */}
        <linearGradient id="shared-metalBracket">
          <stop offset="0%" stopColor="#C0C0C0" />
          <stop offset="100%" stopColor="#606060" />
        </linearGradient>

        {/* Minimal Route 66 shield - simplified */}
        <linearGradient id="shared-route66Shield">
          <stop offset="0%" stopColor="#F5F5DC" />
          <stop offset="100%" stopColor="#E6E6D1" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default SvgDefinitions;