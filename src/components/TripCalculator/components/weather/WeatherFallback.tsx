
import React from 'react';
import { RefreshCw, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SeasonalWeatherDisplay from './SeasonalWeatherDisplay';

interface WeatherFallbackProps {
  cityName: string;
  segmentDate?: Date;
  onRetry: () => void;
  error: string;
}

const WeatherFallback: React.FC<WeatherFallbackProps> = ({ 
  cityName, 
  segmentDate, 
  onRetry, 
  error 
}) => {
  const isNetworkError = error.includes('Failed to fetch') || error.includes('timeout');

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-3 bg-orange-50 rounded border border-orange-200">
        <Wifi className="h-5 w-5 text-orange-600" />
        <div className="flex-1 text-sm text-orange-800">
          <p className="font-semibold">
            {isNetworkError ? 'Connection issue' : 'Weather service unavailable'}
          </p>
          <p className="text-xs">Showing seasonal estimate instead</p>
        </div>
        <Button 
          onClick={onRetry} 
          size="sm" 
          variant="outline"
          className="text-xs h-7"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Retry
        </Button>
      </div>
      
      {segmentDate && (
        <SeasonalWeatherDisplay segmentDate={segmentDate} cityName={cityName} />
      )}
    </div>
  );
};

export default WeatherFallback;
