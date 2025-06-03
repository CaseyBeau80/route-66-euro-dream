
import React from 'react';
import CountdownHeader from './Route66Countdown/CountdownHeader';
import CountdownDisplay from './Route66Countdown/CountdownDisplay';
import CountdownFooter from './Route66Countdown/CountdownFooter';
import CountdownBackground from './Route66Countdown/CountdownBackground';

const Route66Countdown: React.FC = () => {
  // Static time values from the provided image
  const timeLeft = {
    days: 124,
    hours: 5,
    minutes: 5,
    seconds: 8
  };

  return (
    <div className="countdown-container w-full max-w-none mx-auto p-6 lg:p-8 rounded-lg relative overflow-hidden h-full">
      <CountdownBackground />
      <CountdownHeader />
      <CountdownDisplay timeLeft={timeLeft} />
      <CountdownFooter />
    </div>
  );
};

export default Route66Countdown;
