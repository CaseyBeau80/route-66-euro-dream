
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, AlertCircle } from 'lucide-react';
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
    <Card className="border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
          <Key className="h-4 w-4" />
          Weather API Setup Required
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="text-xs text-gray-600">
            Enter your OpenWeatherMap API key to get live weather forecasts:
          </div>
          
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Enter API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="text-sm"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSetApiKey}
              size="sm"
              disabled={isLoading || !apiKey.trim()}
            >
              {isLoading ? 'Setting...' : 'Set'}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600">
              <AlertCircle className="h-3 w-3" />
              {error}
            </div>
          )}

          <div className="text-xs text-gray-500">
            <a 
              href="https://openweathermap.org/api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Get a free API key
            </a>
            {' '}• Historical data shown as fallback
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeySetup;
