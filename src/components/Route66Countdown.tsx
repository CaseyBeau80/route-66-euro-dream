
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
    <div className="relative mx-auto max-w-3xl">
      {/* Desert landscape background with vintage cars */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-400 via-yellow-300 to-orange-600 rounded-3xl overflow-hidden">
        {/* Desert hills silhouette */}
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-orange-800 to-orange-600 opacity-80"></div>
        {/* Cacti silhouettes */}
        <div className="absolute bottom-6 left-8 w-3 h-12 bg-orange-900 rounded-t-full opacity-60"></div>
        <div className="absolute bottom-8 right-12 w-4 h-16 bg-orange-900 rounded-t-full opacity-60"></div>
      </div>

      {/* Main Route 66 shield background */}
      <div className="relative bg-gradient-to-b from-yellow-200 via-yellow-100 to-yellow-300 mx-8 my-6 rounded-t-3xl border-8 border-gray-800 shadow-2xl overflow-hidden" style={{ clipPath: 'polygon(15% 0%, 85% 0%, 100% 25%, 100% 75%, 85% 100%, 15% 100%, 0% 75%, 0% 25%)' }}>
        {/* Route 66 header */}
        <div className="pt-8 pb-4">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-black text-red-800 tracking-wider" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
              ROUTE
            </h1>
            <div className="flex justify-center items-center mt-2">
              <div className="text-8xl md:text-9xl font-black text-gray-800 tracking-wider" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                66
              </div>
            </div>
          </div>
        </div>

        {/* Countdown neon sign */}
        <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600 mx-4 mb-4 rounded-2xl border-4 border-yellow-400 shadow-xl relative overflow-hidden">
          {/* Neon border lights */}
          <div className="absolute inset-0 border-2 border-yellow-300 rounded-2xl animate-pulse"></div>
          <div className="absolute top-2 left-2 w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
          <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>

          {/* COUNTDOWN text */}
          <div className="text-center py-3">
            <h2 className="text-3xl md:text-4xl font-black text-yellow-300 tracking-widest" 
                style={{ 
                  fontFamily: 'Impact, Arial Black, sans-serif',
                  textShadow: '0 0 10px #fbbf24, 0 0 20px #f59e0b, 0 0 30px #d97706'
                }}>
              COUNTDOWN
            </h2>
          </div>

          {/* Time displays */}
          <div className="flex justify-center items-center gap-2 md:gap-4 px-4 pb-4">
            {[
              { value: timeLeft.days, label: 'DAYS' },
              { value: timeLeft.hours, label: 'HOURS' },
              { value: timeLeft.minutes, label: 'MIN.S.' },
              { value: timeLeft.seconds, label: 'SEC.' }
            ].map((item, index) => (
              <React.Fragment key={index}>
                <div className="text-center">
                  <div className="bg-gradient-to-b from-yellow-200 to-yellow-100 border-4 border-gray-800 rounded-lg px-2 py-3 md:px-4 md:py-4 shadow-inner">
                    <div className="text-3xl md:text-5xl font-black text-gray-800 leading-none" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                      {item.value.toString().padStart(2, '0')}
                    </div>
                  </div>
                  <div className="text-xs md:text-sm font-bold text-teal-100 mt-1 tracking-wider">
                    {item.label}
                  </div>
                </div>
                {index < 3 && (
                  <div className="text-yellow-300 text-2xl md:text-3xl font-black">:</div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Bottom label section */}
          <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 py-2">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-teal-100 tracking-wider">
                — MIN. SEC. —
              </div>
            </div>
          </div>
        </div>

        {/* Centennial text */}
        <div className="text-center pb-6">
          <div className="text-red-800 font-bold text-sm md:text-base">
            100TH ANNIVERSARY • NOVEMBER 11, 2026
          </div>
        </div>
      </div>

      {/* Vintage car silhouettes */}
      <div className="absolute bottom-4 left-4 w-16 h-8 opacity-40">
        <div className="w-full h-full bg-red-900 rounded-lg"></div>
      </div>
    </div>
  );
};

export default Route66Countdown;
