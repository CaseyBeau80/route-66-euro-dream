
import React from 'react';

const DesertBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Desert sunset sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-300 via-amber-200 to-red-200 opacity-40"></div>
      
      {/* Mountain silhouettes with sunset colors */}
      <div className="absolute bottom-0 left-0 w-full h-32">
        <svg viewBox="0 0 1200 200" className="w-full h-full fill-orange-400 opacity-30">
          <polygon points="0,200 200,80 400,100 600,60 800,90 1000,70 1200,80 1200,200" />
          <polygon points="0,200 150,110 300,120 500,90 700,105 900,85 1100,95 1200,100 1200,200" />
        </svg>
      </div>
      
      {/* Desert sand dunes with sunset hues */}
      <div className="absolute bottom-0 left-0 w-full h-20">
        <svg viewBox="0 0 1200 100" className="w-full h-full fill-amber-300 opacity-50">
          <path d="M0,100 Q300,50 600,70 Q900,90 1200,60 L1200,100 Z" />
        </svg>
      </div>
      
      {/* Floating desert particles with warm colors */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-40 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#f59e0b', '#ea580c', '#dc2626', '#f97316'][Math.floor(Math.random() * 4)],
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Desert heat shimmer lines */}
      <div className="absolute bottom-20 left-0 w-full h-8 opacity-20">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"
            style={{
              top: `${i * 25}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DesertBackground;
