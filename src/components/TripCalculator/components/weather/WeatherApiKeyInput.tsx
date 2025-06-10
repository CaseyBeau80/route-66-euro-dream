
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, Eye, EyeOff } from 'lucide-react';

interface WeatherApiKeyInputProps {
  onApiKeySet: () => void;
  cityName: string;
}

const WeatherApiKeyInput: React.FC<WeatherApiKeyInputProps> = ({
  onApiKeySet,
  cityName
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      localStorage.setItem('openweather_api_key', apiKey.trim());
      onApiKeySet();
    } catch (error) {
      console.error('Error saving API key:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-blue-700">
        <Key className="h-4 w-4" />
        <span className="text-sm font-medium">Weather API Key Required</span>
      </div>
      
      <p className="text-xs text-blue-600">
        Enter your OpenWeatherMap API key to get live weather forecasts for {cityName}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Input
            type={showKey ? 'text' : 'password'}
            placeholder="Enter OpenWeatherMap API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="pr-10 text-sm"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        
        <Button 
          type="submit" 
          size="sm" 
          disabled={!apiKey.trim() || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Setting up...' : 'Get Weather Forecast'}
        </Button>
      </form>
      
      <p className="text-xs text-gray-500">
        Get a free API key at{' '}
        <a 
          href="https://openweathermap.org/api" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          openweathermap.org
        </a>
      </p>
    </div>
  );
};

export default WeatherApiKeyInput;
