
import React from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownDisplayProps {
  timeLeft: TimeLeft;
}

const CountdownDisplay: React.FC<CountdownDisplayProps> = ({ timeLeft }) => {
  return (
    <div className="flex flex-col items-center mb-8 relative z-10">
      {/* Main Days Display */}
      <div className="flex flex-col items-center">
        <div 
          className="countdown-element relative w-32 h-32 md:w-40 md:h-40 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 mb-6"
          style={{
            background: `
              linear-gradient(135deg, #dc2626 0%, #b91c1c 100%),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(255,255,255,0.1) 2px,
                rgba(255,255,255,0.1) 4px
              )
            `,
            border: '3px solid',
            borderImage: 'linear-gradient(135deg, #FFFFFF, #F3F4F6, #FFFFFF) 1',
            boxShadow: `
              inset 0 2px 8px rgba(255,255,255,0.2),
              inset 0 -2px 8px rgba(0,0,0,0.3),
              0 4px 12px rgba(0,0,0,0.4),
              0 0 20px rgba(220, 38, 38, 0.3)
            `
          }}
        >
          <span 
            className="countdown-element absolute inset-0 flex items-center justify-center text-4xl md:text-5xl font-black tracking-wider"
            style={{
              fontFamily: "'Black Ops One', 'Impact', sans-serif",
              color: '#FFFFFF',
              textShadow: `
                2px 2px 0px #000000,
                4px 4px 8px rgba(0,0,0,0.8),
                0 0 15px rgba(255, 255, 255, 0.8)
              `,
              letterSpacing: '0.1em'
            }}
          >
            {String(timeLeft.days).padStart(2, '0')}
          </span>
        </div>
        
        <span 
          className="countdown-element text-xl md:text-2xl font-bold tracking-widest text-center mb-4"
          style={{
            fontFamily: "'Russo One', 'Arial Black', sans-serif",
            color: '#dc2626',
            textShadow: '1px 1px 2px rgba(0,0,0,0.6), 0 0 8px rgba(220, 38, 38, 0.4)',
            letterSpacing: '0.15em'
          }}
        >
          DAYS REMAINING
        </span>
      </div>

      {/* Celebration Message */}
      <div className="text-center max-w-md">
        <p 
          className="countdown-element text-lg md:text-xl font-bold tracking-wide"
          style={{
            fontFamily: "'Russo One', 'Arial Black', sans-serif",
            color: '#7f1d1d',
            textShadow: '1px 1px 2px rgba(0,0,0,0.6), 0 0 8px rgba(127, 29, 29, 0.4)',
            letterSpacing: '0.1em'
          }}
        >
          Until Route 66's 100th Anniversary!
        </p>
      </div>
    </div>
  );
};

export default CountdownDisplay;
