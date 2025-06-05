
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, ExternalLink, CheckCircle } from 'lucide-react';
import { GoogleDistanceMatrixService } from '../services/GoogleDistanceMatrixService';

interface ApiKeyInputProps {
  onApiKeySet: () => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const validateAndSaveApiKey = async () => {
    if (!apiKey.trim()) return;

    setIsValidating(true);
    try {
      GoogleDistanceMatrixService.setApiKey(apiKey.trim());
      setIsValid(true);
      onApiKeySet();
    } catch (error) {
      console.error('API key validation failed:', error);
      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const existingKey = GoogleDistanceMatrixService.getApiKey();

  if (existingKey && !isValidating) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Google Maps API key is configured. Enhanced distance calculations are enabled!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-[#e2e8f0]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#1e293b]">
          <Key className="w-5 h-5 text-[#3b82f6]" />
          Google Maps API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key" className="text-[#1e293b] font-medium">
            API Key
          </Label>
          <Input
            id="api-key"
            type="password"
            placeholder="Enter your Google Maps API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="border-[#e2e8f0] focus:border-[#3b82f6]"
          />
        </div>

        <Button
          onClick={validateAndSaveApiKey}
          disabled={!apiKey.trim() || isValidating}
          className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white"
        >
          {isValidating ? 'Validating...' : 'Save API Key'}
        </Button>

        <Alert>
          <AlertDescription className="text-sm text-[#64748b]">
            <strong>Enhanced Features:</strong> Adding a Google Maps API key enables:
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>Accurate driving distances instead of straight-line calculations</li>
              <li>Real-world travel time estimates</li>
              <li>Route-specific duration planning</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="flex items-center gap-2 text-sm text-[#3b82f6]">
          <ExternalLink className="w-4 h-4" />
          <a 
            href="https://developers.google.com/maps/documentation/distance-matrix/get-api-key" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Get your Google Maps API key
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
