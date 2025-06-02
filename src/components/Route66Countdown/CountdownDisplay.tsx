
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
  const timeUnits = [
    { value: timeLeft.days, label: 'DAYS', bgColor: '#DC2626' },
    { value: timeLeft.hours, label: 'HOURS', bgColor: '#1E40AF' },
    { value: timeLeft.minutes, label: 'MINUTES', bgColor: '#059669' },
    { value: timeLeft.seconds, label: 'SECONDS', bgColor: '#7C2D12' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 relative z-10">
      {timeUnits.map((unit, index) => (
        <div key={index} className="flex flex-col items-center">
          <div 
            className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            style={{
              background: `
                linear-gradient(135deg, ${unit.bgColor} 0%, ${unit.bgColor}CC 100%),
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
                0 0 20px rgba(255, 255, 255, 0.3)
              `
            }}
          >
            <span 
              className="absolute inset-0 flex items-center justify-center text-2xl md:text-3xl font-black tracking-wider"
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
              {String(unit.value).padStart(2, '0')}
            </span>
          </div>
          
          <span 
            className="mt-3 text-sm md:text-base font-bold tracking-widest text-center"
            style={{
              fontFamily: "'Russo One', 'Arial Black', sans-serif",
              color: '#1E40AF',
              textShadow: '1px 1px 2px rgba(0,0,0,0.6), 0 0 8px rgba(255, 255, 255, 0.4)',
              letterSpacing: '0.15em'
            }}
          >
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CountdownDisplay;
