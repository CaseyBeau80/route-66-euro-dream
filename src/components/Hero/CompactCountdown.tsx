
import React, { useState, useEffect } from 'react';
import { Cake, PartyPopper, Gift } from 'lucide-react';

const CompactCountdown: React.FC = () => {
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    // Route 66 was established on November 11, 1926
    // 100th anniversary will be November 11, 2026
    const targetDate = new Date('November 11, 2026 00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        setDaysLeft(days);
      } else {
        setDaysLeft(0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 shadow-lg border-2 border-pink-200 relative overflow-hidden">
      {/* Birthday decorations */}
      <div className="absolute top-2 right-2">
        <PartyPopper className="w-4 h-4 text-purple-500 animate-bounce" />
      </div>
      <div className="absolute top-2 left-2">
        <Gift className="w-4 h-4 text-pink-500 animate-pulse" />
      </div>
      
      {/* Confetti dots */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-3 left-8 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-6 right-8 w-1 h-1 bg-blue-400 rounded-full animate-pulse animation-delay-200"></div>
        <div className="absolute bottom-4 left-6 w-1 h-1 bg-green-400 rounded-full animate-pulse animation-delay-400"></div>
        <div className="absolute bottom-6 right-6 w-1 h-1 bg-red-400 rounded-full animate-pulse animation-delay-600"></div>
      </div>

      <div className="text-center relative z-10">
        {/* Birthday cake icon */}
        <div className="mb-3">
          <Cake className="w-8 h-8 text-pink-600 mx-auto animate-pulse" />
        </div>
        
        {/* Birthday message */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-purple-700 mb-1">
            🎉 Route 66's 100th Birthday! 🎂
          </h3>
          <p className="text-sm text-purple-600">
            The Mother Road turns 100 on Nov 11, 2026
          </p>
        </div>

        {/* Birthday countdown circle */}
        <div className="relative">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {daysLeft}
              </div>
              <div className="text-xs text-pink-100 font-medium">
                DAYS
              </div>
            </div>
          </div>
          
          {/* Decorative rings */}
          <div className="absolute inset-0 rounded-full border-2 border-pink-300 animate-ping opacity-75"></div>
          <div className="absolute inset-2 rounded-full border border-purple-300 animate-pulse"></div>
        </div>

        {/* Birthday candles representation */}
        <div className="flex justify-center gap-1 mt-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1 h-4 bg-gradient-to-t from-yellow-400 to-orange-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
          ))}
        </div>
        
        <div className="text-xs text-purple-600 mt-2 font-medium">
          🕯️ Let's Celebrate! 🕯️
        </div>
      </div>
    </div>
  );
};

export default CompactCountdown;
