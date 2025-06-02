
import React from 'react';

interface CountdownDisplayProps {
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

const CountdownDisplay: React.FC<CountdownDisplayProps> = ({ timeLeft }) => {
  return (
    <div className="countdown-display flex justify-center items-center gap-4 md:gap-8 mb-8 relative z-10">
      {[
        { value: timeLeft.days, label: 'DAYS' },
        { value: timeLeft.hours, label: 'HOURS' },
        { value: timeLeft.minutes, label: 'MINUTES' },
        { value: timeLeft.seconds, label: 'SECONDS' }
      ].map((item, index) => (
        <React.Fragment key={index}>
          <div className="countdown-item text-center">
            <div 
              className="countdown-number rounded-lg px-4 py-6 md:px-6 md:py-8 mb-2 relative"
              style={{
                background: `
                  linear-gradient(145deg, #1E293B 0%, #0F172A 50%, #1E293B 100%),
                  radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)
                `,
                border: '4px solid',
                borderImage: 'linear-gradient(135deg, #C0C0C0, #E8E8E8, #A8A8A8, #D3D3D3) 1',
                boxShadow: `
                  inset 4px 4px 8px rgba(255,255,255,0.2),
                  inset -4px -4px 8px rgba(0,0,0,0.5),
                  0 8px 16px rgba(0,0,0,0.4),
                  0 0 20px rgba(255, 255, 255, 0.3)
                `,
                borderRadius: '8px'
              }}
            >
              <span 
                className="text-4xl md:text-6xl font-black leading-none block"
                style={{
                  fontFamily: "'Black Ops One', 'Impact', sans-serif",
                  color: '#FFFFFF',
                  textShadow: `
                    2px 2px 0px #DC2626,
                    4px 4px 8px rgba(0,0,0,0.8),
                    0 0 15px rgba(255, 255, 255, 0.8),
                    0 0 30px rgba(30, 64, 175, 0.4)
                  `,
                  filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))'
                }}
              >
                {item.value.toString().padStart(2, '0')}
              </span>
            </div>
            <div 
              className="countdown-label text-sm md:text-base font-bold tracking-wider"
              style={{
                fontFamily: "'Russo One', 'Arial Black', sans-serif",
                color: '#DC2626',
                textShadow: '1px 1px 2px rgba(0,0,0,0.6), 0 0 8px rgba(255, 255, 255, 0.4)',
                letterSpacing: '0.1em'
              }}
            >
              {item.label}
            </div>
          </div>
          {index < 3 && (
            <div 
              className="countdown-separator text-4xl md:text-5xl font-black"
              style={{
                fontFamily: "'Black Ops One', 'Impact', sans-serif",
                color: '#1E40AF',
                textShadow: `
                  2px 2px 0px #FFFFFF,
                  4px 4px 8px rgba(0,0,0,0.6),
                  0 0 15px rgba(255, 255, 255, 0.6)
                `
              }}
            >
              :
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CountdownDisplay;
