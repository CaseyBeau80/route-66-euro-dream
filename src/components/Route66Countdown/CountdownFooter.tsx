
import React from 'react';

const CountdownFooter: React.FC = () => {
  return (
    <div 
      className="countdown-element relative z-10 mx-4 p-4 rounded-lg"
      style={{
        background: `
          linear-gradient(135deg, #dc2626 0%, #1d4ed8 50%, #dc2626 100%),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 3px,
            rgba(255,255,255,0.15) 3px,
            rgba(255,255,255,0.15) 6px
          )
        `,
        border: '3px solid',
        borderImage: 'linear-gradient(135deg, #FFFFFF, #1d4ed8, #dc2626, #FFFFFF) 1',
        boxShadow: `
          inset 0 2px 8px rgba(255,255,255,0.25),
          inset 0 -2px 8px rgba(0,0,0,0.3),
          0 4px 12px rgba(0,0,0,0.4),
          0 0 20px rgba(220, 38, 38, 0.4),
          0 0 30px rgba(29, 78, 216, 0.3)
        `
      }}
    >
      <p 
        className="countdown-element text-lg md:text-xl font-bold text-center tracking-wide mb-2"
        style={{
          fontFamily: "'Russo One', 'Arial Black', sans-serif",
          color: '#FFFFFF',
          textShadow: `
            2px 2px 0px #000000,
            4px 4px 0px #dc2626,
            6px 6px 8px rgba(0,0,0,0.8),
            0 0 15px rgba(255, 255, 255, 0.9),
            0 0 20px rgba(29, 78, 216, 0.6)
          `,
          letterSpacing: '0.1em'
        }}
      >
        CELEBRATING 100 YEARS • NOVEMBER 11, 2026
      </p>
      <p 
        className="countdown-element text-base md:text-lg text-center tracking-wide"
        style={{
          fontFamily: "'Russo One', 'Arial Black', sans-serif",
          color: '#F8F9FA',
          textShadow: `
            1px 1px 0px #000000,
            2px 2px 0px #1d4ed8,
            4px 4px 6px rgba(0,0,0,0.8),
            0 0 12px rgba(248, 249, 250, 0.8),
            0 0 18px rgba(220, 38, 38, 0.5)
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
