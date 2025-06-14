
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { Key, ExternalLink } from 'lucide-react';

const WeatherApiKeyInput: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isStoring, setIsStoring] = useState(false);
  const [message, setMessage] = useState('');

  const handleStoreApiKey = async () => {
    if (!apiKey.trim()) {
      setMessage('Please enter an API key');
      return;
    }

    setIsStoring(true);
    try {
      WeatherApiKeyManager.setApiKey(apiKey.trim());
      setMessage('✅ API key saved! Weather forecasts are now enabled.');
      setApiKey('');
      
      // Refresh the page to use the new API key
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage('❌ Invalid API key. Please check your key and try again.');
    } finally {
      setIsStoring(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-blue-700">
        <Key className="w-5 h-5" />
        <h3 className="font-semibold">Enable Live Weather Forecasts</h3>
      </div>
      
      <p className="text-sm text-blue-600">
        Get real-time weather forecasts for your Route 66 journey by adding your free OpenWeatherMap API key.
      </p>
      
      <div className="flex gap-2">
        <Input
          type="password"
          placeholder="Enter your OpenWeatherMap API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={handleStoreApiKey}
          disabled={isStoring || !apiKey.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isStoring ? 'Saving...' : 'Save Key'}
        </Button>
      </div>
      
      {message && (
        <p className={`text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
      
      <div className="flex items-center gap-2 text-blue-600">
        <ExternalLink className="w-4 h-4" />
        <a 
          href="https://openweathermap.org/api" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm hover:underline"
        >
          Get your free API key from OpenWeatherMap
        </a>
      </div>
      
      <div className="text-xs text-blue-500">
        • 100% free for up to 1,000 calls per day<br/>
        • No credit card required<br/>
        • Keys activate within 10 minutes
      </div>
    </div>
  );
};

export default WeatherApiKeyInput;
