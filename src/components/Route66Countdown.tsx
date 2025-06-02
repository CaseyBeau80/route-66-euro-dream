
import React, { useState, useEffect } from 'react';
import CountdownHeader from './Route66Countdown/CountdownHeader';
import CountdownDisplay from './Route66Countdown/CountdownDisplay';
import CountdownFooter from './Route66Countdown/CountdownFooter';
import CountdownBackground from './Route66Countdown/CountdownBackground';

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
      <CountdownBackground />
      <CountdownHeader />
      <CountdownDisplay timeLeft={timeLeft} />
      <CountdownFooter />
    </div>
  );
};

export default Route66Countdown;
