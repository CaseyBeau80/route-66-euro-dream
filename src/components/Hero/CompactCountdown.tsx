
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

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
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex items-center gap-3">
        <Calendar className="w-5 h-5 text-route66-primary" />
        <div>
          <div className="text-2xl font-bold text-route66-primary">
            {daysLeft}
          </div>
          <div className="text-sm text-gray-600">
            days until Route 66 turns 100
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactCountdown;
