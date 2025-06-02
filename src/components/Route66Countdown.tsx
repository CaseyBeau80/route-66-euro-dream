
import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

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
    <div className="bg-gradient-to-r from-route66-vintage-red to-route66-vintage-burgundy text-white p-6 rounded-lg border-4 border-route66-vintage-yellow shadow-2xl vintage-paper-texture relative overflow-hidden">
      {/* Vintage decorative border */}
      <div className="absolute inset-2 border-2 border-route66-vintage-yellow/30 rounded-lg pointer-events-none"></div>
      
      {/* Header */}
      <div className="text-center mb-4 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src="/lovable-uploads/cb155b0c-3bb5-4095-8150-9fb36bcb52b2.png" alt="Route 66 Shield" className="w-8 h-8 object-contain" />
          <h3 className="font-route66 text-xl md:text-2xl text-route66-vintage-yellow tracking-wider">
            100TH BIRTHDAY
          </h3>
          <img src="/lovable-uploads/cb155b0c-3bb5-4095-8150-9fb36bcb52b2.png" alt="Route 66 Shield" className="w-8 h-8 object-contain" />
        </div>
        <p className="font-travel text-sm text-route66-cream">
          America's Mother Road • Est. November 11, 1926
        </p>
      </div>

      {/* Countdown Display */}
      <div className="grid grid-cols-4 gap-2 md:gap-4 mb-4 relative z-10">
        {[
          { value: timeLeft.days, label: 'DAYS' },
          { value: timeLeft.hours, label: 'HOURS' },
          { value: timeLeft.minutes, label: 'MINS' },
          { value: timeLeft.seconds, label: 'SECS' }
        ].map((item, index) => (
          <div key={index} className="text-center">
            <div className="bg-route66-vintage-yellow text-route66-navy rounded-lg p-2 md:p-4 border-2 border-route66-vintage-brown shadow-lg vintage-postcard">
              <div className="font-route66 text-lg md:text-2xl lg:text-3xl font-bold">
                {item.value.toString().padStart(2, '0')}
              </div>
            </div>
            <div className="font-americana text-xs md:text-sm mt-1 text-route66-vintage-yellow tracking-wider">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Anniversary Date */}
      <div className="text-center bg-route66-vintage-beige text-route66-navy p-3 rounded-lg border-2 border-route66-vintage-brown relative z-10">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Calendar className="h-4 w-4" />
          <span className="font-americana font-bold text-sm">CENTENNIAL CELEBRATION</span>
        </div>
        <div className="font-travel text-sm">
          November 11, 2026
        </div>
      </div>

      {/* Vintage background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255, 215, 0, 0.3) 10px,
            rgba(255, 215, 0, 0.3) 20px
          )`
        }}></div>
      </div>
    </div>
  );
};

export default Route66Countdown;
