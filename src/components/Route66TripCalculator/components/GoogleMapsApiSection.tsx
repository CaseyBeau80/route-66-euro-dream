
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { GoogleDistanceMatrixService } from '../../Route66Planner/services/GoogleDistanceMatrixService';
import { toast } from '@/hooks/use-toast';

interface GoogleMapsApiSectionProps {
  onApiKeyChange?: (hasApiKey: boolean) => void;
}

const GoogleMapsApiSection: React.FC<GoogleMapsApiSectionProps> = ({ onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    const existingKey = GoogleDistanceMatrixService.getApiKey();
    const keyExists = !!existingKey;
    setHasApiKey(keyExists);
    onApiKeyChange?.(keyExists);
  }, [onApiKeyChange]);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google Maps API key",
        variant: "destructive"
      });
      return;
    }

    try {
      GoogleDistanceMatrixService.setApiKey(apiKey.trim());
      setHasApiKey(true);
      setShowInput(false);
      setApiKey('');
      
      toast({
        title: "Google Maps API Connected! 🗺️",
        description: "Your trip distances will now use real Google Maps data for accurate planning",
        variant: "default"
      });

      onApiKeyChange?.(true);
    } catch (error) {
      toast({
        title: "Failed to Save API Key",
        description: "Please check your API key and try again",
        variant: "destructive"
      });
    }
  };

  const handleRemoveApiKey = () => {
    GoogleDistanceMatrixService.clearCache();
    localStorage.removeItem('google_maps_api_key');
    setHasApiKey(false);
    setShowInput(false);
    
    toast({
      title: "Google Maps API Disconnected",
      description: "Trip distances will use estimated calculations",
      variant: "default"
    });

    onApiKeyChange?.(false);
  };

  if (hasApiKey && !showInput) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-900">Google Maps API Connected</h4>
                <p className="text-sm text-green-800">
                  Your trip will use accurate driving distances and times
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInput(true)}
                className="text-green-700 border-green-300 hover:bg-green-100"
              >
                Update Key
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveApiKey}
                className="text-red-700 border-red-300 hover:bg-red-100"
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
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-2">
          <Key className="h-5 w-5" />
          Enhanced Distance Accuracy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Get Real Driving Distances:</strong> Add your Google Maps API key to calculate 
            actual driving distances between cities instead of estimated straight-line distances.
          </AlertDescription>
        </Alert>

        {!showInput ? (
          <div className="space-y-3">
            <p className="text-sm text-blue-800">
              Without Google Maps API, we'll use estimated distances that may not reflect real driving routes.
            </p>
            <Button
              onClick={() => setShowInput(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Google Maps API Key
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter your Google Maps API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveApiKey()}
              />
              <Button onClick={handleSaveApiKey} className="whitespace-nowrap">
                Save
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowInput(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        )}

        <div className="text-xs text-blue-700 space-y-1">
          <p>🔒 Your API key is stored securely in your browser</p>
          <p>💰 You only pay Google for actual API usage</p>
          <div className="flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            <a 
              href="https://developers.google.com/maps/documentation/distance-matrix/get-api-key" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-blue-900"
            >
              Get your Google Maps API key here
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleMapsApiSection;
