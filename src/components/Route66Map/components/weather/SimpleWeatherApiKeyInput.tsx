
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WeatherService } from '../../services/WeatherService';
import { Key, ExternalLink, AlertTriangle, RefreshCw, Bug } from 'lucide-react';

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
  const [testResult, setTestResult] = useState<string | null>(null);

  const showDebugInfo = () => {
    console.log('🔍 SimpleWeatherApiKeyInput: === FULL DEBUG SESSION START ===');
    
    const weatherService = WeatherService.getInstance();
    const info = weatherService.getDebugInfo();
    setDebugInfo(info);
    
    // Check localStorage directly
    const directCheck = localStorage.getItem('openweathermap_api_key');
    console.log('🔍 Direct localStorage check:', {
      key: 'openweathermap_api_key',
      value: directCheck,
      length: directCheck?.length || 0
    });
    
    // Check all possible storage keys
    const allKeys = ['openweathermap_api_key', 'weather_api_key', 'openweather_api_key', 'owm_api_key'];
    allKeys.forEach(key => {
      const value = localStorage.getItem(key);
      console.log(`🔍 Storage check [${key}]:`, {
        value: value,
        length: value?.length || 0,
        exists: !!value
      });
    });
    
    console.log('🔍 WeatherService debug info:', info);
    console.log('🔍 SimpleWeatherApiKeyInput: === DEBUG SESSION END ===');
  };

  const testApiKey = async () => {
    if (!apiKey.trim()) {
      setTestResult('❌ No API key to test');
      return;
    }
    
    console.log('🧪 Testing API key:', {
      length: apiKey.length,
      preview: `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`
    });
    
    try {
      // Make a direct test call to OpenWeatherMap API
      const testUrl = `https://api.openweathermap.org/data/2.5/weather?q=Chicago&appid=${apiKey.trim()}&units=imperial`;
      const response = await fetch(testUrl);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API key test successful:', data);
        setTestResult('✅ API key is valid and working!');
      } else {
        const errorText = await response.text();
        console.error('❌ API key test failed:', response.status, errorText);
        setTestResult(`❌ API key test failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('❌ API key test error:', error);
      setTestResult(`❌ Test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('🔤 SimpleWeatherApiKeyInput: Input changed:', {
      length: value.length,
      firstChar: value[0] || 'none',
      lastChar: value[value.length - 1] || 'none',
      hasSpaces: value.includes(' '),
      trimmedLength: value.trim().length
    });
    setApiKey(value);
    setError(null);
    setTestResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    console.log('🔑 SimpleWeatherApiKeyInput: === SUBMIT SESSION START ===');
    console.log('🔑 Original input:', {
      originalLength: apiKey.length,
      trimmedLength: apiKey.trim().length,
      firstChar: apiKey[0] || 'none',
      lastChar: apiKey[apiKey.length - 1] || 'none',
      preview: `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`
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
      
      // Set the API key
      console.log('🔑 Setting API key in WeatherService...');
      weatherService.setApiKey(trimmedKey);
      
      // Immediate verification
      const verificationInfo = weatherService.getDebugInfo();
      console.log('🔍 Immediate verification:', verificationInfo);
      
      // Check localStorage directly
      const storedKey = localStorage.getItem('openweathermap_api_key');
      console.log('🔍 Direct localStorage verification:', {
        stored: storedKey,
        storedLength: storedKey?.length || 0,
        matches: storedKey === trimmedKey
      });
      
      if (!verificationInfo.hasKey || verificationInfo.keyLength !== trimmedKey.length) {
        console.error('❌ Storage verification failed!', verificationInfo);
        throw new Error('API key was not stored correctly. Please try again.');
      }
      
      console.log('✅ API key set and verified successfully');
      console.log('🔑 SimpleWeatherApiKeyInput: === SUBMIT SESSION END ===');
      
      onApiKeySet();
    } catch (error) {
      console.error('❌ SimpleWeatherApiKeyInput: Error setting API key:', error);
      setError(error instanceof Error ? error.message : 'Failed to set API key');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearStoredKey = () => {
    console.log('🧹 SimpleWeatherApiKeyInput: Clearing all stored API keys');
    const keysToRemove = ['openweathermap_api_key', 'weather_api_key', 'openweather_api_key', 'owm_api_key'];
    
    keysToRemove.forEach(key => {
      const existing = localStorage.getItem(key);
      if (existing) {
        console.log(`🧹 Removing key: ${key} (value: ${existing})`);
        localStorage.removeItem(key);
      }
    });
    
    setApiKey('');
    setError(null);
    setDebugInfo(null);
    setTestResult(null);
    console.log('✅ All storage cleared');
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
      
      {testResult && (
        <div className="p-2 bg-gray-50 border border-gray-200 rounded text-gray-800">
          <span className="text-xs font-mono">{testResult}</span>
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
            <span>Length: {apiKey.length} characters | Trimmed: {apiKey.trim().length}</span>
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
            onClick={testApiKey}
            disabled={!apiKey.trim()}
            className="text-xs"
          >
            Test
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={showDebugInfo}
            className="text-xs"
          >
            <Bug className="w-3 h-3" />
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
        <div className="bg-gray-100 rounded p-2 text-xs space-y-1">
          <div className="font-semibold text-gray-700">Debug Info:</div>
          <div>Has Key: {debugInfo.hasKey ? 'Yes' : 'No'}</div>
          <div>Key Length: {debugInfo.keyLength || 'None'}</div>
          {debugInfo.keyPreview && <div>Preview: {debugInfo.keyPreview}</div>}
          <div>Direct Check: {localStorage.getItem('openweathermap_api_key')?.length || 0} chars</div>
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
