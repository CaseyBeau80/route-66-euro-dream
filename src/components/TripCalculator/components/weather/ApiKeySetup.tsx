
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, AlertCircle, ExternalLink } from 'lucide-react';
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';

interface ApiKeySetupProps {
  onApiKeySet: () => void;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ 
  onApiKeySet, 
  isSharedView = false, 
  isPDFExport = false 
}) => {
  const [apiKey, setApiKey] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const weatherService = EnhancedWeatherService.getInstance();

  console.log('🔑 ApiKeySetup: Rendering', { isSharedView, isPDFExport });

  // Don't show API key setup in shared views or PDF exports
  if (isSharedView || isPDFExport) {
    return (
      <div className="bg-gray-50 rounded border border-gray-200 p-3 text-center">
        <div className="text-sm text-gray-500 mb-2">
          🌤️ Weather information unavailable
        </div>
        <div className="text-xs text-gray-400">
          Live weather requires API configuration
        </div>
      </div>
    );
  }

  const handleSetApiKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      weatherService.setApiKey(apiKey.trim());
      weatherService.refreshApiKey();
      
      // Verify the API key works
      const hasKey = weatherService.hasApiKey();
      if (hasKey) {
        onApiKeySet();
      } else {
        setError('API key could not be set');
      }
    } catch (err) {
      setError('Invalid API key format');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2 border-blue-300 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-blue-700">
          <Key className="h-5 w-5" />
          🌤️ Weather API Setup Required
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="bg-blue-100 border border-blue-200 rounded p-3">
            <p className="text-sm text-blue-700 font-medium mb-1">
              Get live weather forecasts for your Route 66 journey!
            </p>
            <p className="text-xs text-blue-600">
              Enter your OpenWeatherMap API key below to see current weather and 5-day forecasts for each destination.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter your OpenWeatherMap API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="text-sm flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSetApiKey}
                size="sm"
                disabled={isLoading || !apiKey.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Setting...' : 'Enable Weather'}
              </Button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>

          <div className="border-t border-blue-200 pt-3">
            <a 
              href="https://openweathermap.org/api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium bg-white px-3 py-2 rounded border border-blue-200 hover:border-blue-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Get Free API Key at OpenWeatherMap
            </a>
            <div className="text-xs text-blue-500 mt-2 space-y-1">
              <p>• Free tier includes 1,000 API calls per day</p>
              <p>• No credit card required for basic plan</p>
              <p>• Takes 10-15 minutes to activate after signup</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeySetup;
