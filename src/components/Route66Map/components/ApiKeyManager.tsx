
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Settings, Trash2, ExternalLink } from 'lucide-react';

interface ApiKeyManagerProps {
  onApiKeyUpdate: (apiKey: string) => void;
  currentApiKey?: string;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ 
  onApiKeyUpdate, 
  currentApiKey 
}) => {
  const [newApiKey, setNewApiKey] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApiKey.trim()) return;

    setIsUpdating(true);
    try {
      onApiKeyUpdate(newApiKey.trim());
    } catch (error) {
      console.error('Failed to update API key:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = () => {
    if (confirm('Are you sure you want to remove your Google Maps API key? The map will stop working until you add a new one.')) {
      localStorage.removeItem('google_maps_api_key');
      window.location.reload();
    }
  };

  const maskedApiKey = currentApiKey 
    ? `${currentApiKey.substring(0, 8)}...${currentApiKey.substring(currentApiKey.length - 4)}`
    : 'Not set';

  if (!showInput) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Key className="w-4 h-4" />
            API Key Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <span className="text-gray-600">Current key: </span>
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">{maskedApiKey}</code>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInput(true)}
              className="flex items-center gap-1"
            >
              <Settings className="w-3 h-3" />
              Update Key
            </Button>
            
            {currentApiKey && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
                className="flex items-center gap-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-3 h-3" />
                Remove
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Key className="w-4 h-4" />
          Update API Key
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleUpdate} className="space-y-3">
          <Input
            type="text"
            placeholder="Enter new Google Maps API key"
            value={newApiKey}
            onChange={(e) => setNewApiKey(e.target.value)}
            className="font-mono text-sm"
            disabled={isUpdating}
          />
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              size="sm"
              disabled={!newApiKey.trim() || isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update Key'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowInput(false);
                setNewApiKey('');
              }}
            >
              Cancel
            </Button>
          </div>
        </form>

        <Alert>
          <AlertDescription className="text-xs">
            Updating your API key will reload the page to reinitialize Google Maps.
          </AlertDescription>
        </Alert>

        <a
          href="https://console.cloud.google.com/apis/credentials"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
        >
          Manage API Keys <ExternalLink className="w-3 h-3" />
        </a>
      </CardContent>
    </Card>
  );
};

export default ApiKeyManager;
