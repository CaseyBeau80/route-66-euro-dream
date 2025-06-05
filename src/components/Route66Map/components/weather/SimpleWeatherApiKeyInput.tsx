
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WeatherService } from '../../services/WeatherService';
import { Key, ExternalLink, AlertTriangle, RefreshCw } from 'lucide-react';

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
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const showDebugInfo = () => {
    const weatherService = WeatherService.getInstance();
    const info = weatherService.getDebugInfo();
    setDebugInfo(info);
    console.log('🔍 SimpleWeatherApiKeyInput: Debug info:', info);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('🔤 SimpleWeatherApiKeyInput: Input changed:', {
      length: value.length,
      firstChar: value[0] || 'none',
      lastChar: value[value.length - 1] || 'none'
    });
    setApiKey(value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    console.log('🔑 SimpleWeatherApiKeyInput: Submitting API key:', {
      originalLength: apiKey.length,
      trimmedLength: apiKey.trim().length,
      firstChar: apiKey[0] || 'none',
      lastChar: apiKey[apiKey.length - 1] || 'none'
    });

    setIsSubmitting(true);
    setError(null);
    
    try {
      const weatherService = WeatherService.getInstance();
      
      // Validate length before setting
      const trimmedKey = apiKey.trim();
      if (trimmedKey.length < 10) {
        throw new Error(`API key is too short (${trimmedKey.length} characters). OpenWeatherMap API keys are typically 32 characters long.`);
      }
      
      if (trimmedKey.length > 50) {
        throw new Error(`API key is too long (${trimmedKey.length} characters). Please check for extra characters.`);
      }
      
      weatherService.setApiKey(trimmedKey);
      console.log('✅ SimpleWeatherApiKeyInput: API key set successfully');
      
      // Verify the key was stored correctly
      const verificationInfo = weatherService.getDebugInfo();
      console.log('🔍 SimpleWeatherApiKeyInput: Verification info:', verificationInfo);
      
      if (!verificationInfo.hasKey || verificationInfo.keyLength !== trimmedKey.length) {
        throw new Error('API key was not stored correctly. Please try again.');
      }
      
      onApiKeySet();
    } catch (error) {
      console.error('❌ SimpleWeatherApiKeyInput: Error setting API key:', error);
      setError(error instanceof Error ? error.message : 'Failed to set API key');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearStoredKey = () => {
    console.log('🧹 SimpleWeatherApiKeyInput: Clearing stored API key');
    const weatherService = WeatherService.getInstance();
    // Access the API key manager's clear method through the service
    localStorage.removeItem('openweathermap_api_key');
    localStorage.removeItem('weather_api_key');
    localStorage.removeItem('openweather_api_key');
    localStorage.removeItem('owm_api_key');
    
    setApiKey('');
    setError(null);
    setDebugInfo(null);
    console.log('✅ SimpleWeatherApiKeyInput: Storage cleared');
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-3">
      <div className="flex items-center gap-2 text-blue-800">
        <Key className="w-4 h-4" />
        <span className="text-sm font-medium">Weather API Key Required</span>
      </div>
      
      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-red-800">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          type="text"
          placeholder="Enter OpenWeatherMap API key (32 characters)"
          value={apiKey}
          onChange={handleInputChange}
          className="text-sm font-mono"
          disabled={isSubmitting}
          maxLength={50}
        />
        
        <div className="text-xs text-gray-600">
          {apiKey.length > 0 && (
            <span>Length: {apiKey.length} characters</span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            type="submit" 
            size="sm" 
            disabled={!apiKey.trim() || isSubmitting}
            className="flex-1 text-xs"
          >
            {isSubmitting ? 'Setting up...' : `Enable Weather for ${cityName}`}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={showDebugInfo}
            className="text-xs"
          >
            Debug
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearStoredKey}
            className="text-xs"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        </div>
      </form>
      
      {debugInfo && (
        <div className="bg-gray-100 rounded p-2 text-xs">
          <div className="font-semibold text-gray-700 mb-1">Debug Info:</div>
          <div>Has Key: {debugInfo.hasKey ? 'Yes' : 'No'}</div>
          <div>Key Length: {debugInfo.keyLength || 'None'}</div>
          {debugInfo.keyPreview && <div>Preview: {debugInfo.keyPreview}</div>}
        </div>
      )}
      
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
