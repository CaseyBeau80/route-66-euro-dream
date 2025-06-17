
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoogleMapsIntegrationService } from '../services/GoogleMapsIntegrationService';
import { toast } from '@/hooks/use-toast';

interface GoogleMapsApiInputProps {
  onApiKeySet?: (hasKey: boolean) => void;
  className?: string;
}

const GoogleMapsApiInput: React.FC<GoogleMapsApiInputProps> = ({
  onApiKeySet,
  className = ""
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isSet, setIsSet] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if API key is already set
    const existingKey = GoogleMapsIntegrationService.getApiKey();
    if (existingKey) {
      setIsSet(true);
      onApiKeySet?.(true);
    }
  }, [onApiKeySet]);

  const handleSetApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a Google Maps API key",
        variant: "destructive"
      });
      return;
    }

    try {
      GoogleMapsIntegrationService.setApiKey(apiKey.trim());
      setIsSet(true);
      setApiKey('');
      setIsVisible(false);
      
      toast({
        title: "Google Maps API Connected!",
        description: "Distance calculations will now use Google Maps for higher accuracy",
        variant: "default"
      });
      
      onApiKeySet?.(true);
    } catch (error) {
      toast({
        title: "Failed to Set API Key",
        description: "Please check your API key and try again",
        variant: "destructive"
      });
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('google_maps_api_key');
    setIsSet(false);
    setIsVisible(false);
    
    toast({
      title: "Google Maps API Disconnected",
      description: "Distance calculations will use estimated values",
      variant: "default"
    });
    
    onApiKeySet?.(false);
  };

  if (isSet && !isVisible) {
    return (
      <Card className={`border-green-200 bg-green-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700">
                ✅ Google Maps API Connected
              </span>
              <span className="text-xs text-green-600">
                (Enhanced accuracy enabled)
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVisible(true)}
                className="text-xs"
              >
                Update Key
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearApiKey}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-blue-200 bg-blue-50 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
          🗺️ Google Maps Integration
          <span className="text-xs font-normal text-blue-600">
            (Optional - for enhanced accuracy)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-xs text-blue-700">
            Connect your Google Maps API key for more accurate distance and drive time calculations.
            Without it, we'll use estimated calculations.
          </p>
          
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Enter Google Maps API Key (optional)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleSetApiKey()}
            />
            <Button
              onClick={handleSetApiKey}
              size="sm"
              className="whitespace-nowrap"
            >
              Connect
            </Button>
          </div>
          
          <div className="text-xs text-blue-600">
            <p>
              🔒 Your API key is stored locally in your browser and never shared.
            </p>
            <p>
              📖 Need an API key? Visit <a 
                href="https://developers.google.com/maps/documentation/distance-matrix/get-api-key" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline hover:text-blue-800"
              >
                Google Maps Platform
              </a>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleMapsApiInput;
