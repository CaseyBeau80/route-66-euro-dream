
import React from 'react';
import { format } from 'date-fns';

interface SeasonalWeatherFallbackProps {
  segmentDate: Date;
  cityName: string;
  compact?: boolean;
}

const SeasonalWeatherFallback: React.FC<SeasonalWeatherFallbackProps> = ({
  segmentDate,
  cityName,
  compact = false
}) => {
  // Generate seasonal weather based on month
  const month = segmentDate.getMonth();
  const monthName = format(segmentDate, 'MMMM');
  
  // Seasonal temperature ranges for Route 66 cities
  const getSeasonalTemp = (month: number) => {
    const temps = [
      { high: 55, low: 35 }, // January
      { high: 62, low: 40 }, // February
      { high: 70, low: 48 }, // March
      { high: 78, low: 56 }, // April
      { high: 87, low: 65 }, // May
      { high: 95, low: 74 }, // June
      { high: 98, low: 78 }, // July
      { high: 96, low: 76 }, // August
      { high: 89, low: 68 }, // September
      { high: 79, low: 57 }, // October
      { high: 65, low: 43 }, // November
      { high: 56, low: 36 }  // December
    ];
    return temps[month] || { high: 75, low: 55 };
  };

  const getSeasonalConditions = (month: number) => {
    const conditions = [
      { desc: 'Partly Cloudy', icon: '02d', precip: 25 }, // January
      { desc: 'Mostly Sunny', icon: '01d', precip: 20 }, // February
      { desc: 'Partly Cloudy', icon: '02d', precip: 30 }, // March
      { desc: 'Sunny', icon: '01d', precip: 15 }, // April
      { desc: 'Sunny', icon: '01d', precip: 10 }, // May
      { desc: 'Hot and Sunny', icon: '01d', precip: 5 }, // June
      { desc: 'Hot and Sunny', icon: '01d', precip: 8 }, // July
      { desc: 'Hot and Sunny', icon: '01d', precip: 12 }, // August
      { desc: 'Partly Cloudy', icon: '02d', precip: 15 }, // September
      { desc: 'Partly Cloudy', icon: '02d', precip: 20 }, // October
      { desc: 'Partly Cloudy', icon: '02d', precip: 25 }, // November
      { desc: 'Mostly Cloudy', icon: '03d', precip: 30 }  // December
    ];
    return conditions[month] || { desc: 'Partly Cloudy', icon: '02d', precip: 20 };
  };

  const temp = getSeasonalTemp(month);
  const conditions = getSeasonalConditions(month);
  const iconUrl = `https://openweathermap.org/img/wn/${conditions.icon}@2x.png`;

  if (compact) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-blue-900">Typical {monthName} Weather</h4>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            Seasonal
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <img src={iconUrl} alt={conditions.desc} className="w-8 h-8" />
          <div className="flex-1">
            <div className="text-sm text-blue-800">{conditions.desc}</div>
            <div className="text-xs text-blue-600">
              H: {temp.high}° L: {temp.low}°
            </div>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-blue-600">
          💧 {conditions.precip}% chance of rain
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <img src={iconUrl} alt={conditions.desc} className="w-8 h-8" />
          <div>
            <h4 className="font-medium text-blue-900">
              Typical {monthName} Weather for {cityName}
            </h4>
            <div className="text-sm text-blue-600">
              {format(segmentDate, 'EEEE, MMMM d, yyyy')}
            </div>
          </div>
        </div>
        
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
          Seasonal Estimate
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="text-center p-2 bg-blue-100 rounded">
          <div className="text-2xl font-bold text-blue-900">{temp.high}°</div>
          <div className="text-xs text-blue-600">High</div>
        </div>
        <div className="text-center p-2 bg-blue-100 rounded">
          <div className="text-2xl font-bold text-blue-900">{temp.low}°</div>
          <div className="text-xs text-blue-600">Low</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-center p-2 bg-blue-100 rounded">
          <div className="font-medium text-blue-700">{conditions.precip}%</div>
          <div className="text-xs text-blue-600">Rain Chance</div>
        </div>
        <div className="text-center p-2 bg-blue-100 rounded">
          <div className="font-medium text-blue-700">{conditions.desc}</div>
          <div className="text-xs text-blue-600">Conditions</div>
        </div>
      </div>

      <div className="mt-3 text-xs text-blue-500 text-center">
        Based on historical weather patterns for the Route 66 region
      </div>
    </div>
  );
};

export default SeasonalWeatherFallback;
