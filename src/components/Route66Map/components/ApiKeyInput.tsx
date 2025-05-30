
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Key, AlertCircle } from 'lucide-react';

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

  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Key className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle>Google Maps API Key Required</CardTitle>
          <CardDescription>
            To display the Route 66 map, please enter your Google Maps API key
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
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!apiKey.trim() || isSubmitting}
            >
              {isSubmitting ? 'Loading...' : 'Load Map'}
            </Button>
          </form>

          <div className="text-sm text-gray-600 space-y-2">
            <p className="font-medium">Need an API key?</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Go to Google Cloud Console</li>
              <li>Enable the Maps JavaScript API</li>
              <li>Create credentials (API key)</li>
              <li>Restrict the key to your domain (optional but recommended)</li>
            </ol>
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
