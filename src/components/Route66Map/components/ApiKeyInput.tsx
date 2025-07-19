
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, ExternalLink, AlertTriangle, Info } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  error?: string;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet, error }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  const validateApiKey = (key: string): string | null => {
    if (!key.trim()) {
      return 'Please enter an API key';
    }
    
    if (key.length < 30) {
      return 'API key appears to be too short. Google Maps API keys are typically 39 characters long.';
    }
    
    const invalidPrefixes = ['your_api_key', 'enter_your', 'demo', 'test', 'placeholder'];
    const keyLower = key.toLowerCase();
    
    for (const prefix of invalidPrefixes) {
      if (keyLower.includes(prefix)) {
        return 'Please enter your actual API key, not placeholder text.';
      }
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateApiKey(apiKey);
    if (validation) {
      setValidationError(validation);
      return;
    }
    
    setIsSubmitting(true);
    setValidationError('');
    
    try {
      console.log('🔑 Setting Google Maps API key');
      onApiKeySet(apiKey.trim());
    } catch (err) {
      setValidationError('Failed to set API key. Please try again.');
      setIsSubmitting(false);
    }
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
            Enter your Google Maps API key to view the interactive Route 66 map
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {validationError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Why do I need this?</strong> Google Maps requires a valid API key to display maps. 
              The previous hardcoded key was restricted and caused errors.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter your Google Maps API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono text-sm"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Should be about 39 characters starting with "AIzaSy"
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!apiKey.trim() || isSubmitting}
            >
              {isSubmitting ? 'Setting up...' : 'Load Route 66 Map'}
            </Button>
          </form>

          <div className="space-y-3 pt-4 border-t">
            <div>
              <h4 className="font-semibold text-sm mb-2">How to get a free Google Maps API key:</h4>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Go to the Google Cloud Console</li>
                <li>Create a new project or select an existing one</li>
                <li>Enable the Maps JavaScript API</li>
                <li>Create credentials (API key)</li>
                <li>Copy your API key and paste it above</li>
              </ol>
            </div>
            
            <div className="flex justify-center">
              <a
                href="https://developers.google.com/maps/documentation/javascript/get-api-key"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Get API Key (Free) <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Privacy:</strong> Your API key is stored locally in your browser and never sent to our servers. 
              You can remove it anytime by clearing your browser data.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyInput;
