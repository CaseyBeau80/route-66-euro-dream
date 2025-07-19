import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  error?: string;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet, error }) => {
  const [apiKey, setApiKey] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    
    setIsLoading(true);
    console.log('🔑 Setting Google Maps API key');
    
    // Store in localStorage and call the callback
    localStorage.setItem('google_maps_api_key', apiKey.trim());
    onApiKeySet(apiKey.trim());
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader className="text-center">
          <CardTitle>Google Maps API Key Required</CardTitle>
          <CardDescription>
            Please enter your Google Maps API key to view the Route 66 map
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Google Maps API key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            <button
              type="submit"
              disabled={!apiKey.trim() || isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : 'Load Map'}
            </button>
          </form>
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>Need an API key? Visit the Google Cloud Console to create one.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyInput;