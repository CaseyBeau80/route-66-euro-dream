
import React, { useState, useEffect } from 'react';

const Route66Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Route 66 was established on November 11, 1926
    // 100th anniversary will be November 11, 2026
    const targetDate = new Date('November 11, 2026 00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown-container max-w-4xl mx-auto p-8 rounded-lg relative overflow-hidden">
      {/* Americana paper background with chrome frame */}
      <div 
        className="absolute inset-0 rounded-xl"
        style={{
          background: `
            linear-gradient(45deg, #f8f9fa 0%, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%, #f8f9fa 100%),
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(220, 53, 69, 0.05) 2px,
              rgba(220, 53, 69, 0.05) 4px
            )
          `,
          border: '8px solid',
          borderImage: 'linear-gradient(135deg, #C0C0C0, #E8E8E8, #A8A8A8, #D3D3D3, #C0C0C0) 1',
          boxShadow: `
            inset 0 0 20px rgba(0,0,0,0.1),
            0 0 30px rgba(0,0,0,0.3),
            0 0 60px rgba(220, 53, 69, 0.2)
          `
        }}
      />

      {/* Chrome corner brackets */}
      <div className="absolute top-2 left-2 w-12 h-12 border-t-4 border-l-4 rounded-tl-lg opacity-80"
           style={{ borderColor: '#E8E8E8', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }} />
      <div className="absolute top-2 right-2 w-12 h-12 border-t-4 border-r-4 rounded-tr-lg opacity-80"
           style={{ borderColor: '#E8E8E8', filter: 'drop-shadow(-2px 2px 4px rgba(0,0,0,0.3))' }} />
      <div className="absolute bottom-2 left-2 w-12 h-12 border-b-4 border-l-4 rounded-bl-lg opacity-80"
           style={{ borderColor: '#E8E8E8', filter: 'drop-shadow(2px -2px 4px rgba(0,0,0,0.3))' }} />
      <div className="absolute bottom-2 right-2 w-12 h-12 border-b-4 border-r-4 rounded-br-lg opacity-80"
           style={{ borderColor: '#E8E8E8', filter: 'drop-shadow(-2px -2px 4px rgba(0,0,0,0.3))' }} />

      {/* Main header with Americana colors */}
      <div className="text-center mb-8 relative z-10">
        <h1 
          className="text-5xl md:text-7xl font-black leading-none tracking-wider mb-4"
          style={{
            fontFamily: "'Black Ops One', 'Impact', sans-serif",
            color: '#DC2626',
            textShadow: `
              3px 3px 0px #FFFFFF,
              6px 6px 0px #1E40AF,
              9px 9px 10px rgba(0,0,0,0.5),
              0 0 20px rgba(255, 255, 255, 0.8),
              0 0 40px rgba(30, 64, 175, 0.6)
            `,
            letterSpacing: '0.15em',
            animation: 'neon-glow 2s ease-in-out infinite alternate'
          }}
        >
          ROUTE 66
        </h1>
        <h2 
          className="text-2xl md:text-3xl font-bold tracking-widest"
          style={{
            fontFamily: "'Russo One', 'Arial Black', sans-serif",
            color: '#1E40AF',
            textShadow: '2px 2px 4px rgba(0,0,0,0.6), 0 0 10px rgba(255, 255, 255, 0.4)',
            letterSpacing: '0.2em'
          }}
        >
          CENTENNIAL COUNTDOWN
        </h2>
      </div>

      {/* Countdown display with Americana colors */}
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

      {/* Americana red banner footer */}
      <div 
        className="relative z-10 mx-4 p-4 rounded-lg"
        style={{
          background: `
            linear-gradient(135deg, #DC2626 0%, #EF4444 50%, #DC2626 100%),
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
            0 0 20px rgba(255, 255, 255, 0.3)
          `
        }}
      >
        <p 
          className="text-lg md:text-xl font-bold text-center tracking-wide mb-2"
          style={{
            fontFamily: "'Russo One', 'Arial Black', sans-serif",
            color: '#FFFFFF',
            textShadow: `
              2px 2px 0px #1E40AF,
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
              1px 1px 0px #1E40AF,
              2px 2px 4px rgba(0,0,0,0.8),
              0 0 10px rgba(248, 249, 250, 0.6)
            `,
            letterSpacing: '0.05em'
          }}
        >
          THE MOTHER ROAD'S CENTENNIAL CELEBRATION
        </p>
      </div>
    </div>
  );
};

export default Route66Countdown;
