
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
    <div className="nostalgic-card bg-route66-background border-2 border-route66-accent-gold rounded-lg p-6 shadow-vintage">
      {/* Nostalgic Header with Route 66 Styling */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-6 bg-route66-primary rounded-sm flex items-center justify-center">
            <span className="text-white font-route66 text-sm font-bold">66</span>
          </div>
          <Calendar className="w-5 h-5 text-route66-accent-gold" />
        </div>
        <h3 className="font-route66 text-route66-primary text-lg uppercase tracking-wide font-bold">
          Route 66 Centennial
        </h3>
        <div className="w-12 h-1 bg-route66-accent-red mx-auto mt-1 rounded-full"></div>
      </div>
      
      {/* Countdown Grid with Vintage Styling */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="text-center">
          <div className="bg-route66-primary text-white rounded-lg p-3 border-2 border-route66-primary-dark shadow-sm">
            <div className="font-highway text-2xl font-bold">{timeLeft.days}</div>
          </div>
          <div className="text-xs text-route66-text-secondary uppercase tracking-wide font-highway font-semibold mt-1">
            Days
          </div>
        </div>
        
        <div className="text-center">
          <div className="bg-route66-accent-red text-white rounded-lg p-3 border-2 border-red-700 shadow-sm">
            <div className="font-highway text-2xl font-bold">{timeLeft.hours}</div>
          </div>
          <div className="text-xs text-route66-text-secondary uppercase tracking-wide font-highway font-semibold mt-1">
            Hours
          </div>
        </div>
        
        <div className="text-center">
          <div className="bg-route66-accent-gold text-white rounded-lg p-3 border-2 border-yellow-600 shadow-sm">
            <div className="font-highway text-2xl font-bold">{timeLeft.minutes}</div>
          </div>
          <div className="text-xs text-route66-text-secondary uppercase tracking-wide font-highway font-semibold mt-1">
            Min
          </div>
        </div>
        
        <div className="text-center">
          <div className="bg-route66-charcoal text-white rounded-lg p-3 border-2 border-gray-700 shadow-sm">
            <div className="font-highway text-2xl font-bold">{timeLeft.seconds}</div>
          </div>
          <div className="text-xs text-route66-text-secondary uppercase tracking-wide font-highway font-semibold mt-1">
            Sec
          </div>
        </div>
      </div>
      
      {/* Vintage Footer */}
      <div className="text-center border-t border-route66-border-vintage pt-3">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-route66-accent-gold" />
          <span className="text-route66-text-primary font-highway font-semibold text-sm">
            November 11, 2026
          </span>
        </div>
        <div className="text-xs text-route66-text-muted font-americana uppercase tracking-wide">
          The Mother Road Turns 100
        </div>
      </div>
    </div>
  );
};

export default CompactCountdown;
