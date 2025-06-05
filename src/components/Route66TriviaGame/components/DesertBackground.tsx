
import React from 'react';

const DesertBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Desert sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-200 via-amber-100 to-yellow-50 opacity-30"></div>
      
      {/* Mountain silhouettes */}
      <div className="absolute bottom-0 left-0 w-full h-32">
        <svg viewBox="0 0 1200 200" className="w-full h-full fill-gray-400 opacity-20">
          <polygon points="0,200 200,100 400,120 600,80 800,110 1000,90 1200,100 1200,200" />
          <polygon points="0,200 150,130 300,140 500,110 700,125 900,105 1100,115 1200,120 1200,200" />
        </svg>
      </div>
      
      {/* Desert sand dunes */}
      <div className="absolute bottom-0 left-0 w-full h-20">
        <svg viewBox="0 0 1200 100" className="w-full h-full fill-yellow-200 opacity-40">
          <path d="M0,100 Q300,60 600,80 Q900,100 1200,70 L1200,100 Z" />
        </svg>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DesertBackground;
