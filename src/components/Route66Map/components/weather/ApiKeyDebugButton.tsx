
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WeatherApiKeyManager } from '../../services/weather/WeatherApiKeyManager';
import { Bug, Eye, EyeOff } from 'lucide-react';

const ApiKeyDebugButton: React.FC = () => {
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const handleDebugClick = () => {
    const info = WeatherApiKeyManager.getDebugInfo();
    const apiKey = WeatherApiKeyManager.getApiKey();
    
    setDebugInfo({
      ...info,
      fullKey: apiKey,
      storageKey: localStorage.getItem('openweathermap_api_key'),
      timestamp: new Date().toISOString()
    });
    setShowDebug(!showDebug);
  };

  const handleClearKey = () => {
    WeatherApiKeyManager.clearApiKey();
    setDebugInfo(null);
    setShowDebug(false);
    window.location.reload();
  };

  return (
    <div className="space-y-2">
      <Button 
        onClick={handleDebugClick}
        variant="outline" 
        size="sm"
        className="text-xs"
      >
        <Bug className="w-3 h-3 mr-1" />
        {showDebug ? 'Hide' : 'Show'} API Key Debug
        {showDebug ? <EyeOff className="w-3 h-3 ml-1" /> : <Eye className="w-3 h-3 ml-1" />}
      </Button>

      {showDebug && debugInfo && (
        <div className="bg-gray-100 border rounded p-3 text-xs font-mono space-y-2">
          <div><strong>Has Key:</strong> {debugInfo.hasKey ? '✅ Yes' : '❌ No'}</div>
          <div><strong>Key Length:</strong> {debugInfo.keyLength || 'N/A'}</div>
          <div><strong>Key Preview:</strong> {debugInfo.keyPreview || 'N/A'}</div>
          <div><strong>Is Valid:</strong> {debugInfo.isValid ? '✅ Yes' : '❌ No'}</div>
          <div><strong>Full Key:</strong> {debugInfo.fullKey || 'None'}</div>
          <div><strong>Storage Value:</strong> {debugInfo.storageKey || 'None'}</div>
          <div><strong>Check Time:</strong> {debugInfo.timestamp}</div>
          
          <Button 
            onClick={handleClearKey}
            variant="destructive" 
            size="sm"
            className="text-xs mt-2"
          >
            Clear Stored Key & Reload
          </Button>
        </div>
      )}
    </div>
  );
};

export default ApiKeyDebugButton;
