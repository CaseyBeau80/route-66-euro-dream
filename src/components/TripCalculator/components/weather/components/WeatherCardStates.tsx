
import React from 'react';
import { Cloud } from 'lucide-react';

export const NoDateState: React.FC = () => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 text-center min-h-[200px] flex flex-col justify-center">
      <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-500 text-sm">
        Set a trip start date to see weather forecasts
      </p>
    </div>
  );
};

export const NoApiKeyState: React.FC = () => {
  return (
    <div className="bg-yellow-50 rounded-lg p-6 text-center min-h-[200px] flex flex-col justify-center border border-yellow-200">
      <Cloud className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
      <p className="text-yellow-700 text-sm mb-2">
        Weather API key required
      </p>
      <p className="text-yellow-600 text-xs">
        Set your OpenWeatherMap API key to see forecasts
      </p>
    </div>
  );
};

export const LoadingState: React.FC = () => {
  return (
    <div className="bg-blue-50 rounded-lg p-6 text-center min-h-[200px] flex flex-col justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-blue-600 text-sm">Loading weather data...</p>
    </div>
  );
};

interface ErrorStateProps {
  error: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="bg-red-50 rounded-lg p-6 text-center min-h-[200px] flex flex-col justify-center border border-red-200">
      <Cloud className="h-12 w-12 text-red-400 mx-auto mb-4" />
      <p className="text-red-700 text-sm mb-2">Weather unavailable</p>
      <p className="text-red-600 text-xs">{error}</p>
    </div>
  );
};

export const NoWeatherFallback: React.FC = () => {
  return (
    <div className="text-center py-8">
      <Cloud className="h-8 w-8 text-gray-400 mx-auto mb-2" />
      <p className="text-gray-500 text-sm">Loading weather...</p>
    </div>
  );
};
