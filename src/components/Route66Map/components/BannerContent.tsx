
import React from 'react';

const BannerContent: React.FC = () => {
  return (
    <div className="relative z-10 flex items-center justify-center py-3 px-4">
      {/* Central Title */}
      <div className="flex-1 text-center px-4">
        <h2 
          className="text-lg font-bold tracking-wider leading-tight"
          style={{
            fontFamily: "'Russo One', 'Arial Black', sans-serif",
            color: '#F5F5DC',
            textShadow: `
              2px 2px 0px #8B4513,
              4px 4px 0px #DC2626,
              6px 6px 8px rgba(0,0,0,0.8),
              0 0 15px rgba(255,215,0,0.4),
              0 0 25px rgba(72,202,228,0.3)
            `,
            letterSpacing: '0.15em',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
          }}
        >
          ROUTE 66 INTERACTIVE MAP
        </h2>
        
        {/* Vintage Subtitle */}
        <div 
          className="text-xs mt-1 tracking-widest opacity-90"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: '#F5F5DC',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            letterSpacing: '0.2em'
          }}
        >
          THE MOTHER ROAD EXPERIENCE
        </div>
      </div>
    </div>
  );
};

export default BannerContent;
