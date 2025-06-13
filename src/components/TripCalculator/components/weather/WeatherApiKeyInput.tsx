
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, Eye, EyeOff, ExternalLink } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const trimmedKey = apiKey.trim();
      
      // Basic validation
      if (trimmedKey.length < 10) {
        setError('API key appears to be too short. Please check and try again.');
        setIsSubmitting(false);
        return;
      }
      
      if (trimmedKey.toLowerCase().includes('your_api_key') || 
          trimmedKey.toLowerCase().includes('placeholder')) {
        setError('Please enter your actual API key, not the placeholder text.');
        setIsSubmitting(false);
        return;
      }
      
      // Store the key
      localStorage.setItem('openweathermap_api_key', trimmedKey);
      console.log('🔑 WeatherApiKeyInput: API key stored successfully');
      
      // Clear the form
      setApiKey('');
      setError(null);
      
      // Notify parent component
      onApiKeySet();
      
    } catch (error) {
      console.error('❌ WeatherApiKeyInput: Error saving API key:', error);
      setError('Failed to save API key. Please try again.');
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
      
      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Input
            type={showKey ? 'text' : 'password'}
            placeholder="Enter OpenWeatherMap API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="pr-10 text-sm font-mono"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        
        <div className="text-xs text-gray-500">
          {apiKey.length > 0 && (
            <span>Length: {apiKey.length} characters</span>
          )}
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
      
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">
          Get a free API key:
        </span>
        <a 
          href="https://openweathermap.org/api" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          OpenWeatherMap <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      
      <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
        💡 <strong>Tip:</strong> Your API key is stored locally and never shared with our servers. 
        It takes about 10 minutes for new API keys to activate.
      </div>
    </div>
  );
};

export default WeatherApiKeyInput;
