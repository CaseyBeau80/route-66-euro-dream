
import React, { useEffect, useState } from 'react';

interface AttractionLoadingDisplayProps {
  cityName: string;
  searchStartTime: number;
  remainingTime: number;
}

const AttractionLoadingDisplay: React.FC<AttractionLoadingDisplayProps> = ({
  cityName,
  searchStartTime,
  remainingTime
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - searchStartTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [searchStartTime]);

  const isLongRunning = elapsedTime > 3;
  const remainingSeconds = Math.ceil(remainingTime / 1000);

  return (
    <div className={`flex items-center justify-center p-4 rounded-lg border ${
      isLongRunning ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mr-3"></div>
      <div className="text-sm">
        <span className="text-gray-600">Finding attractions near {cityName}...</span>
        <div className="text-xs text-gray-500 mt-1">
          {elapsedTime}s elapsed
          {remainingSeconds > 0 && <span className="ml-2">({remainingSeconds}s remaining)</span>}
          {isLongRunning && <span className="text-yellow-600 ml-2">⚠️ Taking longer than expected</span>}
        </div>
      </div>
    </div>
  );
};

export default AttractionLoadingDisplay;
