
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { Card, CardContent } from '@/components/ui/card';
import { Cloud, Key, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CentralizedWeatherApiKeyManager } from '../services/CentralizedWeatherApiKeyManager';
import SegmentWeatherWidget from './SegmentWeatherWidget';

interface WeatherTabContentProps {
  segments: DailySegment[];
  tripStartDate?: Date;
  tripId?: string;
  isVisible: boolean;
}

const WeatherTabContent: React.FC<WeatherTabContentProps> = ({
  segments,
  tripStartDate,
  tripId,
  isVisible
}) => {
  const [apiKey, setApiKey] = React.useState('');
  const [isStoring, setIsStoring] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const apiKeyManager = CentralizedWeatherApiKeyManager.getInstance();
  const hasApiKey = apiKeyManager.hasApiKey();

  const handleStoreApiKey = async () => {
    if (!apiKey.trim()) {
      setMessage('Please enter an API key');
      return;
    }

    setIsStoring(true);
    try {
      apiKeyManager.setApiKey(apiKey.trim());
      setMessage('✅ API key saved! Refreshing weather data...');
      setApiKey('');
      
      // Refresh the page to reload with new API key
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage('❌ Invalid API key. Please check your key and try again.');
    } finally {
      setIsStoring(false);
    }
  };

  if (!isVisible) return null;

  // Show API key setup if no key is available
  if (!hasApiKey) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Cloud className="h-12 w-12 text-route66-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-route66-text-primary mb-2">
            🌤️ Live Weather Forecasts
          </h3>
          <p className="text-route66-text-secondary mb-6">
            Get real-time weather forecasts for each day of your Route 66 journey
          </p>
        </div>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-blue-700 mb-4">
                <Key className="w-6 h-6" />
                <h4 className="text-lg font-semibold">API Key Required</h4>
              </div>
              
              <p className="text-blue-600 mb-4">
                To display live weather forecasts, you need to provide your own free OpenWeatherMap API key.
                This ensures you have full control over your weather data usage.
              </p>
              
              <div className="max-w-md mx-auto space-y-3">
                <Input
                  type="password"
                  placeholder="Enter your OpenWeatherMap API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full"
                />
                <Button 
                  onClick={handleStoreApiKey}
                  disabled={isStoring || !apiKey.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isStoring ? 'Saving...' : 'Save API Key & Enable Weather'}
                </Button>
              </div>
              
              {message && (
                <p className={`text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
              )}
              
              <div className="flex items-center justify-center gap-2 text-blue-600 mt-4">
                <ExternalLink className="w-4 h-4" />
                <a 
                  href="https://openweathermap.org/api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm hover:underline font-medium"
                >
                  Get your free API key from OpenWeatherMap
                </a>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-left">
                <h5 className="font-medium text-blue-800 mb-2">Why do I need my own API key?</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 100% free for up to 1,000 calls per day</li>
                  <li>• No credit card required</li>
                  <li>• Your data, your control</li>
                  <li>• Keys activate within 10 minutes</li>
                  <li>• Stored securely in your browser only</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show weather widgets when API key is available
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Cloud className="h-12 w-12 text-route66-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-route66-text-primary mb-2">
          Live Weather Forecasts
        </h3>
        <p className="text-route66-text-secondary mb-4">
          Weather forecasts for each day of your Route 66 journey
        </p>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          ✅ API Key Configured
        </Badge>
      </div>

      {segments.map((segment, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="font-medium">
                  Day {segment.day}
                </Badge>
                <div>
                  <h4 className="font-semibold text-route66-text-primary">
                    {segment.startCity} → {segment.endCity}
                  </h4>
                  {tripStartDate && (
                    <p className="text-sm text-route66-text-secondary">
                      {new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <SegmentWeatherWidget
              segment={segment}
              tripStartDate={tripStartDate}
              tripId={tripId}
              isSharedView={false}
              isPDFExport={false}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WeatherTabContent;
