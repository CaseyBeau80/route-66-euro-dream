
import React, { useState, useEffect } from 'react';
import { Key, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WeatherApiKeyManager } from '../../services/weather/WeatherApiKeyManager';

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if API key exists on mount
  const [hasExistingKey, setHasExistingKey] = useState(false);

  useEffect(() => {
    const existingKey = WeatherApiKeyManager.getApiKey();
    setHasExistingKey(!!existingKey);
    console.log('🔍 SimpleWeatherApiKeyInput: Checking for existing API key:', {
      hasKey: !!existingKey,
      keyLength: existingKey?.length || 0
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    console.log('🔑 SimpleWeatherApiKeyInput: Submitting API key for', cityName);
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const trimmedKey = apiKey.trim();
      
      if (trimmedKey.length < 10) {
        throw new Error('API key is too short. OpenWeatherMap API keys are typically 32 characters long.');
      }
      
      WeatherApiKeyManager.setApiKey(trimmedKey);
      
      // Verify it was stored
      const storedKey = WeatherApiKeyManager.getApiKey();
      if (!storedKey || storedKey !== trimmedKey) {
        throw new Error('Failed to store API key properly');
      }
      
      console.log('✅ SimpleWeatherApiKeyInput: API key stored successfully');
      setSuccess('API key saved successfully!');
      setHasExistingKey(true);
      
      // Call the callback after a short delay
      setTimeout(() => {
        onApiKeySet();
      }, 1000);
      
    } catch (error) {
      console.error('❌ SimpleWeatherApiKeyInput: Error setting API key:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to set API key';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearKey = () => {
    WeatherApiKeyManager.clearApiKey();
    setHasExistingKey(false);
    setApiKey('');
    setError(null);
    setSuccess(null);
    console.log('🗑️ SimpleWeatherApiKeyInput: API key cleared');
  };

  // If key exists, show success state with option to change
  if (hasExistingKey && !error) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-3">
        <div className="flex items-center gap-2 text-green-800">
          <Key className="w-4 h-4" />
          <span className="text-sm font-medium">API Key Configured</span>
        </div>
        <p className="text-xs text-green-700">
          Weather forecasts are enabled for {cityName}
        </p>
        <Button 
          onClick={handleClearKey}
          size="sm" 
          variant="outline"
          className="text-xs h-7"
        >
          Change API Key
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-3">
      <div className="flex items-center gap-2 text-blue-800">
        <Key className="w-4 h-4" />
        <span className="text-sm font-medium">Weather API Key Required</span>
      </div>
      
      <p className="text-xs text-blue-700">
        Enter your free OpenWeatherMap API key to get live weather forecasts for {cityName}
      </p>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-2">
          <p className="text-xs text-red-700">❌ {error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 rounded p-2">
          <p className="text-xs text-green-700">✅ {success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          type="text"
          placeholder="Enter your OpenWeatherMap API key"
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
          {isSubmitting ? 'Saving...' : 'Save API Key'}
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
      
      <div className="text-xs text-blue-600 space-y-1">
        <p>• 100% free for up to 1,000 calls per day</p>
        <p>• No credit card required</p>
        <p>• Keys activate within 10 minutes</p>
      </div>
    </div>
  );
};

export default SimpleWeatherApiKeyInput;
