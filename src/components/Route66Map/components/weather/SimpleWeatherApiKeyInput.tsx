
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WeatherService } from '../../services/WeatherService';
import { Key, ExternalLink } from 'lucide-react';

interface SimpleWeatherApiKeyInputProps {
  onApiKeySet: () => void;
  cityName: string;
}

const SimpleWeatherApiKeyInput: React.FC<SimpleWeatherApiKeyInputProps> = ({ 
  onApiKeySet, 
  cityName 
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsSubmitting(true);
    try {
      const weatherService = WeatherService.getInstance();
      weatherService.setApiKey(apiKey.trim());
      console.log('🔑 SimpleWeatherApiKeyInput: API key set successfully');
      onApiKeySet();
    } catch (error) {
      console.error('❌ SimpleWeatherApiKeyInput: Error setting API key:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-3">
      <div className="flex items-center gap-2 text-blue-800">
        <Key className="w-4 h-4" />
        <span className="text-sm font-medium">Weather API Key Required</span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          type="text"
          placeholder="Enter OpenWeatherMap API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="text-sm"
          disabled={isSubmitting}
        />
        <Button 
          type="submit" 
          size="sm" 
          disabled={!apiKey.trim() || isSubmitting}
          className="w-full text-xs"
        >
          {isSubmitting ? 'Setting up...' : `Enable Weather for ${cityName}`}
        </Button>
      </form>
      
      <a
        href="https://openweathermap.org/api"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
      >
        Get Free API Key <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};

export default SimpleWeatherApiKeyInput;
