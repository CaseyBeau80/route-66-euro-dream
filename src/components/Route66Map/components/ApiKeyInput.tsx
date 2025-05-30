
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Check if API key is already stored in localStorage
    const storedApiKey = localStorage.getItem('google_maps_api_key');
    if (storedApiKey) {
      setIsSubmitted(true);
      onApiKeySet(storedApiKey);
    }
  }, [onApiKeySet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('google_maps_api_key', apiKey.trim());
      setIsSubmitted(true);
      onApiKeySet(apiKey.trim());
    }
  };

  const handleReset = () => {
    localStorage.removeItem('google_maps_api_key');
    setApiKey('');
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="w-full h-[600px] bg-green-50 border border-green-200 rounded-lg flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-green-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">API Key Set Successfully!</h3>
          <p className="text-green-700 mb-4">Your Google Maps API key has been stored securely.</p>
          <Button onClick={handleReset} variant="outline" size="sm">
            Change API Key
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <div className="text-blue-600 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.414-6.414a2 2 0 012.828 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Google Maps API Key Required</h3>
        <p className="text-blue-700 mb-6 text-sm">
          Please enter your Google Maps API key to load the Route 66 map. Your key will be stored securely in your browser.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter your Google Maps API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full"
          />
          <Button type="submit" disabled={!apiKey.trim()} className="w-full">
            Save API Key
          </Button>
        </form>
        
        <p className="text-xs text-blue-600 mt-4">
          Get your API key from the{' '}
          <a 
            href="https://console.cloud.google.com/apis/credentials" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-blue-800"
          >
            Google Cloud Console
          </a>
        </p>
      </div>
    </div>
  );
};

export default ApiKeyInput;
