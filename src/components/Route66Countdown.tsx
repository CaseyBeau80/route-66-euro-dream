
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
    <div 
      className="countdown-container max-w-4xl mx-auto p-8 rounded-lg relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #8B4513 100%)',
        boxShadow: 'inset 0 4px 15px rgba(0,0,0,0.3), 0 8px 25px rgba(0,0,0,0.4)',
        border: '4px solid #DAA520',
        borderRadius: '20px'
      }}
    >
      {/* Vintage paper texture overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.1) 2px,
              rgba(255,255,255,0.1) 4px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.05) 2px,
              rgba(0,0,0,0.05) 4px
            )
          `
        }}
      ></div>

      {/* Main header */}
      <div className="text-center mb-8 relative z-10">
        <h1 
          className="text-6xl md:text-8xl font-black text-white leading-none tracking-wider mb-4"
          style={{
            fontFamily: "'Bebas Neue', 'Arial Black', Impact, sans-serif",
            textShadow: '4px 4px 0px #8B0000, 8px 8px 15px rgba(0,0,0,0.8)',
            letterSpacing: '0.1em'
          }}
        >
          ROUTE 66
        </h1>
        <h2 
          className="text-3xl md:text-4xl font-bold text-yellow-300 tracking-widest"
          style={{
            fontFamily: "'Bebas Neue', 'Arial Black', Impact, sans-serif",
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}
        >
          CENTENNIAL COUNTDOWN
        </h2>
      </div>

      {/* Countdown display */}
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
                className="countdown-number bg-yellow-100 border-4 border-gray-800 rounded-lg px-4 py-6 md:px-6 md:py-8 shadow-lg mb-2"
                style={{
                  background: 'linear-gradient(145deg, #FFF8DC 0%, #F5DEB3 100%)',
                  boxShadow: 'inset 2px 2px 8px rgba(0,0,0,0.2), 4px 4px 12px rgba(0,0,0,0.4)'
                }}
              >
                <span 
                  className="text-4xl md:text-6xl font-black text-gray-900 leading-none"
                  style={{
                    fontFamily: "'Bebas Neue', 'Arial Black', Impact, sans-serif",
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  {item.value.toString().padStart(2, '0')}
                </span>
              </div>
              <div 
                className="countdown-label text-sm md:text-base font-bold text-yellow-200 tracking-wider"
                style={{
                  fontFamily: "'Bebas Neue', 'Arial Black', Impact, sans-serif",
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                }}
              >
                {item.label}
              </div>
            </div>
            {index < 3 && (
              <div 
                className="countdown-separator text-yellow-300 text-4xl md:text-5xl font-black"
                style={{
                  fontFamily: "'Bebas Neue', 'Arial Black', Impact, sans-serif",
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}
              >
                :
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Bottom message */}
      <div className="text-center relative z-10">
        <p 
          className="text-lg md:text-xl font-bold text-yellow-200 tracking-wide"
          style={{
            fontFamily: "'Bebas Neue', 'Arial Black', Impact, sans-serif",
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
          }}
        >
          CELEBRATING 100 YEARS • NOVEMBER 11, 2026
        </p>
        <p 
          className="text-base md:text-lg text-white mt-2 tracking-wide"
          style={{
            fontFamily: "'Bebas Neue', 'Arial Black', Impact, sans-serif",
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
          }}
        >
          THE MOTHER ROAD'S CENTENNIAL CELEBRATION
        </p>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-yellow-400 opacity-60"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-yellow-400 opacity-60"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-yellow-400 opacity-60"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-yellow-400 opacity-60"></div>
    </div>
  );
};

export default Route66Countdown;
