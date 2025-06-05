
import React from 'react';

const CountdownFooter: React.FC = () => {
  return (
    <div 
      className="relative z-10 mx-4 p-4 rounded-lg"
      style={{
        background: `
          linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #2563eb 100%),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 3px,
            rgba(255,255,255,0.1) 3px,
            rgba(255,255,255,0.1) 6px
          )
        `,
        border: '3px solid',
        borderImage: 'linear-gradient(135deg, #FFFFFF, #F3F4F6, #FFFFFF) 1',
        boxShadow: `
          inset 0 2px 8px rgba(255,255,255,0.2),
          inset 0 -2px 8px rgba(0,0,0,0.3),
          0 4px 12px rgba(0,0,0,0.4),
          0 0 20px rgba(59, 130, 246, 0.3)
        `
      }}
    >
      <p 
        className="text-lg md:text-xl font-bold text-center tracking-wide mb-2"
        style={{
          fontFamily: "'Russo One', 'Arial Black', sans-serif",
          color: '#FFFFFF',
          textShadow: `
            2px 2px 0px #334155,
            4px 4px 8px rgba(0,0,0,0.8),
            0 0 15px rgba(255, 255, 255, 0.8)
          `,
          letterSpacing: '0.1em'
        }}
      >
        CELEBRATING 100 YEARS • NOVEMBER 11, 2026
      </p>
      <p 
        className="text-base md:text-lg text-center tracking-wide"
        style={{
          fontFamily: "'Russo One', 'Arial Black', sans-serif",
          color: '#F8F9FA',
          textShadow: `
            1px 1px 0px #334155,
            2px 2px 4px rgba(0,0,0,0.8),
            0 0 10px rgba(248, 249, 250, 0.6)
          `,
          letterSpacing: '0.05em'
        }}
      >
        THE MOTHER ROAD'S CENTENNIAL CELEBRATION
      </p>
    </div>
  );
};

export default CountdownFooter;
