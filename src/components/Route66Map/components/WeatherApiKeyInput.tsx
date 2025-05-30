
import React, { useState } from 'react';
import { WeatherService } from '../services/WeatherService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, ExternalLink } from 'lucide-react';

interface WeatherApiKeyInputProps {
  onApiKeySet: () => void;
}

const WeatherApiKeyInput: React.FC<WeatherApiKeyInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsSubmitting(true);
    try {
      const weatherService = WeatherService.getInstance();
      weatherService.setApiKey(apiKey.trim());
      onApiKeySet();
    } catch (error) {
      console.error('Error setting API key:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Cloud className="w-8 h-8 text-blue-500" />
        </div>
        <CardTitle>Weather Integration</CardTitle>
        <CardDescription>
          Enter your OpenWeatherMap API key to see weather information for Route 66 cities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="weather-api-key">OpenWeatherMap API Key</Label>
            <Input
              id="weather-api-key"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="mt-1"
            />
          </div>
          
          <Button type="submit" disabled={!apiKey.trim() || isSubmitting} className="w-full">
            {isSubmitting ? 'Setting up...' : 'Enable Weather Widget'}
          </Button>
        </form>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 mb-2">
            Don't have an API key? Get one free from OpenWeatherMap:
          </p>
          <a
            href="https://openweathermap.org/api"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
          >
            Get Free API Key <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherApiKeyInput;
