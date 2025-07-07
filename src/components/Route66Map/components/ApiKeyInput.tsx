import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  error?: string;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet, error }) => {
  // AUTO-SET THE API KEY - No user input needed!
  React.useEffect(() => {
    const hardcodedApiKey = 'AIzaSyCj2hJjT8wA0G3gBmUaK7qmhKX8Uv3mDH8';
    console.log('🔑 ApiKeyInput: Auto-setting hardcoded API key');
    onApiKeySet(hardcodedApiKey);
  }, [onApiKeySet]);

  // Show loading state instead of the input form
  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle>Loading Route 66 Map...</CardTitle>
          <CardDescription>
            Initializing Google Maps with API key
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-4">Please wait while we load your map</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyInput;