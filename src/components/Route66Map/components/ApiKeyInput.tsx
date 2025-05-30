
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Key, AlertCircle, CheckCircle } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  error?: string;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet, error }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    
    setIsSubmitting(true);
    try {
      onApiKeySet(apiKey.trim());
    } catch (error) {
      console.error('Error setting API key:', error);
    }
    setIsSubmitting(false);
  };

  const handleClearKey = () => {
    localStorage.removeItem('google_maps_api_key');
    setApiKey('');
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Key className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle>Google Maps API Key Required</CardTitle>
          <CardDescription>
            To display the Route 66 map, please enter a valid Google Maps API key
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter your Google Maps API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={!apiKey.trim() || isSubmitting}
              >
                {isSubmitting ? 'Loading...' : 'Load Map'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={handleClearKey}
                disabled={isSubmitting}
              >
                Clear Stored Key
              </Button>
            </div>
          </form>

          <div className="text-sm text-gray-600 space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="font-medium text-blue-800 mb-2">Need an API key?</p>
              <ol className="list-decimal list-inside space-y-1 text-xs text-blue-700">
                <li>Go to Google Cloud Console</li>
                <li>Create a new project or select existing</li>
                <li>Enable the "Maps JavaScript API"</li>
                <li>Create credentials (API key)</li>
                <li>Optionally restrict the key to your domain</li>
              </ol>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="font-medium text-green-800">Required APIs</p>
              </div>
              <p className="text-xs text-green-700">
                Make sure these APIs are enabled in your Google Cloud project:
              </p>
              <ul className="list-disc list-inside text-xs text-green-700 mt-1">
                <li>Maps JavaScript API</li>
                <li>Geocoding API (optional, for better search)</li>
              </ul>
            </div>
            
            <a
              href="https://developers.google.com/maps/documentation/javascript/get-api-key"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline"
            >
              Get a Google Maps API key
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyInput;
