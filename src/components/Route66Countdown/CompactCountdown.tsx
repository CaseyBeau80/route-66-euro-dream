
import React, { useState, useEffect } from 'react';

const CompactCountdown: React.FC = () => {
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
    <div className="text-center space-y-3">
      {/* Compact Title */}
      <div className="text-center">
        <h3 
          className="text-sm font-bold tracking-wide text-route66-primary mb-1"
          style={{
            fontFamily: "'Russo One', 'Arial Black', sans-serif",
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}
        >
          Route 66 Centennial
        </h3>
      </div>

      {/* Compact Days Display */}
      <div className="flex justify-center">
        <div 
          className="relative w-16 h-16 rounded-lg shadow-lg flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, #dc2626 0%, #1d4ed8 100%)`,
            border: '2px solid #FFFFFF',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3), 0 0 15px rgba(220, 38, 38, 0.3)'
          }}
        >
          <span 
            className="text-lg font-black text-white"
            style={{
              fontFamily: "'Black Ops One', 'Impact', sans-serif",
              textShadow: '1px 1px 0px #000000, 2px 2px 4px rgba(0,0,0,0.8)'
            }}
          >
            {String(timeLeft.days).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Compact Label */}
      <div className="text-center">
        <span 
          className="text-xs font-bold tracking-wider text-route66-accent-red"
          style={{
            fontFamily: "'Russo One', 'Arial Black', sans-serif",
            textShadow: '0 0 5px rgba(220, 38, 38, 0.5)'
          }}
        >
          DAYS UNTIL 100th!
        </span>
      </div>
    </div>
  );
};

export default CompactCountdown;
