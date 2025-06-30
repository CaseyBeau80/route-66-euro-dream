
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

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
    <div className="relative">
      {/* Alarm Clock Body */}
      <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-full w-32 h-32 relative shadow-lg border-4 border-amber-800 mx-auto">
        {/* Clock Face */}
        <div className="absolute inset-2 bg-white rounded-full border-2 border-amber-700 flex items-center justify-center">
          {/* Hour Marks */}
          <div className="absolute w-full h-full">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-3 bg-amber-800 rounded"
                style={{
                  top: '4px',
                  left: '50%',
                  transformOrigin: '50% 56px',
                  transform: `translateX(-50%) rotate(${i * 30}deg)`,
                }}
              />
            ))}
          </div>
          
          {/* Center content */}
          <div className="text-center z-10 bg-white rounded-full px-2 py-1">
            <div className="text-2xl font-bold text-route66-primary font-highway">
              {daysLeft}
            </div>
            <div className="text-xs text-amber-800 font-semibold -mt-1">
              DAYS
            </div>
          </div>
          
          {/* Clock Hands */}
          <div className="absolute w-0.5 h-8 bg-amber-900 rounded-full" 
               style={{ 
                 top: '50%', 
                 left: '50%', 
                 transformOrigin: '50% 100%',
                 transform: 'translateX(-50%) translateY(-100%) rotate(30deg)' 
               }} />
          <div className="absolute w-0.5 h-6 bg-amber-900 rounded-full" 
               style={{ 
                 top: '50%', 
                 left: '50%', 
                 transformOrigin: '50% 100%',
                 transform: 'translateX(-50%) translateY(-100%) rotate(90deg)' 
               }} />
          
          {/* Center dot */}
          <div className="absolute w-2 h-2 bg-amber-900 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20" />
        </div>
        
        {/* Alarm Bells */}
        <div className="absolute -top-3 -left-3 w-6 h-6 bg-amber-300 rounded-full border-2 border-amber-800 shadow-md" />
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-amber-300 rounded-full border-2 border-amber-800 shadow-md" />
        
        {/* Wind-up key */}
        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
          <div className="w-3 h-1 bg-amber-800 rounded-full" />
          <div className="w-2 h-2 bg-amber-700 rounded-full ml-2 -mt-1 border border-amber-900" />
        </div>
      </div>
      
      {/* Clock legs */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
        <div className="flex gap-8">
          <div className="w-1 h-4 bg-amber-800 rounded-full transform rotate-12" />
          <div className="w-1 h-4 bg-amber-800 rounded-full transform -rotate-12" />
        </div>
      </div>
      
      {/* Label */}
      <div className="text-center mt-6">
        <div className="text-sm text-route66-primary font-highway font-semibold">
          until Route 66 turns 100
        </div>
      </div>
    </div>
  );
};

export default CompactCountdown;
