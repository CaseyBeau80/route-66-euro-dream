
import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

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
    <div className="bg-gradient-to-r from-route66-primary/90 to-route66-accent-red/90 rounded-xl p-4 shadow-lg border-2 border-route66-accent-gold/30 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-route66-accent-gold" />
        <h3 className="font-route66 text-white text-sm uppercase tracking-wide">
          Route 66 Centennial
        </h3>
        <Clock className="w-4 h-4 text-route66-accent-gold" />
      </div>
      
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
          <div className="font-bold text-lg text-white">{timeLeft.days}</div>
          <div className="text-xs text-route66-accent-gold uppercase tracking-wide">Days</div>
        </div>
        <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
          <div className="font-bold text-lg text-white">{timeLeft.hours}</div>
          <div className="text-xs text-route66-accent-gold uppercase tracking-wide">Hrs</div>
        </div>
        <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
          <div className="font-bold text-lg text-white">{timeLeft.minutes}</div>
          <div className="text-xs text-route66-accent-gold uppercase tracking-wide">Min</div>
        </div>
        <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
          <div className="font-bold text-lg text-white">{timeLeft.seconds}</div>
          <div className="text-xs text-route66-accent-gold uppercase tracking-wide">Sec</div>
        </div>
      </div>
      
      <div className="text-center mt-3">
        <div className="text-xs text-white/80 uppercase tracking-wide">
          November 11, 2026
        </div>
      </div>
    </div>
  );
};

export default CompactCountdown;
