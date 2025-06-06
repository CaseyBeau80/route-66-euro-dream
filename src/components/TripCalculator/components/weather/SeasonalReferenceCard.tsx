
import React from 'react';

interface SeasonalReferenceCardProps {
  segmentDate: Date;
  cityName: string;
}

const SeasonalReferenceCard: React.FC<SeasonalReferenceCardProps> = ({ 
  segmentDate, 
  cityName 
}) => {
  const getSeason = (date: Date): string => {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Fall';
    return 'Winter';
  };

  const getSeasonalAdvice = (season: string): string => {
    switch (season) {
      case 'Spring':
        return 'Pack layers - temperatures can vary widely. Watch for afternoon thunderstorms.';
      case 'Summer':
        return 'Hot and sunny. Stay hydrated and plan early morning or evening drives.';
      case 'Fall':
        return 'Pleasant temperatures with beautiful foliage. Perfect for Route 66 travel.';
      case 'Winter':
        return 'Cold with possible snow. Check road conditions before departure.';
      default:
        return 'Check current weather conditions before your trip.';
    }
  };

  const season = getSeason(segmentDate);
  const advice = getSeasonalAdvice(season);

  return (
    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
      <div className="text-sm font-semibold text-blue-800 mb-2">
        {season} Travel in {cityName}
      </div>
      <div className="text-xs text-blue-700">
        {advice}
      </div>
    </div>
  );
};

export default SeasonalReferenceCard;
