
import React from 'react';

interface SeasonalReferenceCardProps {
  segmentDate: Date;
  cityName: string;
}

const SeasonalReferenceCard: React.FC<SeasonalReferenceCardProps> = ({
  segmentDate,
  cityName
}) => {
  const getSeasonalInfo = (date: Date) => {
    const month = date.getMonth();
    
    if (month >= 2 && month <= 4) {
      return {
        season: 'Spring',
        emoji: '🌸',
        description: 'Mild temperatures, occasional rain',
        clothing: 'Light layers recommended'
      };
    } else if (month >= 5 && month <= 7) {
      return {
        season: 'Summer',
        emoji: '☀️',
        description: 'Hot and sunny, perfect for road trips',
        clothing: 'Light clothing, sun protection'
      };
    } else if (month >= 8 && month <= 10) {
      return {
        season: 'Fall',
        emoji: '🍂',
        description: 'Comfortable temperatures, beautiful scenery',
        clothing: 'Light jacket for evenings'
      };
    } else {
      return {
        season: 'Winter',
        emoji: '❄️',
        description: 'Cool to cold, check road conditions',
        clothing: 'Warm layers, winter gear'
      };
    }
  };

  const seasonInfo = getSeasonalInfo(segmentDate);

  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{seasonInfo.emoji}</span>
        <h4 className="text-sm font-semibold text-gray-700">
          {seasonInfo.season} in {cityName}
        </h4>
      </div>
      
      <div className="space-y-1 text-xs text-gray-600">
        <p>{seasonInfo.description}</p>
        <p className="text-blue-600">{seasonInfo.clothing}</p>
      </div>
    </div>
  );
};

export default SeasonalReferenceCard;
